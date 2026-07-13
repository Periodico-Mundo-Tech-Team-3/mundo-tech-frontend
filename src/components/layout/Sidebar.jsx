import React from 'react';
import { FileText, FilePlus, FileCheck, Globe } from 'lucide-react';
import { UserSessionWidget } from '../common/UserSessionWidget';
import './Sidebar.scss';

export const Sidebar = ({ currentUser, activeSection, onNavigate, onLogout }) => {
  

  const menuStructure = [
    {
      id: 'group-redaccion',
      title: 'REDACCIÓN',
      requiredRoles: ['author'],
      items: [
        { id: 'mis-articulos', label: 'Mis artículos', icon: FileText },
        { id: 'nuevo-articulo', label: 'Nuevo artículo', icon: FilePlus }
      ]
    },
    {
      id: 'group-editorial',
      title: 'EDITORIAL',
      requiredRoles: ['manager'],
      items: [
        { id: 'en-revision', label: 'En revisión', icon: FileCheck, badgeCount: 3 },
        { id: 'publicados', label: 'Publicados', icon: Globe }
      ]
    }
  ];

  const hasAccess = (requiredRoles) => {
    if (!currentUser || !currentUser.roles) return false;
    return requiredRoles.some(role => currentUser.roles.includes(role));
  };

  return (
    <aside className="sidebar-navigation" aria-label="Menú lateral de navegación">
      <div className="sidebar-navigation__brand">
        <h2 className="sidebar-navigation__brand-title">Mundo Tech</h2>
        <span className="sidebar-navigation__brand-subtitle">Back-office editorial</span>
      </div>

      <nav className="sidebar-navigation__menu">
        {menuStructure.map((group) => {
          if (!hasAccess(group.requiredRoles)) return null;

          return (
            <div key={group.id} className="sidebar-navigation__group">
              <span className="sidebar-navigation__group-title">{group.title}</span>
              <ul className="sidebar-navigation__list">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;

                  return (
                    <li key={item.id} className="sidebar-navigation__list-item">
                      <button
                        className={`sidebar-navigation__button ${isActive ? 'sidebar-navigation__button--active' : ''}`}
                        onClick={() => onNavigate(item.id)}
                      >
                        <Icon className="sidebar-navigation__button-icon" size={18} strokeWidth={2} />
                        <span className="sidebar-navigation__button-label">{item.label}</span>
                        {item.badgeCount !== undefined && (
                          <span className="sidebar-navigation__button-badge">{item.badgeCount}</span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>

      <div className="sidebar-navigation__footer">
        <UserSessionWidget user={currentUser} onLogout={onLogout} />
      </div>
    </aside>
  );
};