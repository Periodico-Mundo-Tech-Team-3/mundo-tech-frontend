import React, { useState } from 'react';
import { LogOut } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';
import './UserSessionWidget.scss';

export const UserSessionWidget = ({ user, onLogout, onDeleteAccount }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
        <button
          className="user-profile-card__delete-link"
          onClick={() => setShowDeleteModal(true)}
        >
          Eliminar cuenta
        </button>
      </div>
      
      <button 
        className="user-profile-card__logout-button" 
        onClick={onLogout}
        aria-label="Cerrar sesión"
      >
        <LogOut size={18} strokeWidth={2} />
      </button>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Eliminar cuenta"
      >
        <p>¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.</p>
        <div className="user-profile-card__delete-actions">
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={onDeleteAccount}>
            Sí, eliminar
          </Button>
        </div>
      </Modal>
    </div>
  );
};