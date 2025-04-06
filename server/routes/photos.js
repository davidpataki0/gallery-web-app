const express = require('express');
const router = express.Router();
const photoController = require('../controllers/photoController');
const { verifyToken } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Multer konfigurálása a fájl feltöltésekhez
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Ellenőrzés, hogy kép fájl-e
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Csak képek tölthetők fel!'), false);
  }
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB maximum méret
  }
});

// Ideiglenes feltöltési mappa létrehozása
const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Fotók lekérése (nincs autentikáció szükséges)
router.get('/', photoController.getAllPhotos);

// Egy fotó részleteinek lekérése
router.get('/:id', photoController.getPhotoById);

// Fotó feltöltése (autentikáció szükséges)
router.post('/', verifyToken, upload.single('image'), photoController.uploadPhoto);

// Fotó törlése (autentikáció szükséges)
router.delete('/:id', verifyToken, photoController.deletePhoto);

module.exports = router;
