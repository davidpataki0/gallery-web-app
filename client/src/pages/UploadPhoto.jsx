import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const UploadPhoto = () => {
  const [file, setFile] = useState(null);
  const [photoName, setPhotoName] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Fájl kiválasztás kezelése
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    // Ellenőrizzük, hogy a fájl kép-e
    if (selectedFile && !selectedFile.type.match(/^image\//)) {
      setError('Csak képfájlok tölthetők fel.');
      setFile(null);
      return;
    }
    
    setFile(selectedFile);
    setError(null);
  };
  
  // Képnév változásának kezelése
  const handleNameChange = (e) => {
    const name = e.target.value;
    if (name.length > 40) {
      setError('A név maximum 40 karakter lehet.');
    } else {
      setPhotoName(name);
      setError(null);
    }
  };
  
  // Kép feltöltése
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Kérjük, válasszon ki egy képet.');
      return;
    }
    
    if (!photoName.trim()) {
      setError('Kérjük, adjon meg egy nevet a képnek.');
      return;
    }
    
    if (photoName.length > 40) {
      setError('A név maximum 40 karakter lehet.');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // FormData objektum létrehozása a fájl és a név küldéséhez
      const formData = new FormData();
      formData.append('image', file);
      formData.append('name', photoName);
      
      // Kép feltöltése a szerverre
      const response = await axios.post('/api/photos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-auth-token': localStorage.getItem('token')
        }
      });
      
      // Sikeres feltöltés után navigálás a főoldalra
      navigate('/');
    } catch (err) {
      console.error('Feltöltési hiba:', err);
      setError(err.response?.data?.message || 'Hiba történt a feltöltés során.');
      setIsLoading(false);
    }
  };
  
  return (
    <div className="upload-container">
      <h2>Új kép feltöltése</h2>
      
      <form onSubmit={handleSubmit} className="upload-form">
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label htmlFor="photoName">Kép neve (max. 40 karakter):</label>
          <input 
            type="text" 
            id="photoName" 
            value={photoName} 
            onChange={handleNameChange} 
            maxLength={40} 
            required 
          />
          <div className="char-count">{photoName.length}/40</div>
        </div>
        
        <div className="form-group">
          <label htmlFor="photo">Válasszon képet:</label>
          <input 
            type="file" 
            id="photo" 
            onChange={handleFileChange} 
            accept="image/*" 
            required 
          />
        </div>
        
        {file && (
          <div className="preview-container">
            <h3>Előnézet:</h3>
            <img 
              src={URL.createObjectURL(file)} 
              alt="Előnézet" 
              className="image-preview" 
            />
          </div>
        )}
        
        <button 
          type="submit" 
          className="upload-button" 
          disabled={isLoading || !file || !photoName.trim()}
        >
          {isLoading ? 'Feltöltés...' : 'Feltöltés'}
        </button>
      </form>
    </div>
  );
};

export default UploadPhoto;
