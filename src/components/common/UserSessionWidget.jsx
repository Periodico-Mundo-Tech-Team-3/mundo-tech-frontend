import React from 'react';
import { LogOut } from 'lucide-react';
import './UserSessionWidget.scss';

export const UserSessionWidget = ({ user, onLogout }) => {
  if (!user) return null;

  //Extracción de las iniciales para el avatar en mayúsculas
  const userInitials = user.name
    ? user.name.split(' ').map((word) => word[0]).join('').toUpperCase()
    : 'U';

  const formattedRoles = user.roles
      ? user.roles
          .map(({ name }) => name.charAt(0).toUpperCase() + name.slice(1))
          .join(' / ')
      : 'Sin rol';

  return (
    <div className="user-profile-card">
      <div className="user-profile-card__avatar" aria-hidden="true">
        {userInitials}
      </div>
      
      <div className="user-profile-card__details">
        <span className="user-profile-card__name">{user.name}</span>
        <span className="user-profile-card__role">{formattedRoles}</span>
      </div>
      
      <button 
        className="user-profile-card__logout-button" 
        onClick={onLogout}
        aria-label="Cerrar sesión"
      >
        <LogOut size={18} strokeWidth={2} />
      </button>
    </div>
  );
};