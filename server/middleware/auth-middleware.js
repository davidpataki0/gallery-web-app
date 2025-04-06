const jwt = require('jsonwebtoken');

// JWT token érvényességének ellenőrzése
exports.verifyToken = (req, res, next) => {
  // Token keresése a fejlécben
  const token = req.header('x-auth-token');
  
  // Ha nincs token
  if (!token) {
    return res.status(401).json({ message: 'Hozzáférés megtagadva, token hiányzik' });
  }
  
  try {
    // Token dekódolása
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Felhasználó hozzáadása a kéréshez
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token ellenőrzési hiba:', error);
    res.status(401).json({ message: 'Érvénytelen token' });
  }
};
