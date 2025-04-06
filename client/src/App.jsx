import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PhotoDetail from './pages/PhotoDetail';
import UploadPhoto from './pages/UploadPhoto';
import { AuthContext } from './context/AuthContext';

const App = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Felhasználó bejelentkezési adatainak betöltése
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    
    setIsLoading(false);
  }, []);
  
  // Bejelentkezés kezelése
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('token', userData.token);
    localStorage.setItem('user', JSON.stringify(userData.user));
  };
  
  // Kijelentkezés kezelése
  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };
  
  // Védett útvonalak kezelése
  const ProtectedRoute = ({ children }) => {
    if (isLoading) return <div>Betöltés...</div>;
    return user ? children : <Navigate to="/login" />;
  };
  
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <Router>
        <div className="app">
          <Navbar />
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/photos/:id" element={<PhotoDetail />} />
              <Route 
                path="/upload" 
                element={
                  <ProtectedRoute>
                    <UploadPhoto />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
