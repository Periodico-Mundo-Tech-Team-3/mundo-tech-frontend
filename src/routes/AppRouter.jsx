import React from 'react';
import { useAuth } from '../context/AuthContext';
import { MainLayout } from '../layouts/MainLayout';
import MyArticles from "../pages/MyArticles/MyArticles.jsx";

export const AppRouter = () => {
  const { currentUser, debugSetUser } = useAuth();

  const developerToolbarStyle = {
    marginTop: '32px',
    padding: '24px',
    border: '1px dashed #ccc',
    borderRadius: '8px',
    backgroundColor: 'var(--color-surface-subtle, #faf8f3)',
    maxWidth: '500px'
  };

  return (
    <MainLayout>
      <div style={{ padding: '20px' }}>
        <h2>¡Diseño Base Cargado con Éxito!</h2>
        <p>Tu Topbar y tu Sidebar se están alimentando directamente de la autenticación.</p>

        {/* PANEL PROVISIONAL PARA PROBAR ROLES EN EL SIDEBAR */}
        <div style={developerToolbarStyle}>
          <h4 style={{ margin: '0 0 12px 0', color: '#1f4d3a' }}>🛠️ Panel de Pruebas Rápidas</h4>
          <p style={{ fontSize: '13px', margin: '0 0 16px 0' }}>
            Haz clic en los botones de abajo para simular diferentes perfiles y ver cómo cambia la interfaz en tiempo real:
          </p>
          
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button 
              onClick={() => debugSetUser(1)} 
              style={{ padding: '8px 12px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #1f4d3a' }}
            >
              Simular Redactor (Carlos)
            </button>
            <button 
              onClick={() => debugSetUser(0)} 
              style={{ padding: '8px 12px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #1f4d3a' }}
            >
              Simular Manager (Marta)
            </button>
            <button 
              onClick={() => debugSetUser(2)} 
              style={{ padding: '8px 12px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #1f4d3a' }}
            >
              Simular Ambos Roles (Sofía)
            </button>
            <button 
              onClick={() => debugSetUser(-1)} 
              style={{ padding: '8px 12px', cursor: 'pointer', borderRadius: '4px', borderColor: '#ea4335', color: '#ea4335' }}
            >
              Cerrar Sesión (Simular Null)
            </button>
          </div>

          <div style={{ marginTop: '16px', fontSize: '12px' }}>
            Usuario actual en sesión: <strong>{currentUser ? `${currentUser.name} (${currentUser.roles.join(', ')})` : 'Ninguno (Sesión vacía)'}</strong>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};