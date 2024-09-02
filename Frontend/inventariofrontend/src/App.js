import {useEffect } from 'react';
import './App.css';
import Login from './vistas/login';
import {Route, Routes, Navigate } from 'react-router-dom';

import React, {useState} from 'react';

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('token') !== null;
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(token !== null);
  }, []);
  
  const handleLogin = () => {
    setIsAuthenticated(true);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false); 
  };
  return (

    <div className="App">
      <div className="contenedor-principal-inicio">
        <div className='header'>
          <div className='header-texto'>
          {isAuthenticated && <div>
            <h1>Sistema de inventario</h1>
            </div>}
            {isAuthenticated && (
              <div>
                <button onClick={handleLogout} className="btn btn-secondary">
                  Cerrar Sesión
                </button>
              </div>
              )}
          </div>
          
        </div>
      </div>
      <div className='contenedor-principal-cuerpo'>
      <Routes>
            {isAuthenticated ? (
              <Route path="/" />
            ) : (
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
            )}
            <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
      </Routes>
      </div>
    </div>

  );
}

export default App;
