import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { isAuthor, isManager } from '../../utils/permissions';
import { FileText, PenTool, ClipboardCheck, Globe } from 'lucide-react';
import { UserSessionWidget } from '../common/UserSessionWidget';
import './Sidebar.scss';

export const Sidebar = ({ inReviewCount = 3 }) => {
  const { user, logout } = useAuth(); 
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar" aria-label="Menú principal de navegación">
      <div className="sidebar__brand">
        <h2 className="brand-title">Mundo Tech</h2>
        <span className="brand-subtitle">Back-office editorial</span>
      </div>

      <nav className="sidebar__nav">
        {isAuthor(user) && (
          <div className="sidebar__section">
            <h3 className="sidebar__section-title">REDACCIÓN</h3>
            <ul className="sidebar__list">
              <li>
                <NavLink 
                  to="/my-articles" 
                  className={({ isActive }) => `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
                >
                  <span className="sidebar__link-icon">
                    <FileText size={18} strokeWidth={2} />
                  </span>
                  <span>Mis artículos</span>
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/new-article" 
                  className={({ isActive }) => `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
                >
                  <span className="sidebar__link-icon">
                    <PenTool size={18} strokeWidth={2} />
                  </span>
                  <span>Nuevo artículo</span>
                </NavLink>
              </li>
            </ul>
          </div>
        )}

        {isManager(user) && (
          <div className="sidebar__section">
            <h3 className="sidebar__section-title">EDITORIAL</h3>
            <ul className="sidebar__list">
              <li>
                <NavLink 
                  to="/in-review" 
                  className={({ isActive }) => `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
                >
                  <span className="sidebar__link-icon">
                    <ClipboardCheck size={18} strokeWidth={2} />
                  </span>
                  <span>En revisión</span>
                  {inReviewCount > 0 && (
                    <span className="badge-count" aria-label={`${inReviewCount} artículos en revisión`}>
                      {inReviewCount}
                    </span>
                  )}
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/published" 
                  className={({ isActive }) => `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
                >
                  <span className="sidebar__link-icon">
                    <Globe size={18} strokeWidth={2} />
                  </span>
                  <span>Publicados</span>
                </NavLink>
              </li>
            </ul>
          </div>
        )}
      </nav>

      <div className="sidebar__footer">
        <UserSessionWidget user={user} onLogout={handleLogout} />
      </div>
    </aside>
  );
};