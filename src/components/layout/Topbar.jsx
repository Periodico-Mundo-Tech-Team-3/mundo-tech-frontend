import React, { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';
import { isAuthor } from '../../utils/permissions';
import { Sun, Moon } from 'lucide-react'; 
import './Topbar.scss';

export const Topbar = () => {
  const { currentUser } = useAuth(); 
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation(); 

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/my-articles':
        return '';
      case '/new-article':
        return 'Nuevo artículo';
      case '/in-review':
        return 'En revisión';
      case '/published':
        return 'Publicados';
      case '/preview':
        return 'Vista previa del borrador';
      default:
        return 'Mundo Tech';
    }
  };

  return (
    <header className="topbar" role="banner">
      <h1 className="topbar__title">{getPageTitle()}</h1>
      
      <div className="topbar__actions">
       
        <div className="theme-toggle">
          <span className="theme-toggle__icon" aria-hidden="true">
            {theme === 'dark' ? (
              <Moon size={18} className="icon-moon" />
            ) : (
              <Sun size={18} className="icon-sun" />
            )}
          </span>
          <label className="switch" htmlFor="dark-mode-input">
            <span className="sr-only">Modo oscuro</span>
            <input
              id="dark-mode-input"
              type="checkbox"
              checked={theme === 'dark'}
              onChange={toggleTheme}
            />
            <span className="slider round"></span>
          </label>
          <span className="theme-toggle__label" aria-hidden="true">Modo oscuro</span>
        </div>

        {/* Botón de "Nuevo artículo" visible solo para Autores */}
        {isAuthor(currentUser) && (
          <button 
            className="btn-new-article" 
            onClick={() => navigate('/new-article')}
            aria-label="Crear nuevo artículo"
          >
            <span className="btn-new-article__icon">+</span>
            <span className="btn-new-article__text">Nuevo artículo</span>
          </button>
        )}
      </div>
    </header>
  );
};