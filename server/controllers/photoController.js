const Photo = require('../models/Photo');
const cloudinary = require('../config/cloudinary');

// Összes fotó lekérése (rendezéssel)
exports.getAllPhotos = async (req, res) => {
  try {
    const { sort = 'uploadDate', order = 'desc' } = req.query;
    
    // Rendezési opciók validálása
    const validSortFields = ['name', 'uploadDate'];
    const validOrders = ['asc', 'desc'];
    
    const sortField = validSortFields.includes(sort) ? sort : 'uploadDate';
    const sortOrder = validOrders.includes(order) ? order : 'desc';
    
    // Rendezési paraméter összeállítása
    const sortOptions = {};
    sortOptions[sortField] = sortOrder === 'asc' ? 1 : -1;
    
    // Fotók lekérése rendezett módon
    const photos = await Photo.find()
      .sort(sortOptions)
      .populate('user', 'username');
    
    res.json(photos);
  } catch (error) {
    console.error('Fotó lekérési hiba:', error);
    res.status(500).json({ message: 'Szerver hiba történt' });
  }
};

// Egy fotó részletes adatainak lekérése
exports.getPhotoById = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id)
      .populate('user', 'username');
    
    if (!photo) {
      return res.status(404).json({ message: 'A fotó nem található' });
    }
    
    res.json(photo);
  } catch (error) {
    console.error('Fotó részletek lekérési hiba:', error);
    res.status(500).json({ message: 'Szerver hiba történt' });
  }
};

// Új fotó feltöltése
exports.uploadPhoto = async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'Nincs kiválasztott fájl' });
    }
    
    if (!name || name.length > 40) {
      return res.status(400).json({ 
        message: 'A név kötelező és maximum 40 karakter lehet' 
      });
    }
    
    // Kép feltöltése Cloudinary-ra
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'photo_album'
    });
    
    // Új fotó létrehozása az adatbázisban
    const newPhoto = new Photo({
      name,
      imageUrl: result.secure_url,
      cloudinaryId: result.public_id,
      user: req.user.id
    });
    
    await newPhoto.save();
    
    res.status(201).json(newPhoto);
  } catch (error) {
    console.error('Fotó feltöltési hiba:', error);
    res.status(500).json({ message: 'Szerver hiba történt' });
  }
};

// Fotó törlése
exports.deletePhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    
    if (!photo) {
      return res.status(404).json({ message: 'A fotó nem található' });
    }
    
    // Ellenőrizzük, hogy a felhasználó jogosult-e törölni a fotót
    if (photo.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Nincs jogosultsága törölni ezt a fotót' });
    }
    
    // Kép törlése Cloudinary-ról
    await cloudinary.uploader.destroy(photo.cloudinaryId);
    
    // Fotó törlése az adatbázisból - itt van a javítás
    await Photo.deleteOne({ _id: photo._id });
    // Alternatív megoldás: await Photo.findByIdAndDelete(photo._id);
    
    res.json({ message: 'Fotó sikeresen törölve' });
  } catch (error) {
    console.error('Fotó törlési hiba:', error);
    res.status(500).json({ message: 'Szerver hiba történt' });
  }
};
