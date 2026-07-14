import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MainLayout } from '../layouts/MainLayout';
import { Login } from '../pages/Login/Login';
import MyArticles from '../pages/MyArticles/MyArticles';
import NewArticleForm from "../pages/NewArticleForm/NewArticleForm.jsx";

export const AppRouter = () => {
  const { currentUser, isAuthenticated, debugSetUser } = useAuth();

  const developerToolbarStyle = {
    padding: '24px',
    border: '1px dashed #ccc',
    borderRadius: '8px',
    backgroundColor: 'var(--color-surface-subtle, #faf8f3)',
    maxWidth: '550px',
    marginTop: '20px'
  };

  // Componente de demostración interno para renderizar las vistas sin necesidad de archivos externos
  const DemoSection = ({ title }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h2>Sección actual: {title}</h2>
        <p style={{ margin: '8px 0 0 0', color: 'var(--color-text-muted)' }}>
          Estás viendo una pre-visualización de esta interfaz dentro del Back-office.
        </p>
      </div>

      {/* PANEL PROVISIONAL PARA SIMULAR ROLES EN TIEMPO REAL */}
      <div style={developerToolbarStyle}>
        <h4 style={{ margin: '0 0 8px 0', color: '#1f4d3a' }}>🛠️ Panel de Pruebas Rápidas</h4>
        <p style={{ fontSize: '13px', margin: '0 0 16px 0', color: 'var(--color-text-muted)' }}>
          Usa estos botones para cambiar de rol al instante y verificar cómo reaccionan la Sidebar y la Topbar:
        </p>
        
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => debugSetUser(1)} 
            style={{ padding: '8px 12px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #1f4d3a', background: 'var(--color-surface)', color: 'var(--color-text)' }}
          >
            Simular Redactor (Carlos)
          </button>
          <button 
            onClick={() => debugSetUser(0)} 
            style={{ padding: '8px 12px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #1f4d3a', background: 'var(--color-surface)', color: 'var(--color-text)' }}
          >
            Simular Manager (Marta)
          </button>
          <button 
            onClick={() => debugSetUser(2)} 
            style={{ padding: '8px 12px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #1f4d3a', background: 'var(--color-surface)', color: 'var(--color-text)' }}
          >
            Simular Ambos Roles (Sofía)
          </button>
          <button 
            onClick={() => debugSetUser(-1)} 
            style={{ padding: '8px 12px', cursor: 'pointer', borderRadius: '4px', borderColor: '#ea4335', color: '#ea4335', background: 'var(--color-surface)' }}
          >
            Cerrar Sesión (Simular Null)
          </button>
        </div>

        <div style={{ marginTop: '16px', fontSize: '12px', color: 'var(--color-text)' }}>
          Usuario activo: <strong>{currentUser ? `${currentUser.name} (${currentUser.roles.join(', ')})` : 'Ninguno (Sesión vacía)'}</strong>
        </div>
      </div>
    </div>
  );

  return (
    <Routes>
      {/* 1. RUTA PÚBLICA: Pantalla de Login limpia */}
      <Route 
        path="/login" 
        element={!isAuthenticated ? <Login /> : <Navigate to="/my-articles" replace />} 
      />

      {/* 2. RUTAS PRIVADAS: Envueltas en el MainLayout si hay sesión activa */}
      <Route
        path="/*"
        element={
          isAuthenticated ? (
            <MainLayout>

              <Routes>
                {/* 
                  Mapeamos las rutas que usan tus NavLinks a nuestro componente inline.
                  ¡Esto te permite probar la navegación interactiva de la Sidebar sin crear un solo archivo extra!
                */}
                <Route path="/my-articles" element={<MyArticles />} />
                <Route path="/new-article" element={<DemoSection title="Nuevo artículo" />} />
                <Route path="/in-review" element={<DemoSection title="En revisión" />} />
                <Route path="/published" element={<DemoSection title="Publicados" />} />
                
                {/* Redirección por defecto si entran a una ruta inexistente */}
                <Route path="*" element={<Navigate to="/my-articles" replace />} />
              </Routes>
            </MainLayout>
          ) : (
            // Si no está autenticado, cualquier ruta rebota al Login
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
};