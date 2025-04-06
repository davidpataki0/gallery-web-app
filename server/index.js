const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const authRoutes = require('./routes/auth');
const photoRoutes = require('./routes/photos');
const { verifyToken } = require('./middleware/auth');

// Konfigurációs fájl betöltése
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB kapcsolat
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Sikeres MongoDB kapcsolat'))
  .catch(err => console.error('MongoDB kapcsolódási hiba:', err));

// API útvonalak
app.use('/api/auth', authRoutes);
app.use('/api/photos', photoRoutes);

// Statikus fájlok kiszolgálása (production környezetben)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/public')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/public', 'index.html'));
  });
}

// Port beállítása (Heroku-kompatibilis)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`A szerver fut a következő porton: ${PORT}`);
});
