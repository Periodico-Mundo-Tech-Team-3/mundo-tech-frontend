import React from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { MOCK_USERS } from './mocks/users';

function App() {
  // PRUEBA CAMBIANDO EL ÍNDICE AQUÍ:
  // MOCK_USERS[0] -> Marta (Manager: verá Editorial y Admin)
  // MOCK_USERS[1] -> Carlos (Author: verá Redacción)
  // MOCK_USERS[2] -> Sofía (Ambos: verá TODO)
  const usuarioActivo = MOCK_USERS[1]; 

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar 
        currentUser={usuarioActivo} 
        activeSection="mis-articulos"
        onNavigate={(id) => console.log(`Navegando a: ${id}`)}
        onLogout={() => alert('Logout pulsado')}
      />
      <div style={{ padding: '32px', color: '#202124' }}>
        <h3>Vista de pruebas del Sidebar</h3>
        <p>Estás viendo la interfaz como: <strong>{usuarioActivo.name}</strong></p>
      </div>
    </div>
  );
}

export default App;