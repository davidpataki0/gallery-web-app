import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { formatDate } from '../utils/formatDate';

const PhotoList = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('uploadDate');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Fotók lekérése a backendről
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/photos?sort=${sortBy}&order=${sortOrder}`);
        setPhotos(response.data);
        setLoading(false);
      } catch (err) {
        setError('Hiba történt a fotók betöltése során.');
        setLoading(false);
        console.error('Fotók lekérési hiba:', err);
      }
    };
    
    fetchPhotos();
  }, [sortBy, sortOrder]);
  
  // Rendezési beállítások kezelése
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };
  
  const handleOrderChange = (e) => {
    setSortOrder(e.target.value);
  };
  
  if (loading) return <div className="loading">Betöltés...</div>;
  if (error) return <div className="error">{error}</div>;
  
  return (
    <div className="photo-list">
      <div className="sort-controls">
        <div className="sort-group">
          <label>Rendezés:</label>
          <select value={sortBy} onChange={handleSortChange}>
            <option value="uploadDate">Dátum szerint</option>
            <option value="name">Név szerint</option>
          </select>
        </div>
        
        <div className="sort-group">
          <label>Sorrend:</label>
          <select value={sortOrder} onChange={handleOrderChange}>
            <option value="desc">Csökkenő</option>
            <option value="asc">Növekvő</option>
          </select>
        </div>
      </div>
      
      <div className="photo-grid">
        {photos.length === 0 ? (
          <p>Nincsenek fotók az adatbázisban.</p>
        ) : (
          <table className="photo-table">
            <thead>
              <tr>
                <th>Név</th>
                <th>Feltöltési idő</th>
                <th>Feltöltő</th>
                <th>Művelet</th>
              </tr>
            </thead>
            <tbody>
              {photos.map(photo => (
                <tr key={photo._id}>
                  <td>{photo.name}</td>
                  <td>{formatDate(photo.uploadDate)}</td>
                  <td>{photo.user.username}</td>
                  <td>
                    <Link to={`/photos/${photo._id}`} className="view-button">
                      Megtekintés
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PhotoList;
