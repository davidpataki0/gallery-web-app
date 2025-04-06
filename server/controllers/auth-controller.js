const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Felhasználó regisztráció
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Ellenőrizzük, hogy létezik-e már a felhasználónév vagy email
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: 'A megadott felhasználónév vagy email cím már foglalt' 
      });
    }

    // Új felhasználó létrehozása
    const newUser = new User({
      username,
      email,
      password
    });

    await newUser.save();

    // JWT token generálása
    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error('Regisztrációs hiba:', error);
    res.status(500).json({ message: 'Szerver hiba történt' });
  }
};

// Felhasználó bejelentkezés
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Felhasználó keresése email alapján
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Hibás email vagy jelszó' });
    }

    // Jelszó ellenőrzése
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Hibás email vagy jelszó' });
    }

    // JWT token generálása
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Bejelentkezési hiba:', error);
    res.status(500).json({ message: 'Szerver hiba történt' });
  }
};

// Aktuális felhasználó adatainak lekérése
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Felhasználó nem található' });
    }
    res.json(user);
  } catch (error) {
    console.error('Felhasználó lekérési hiba:', error);
    res.status(500).json({ message: 'Szerver hiba történt' });
  }
};
