import { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_USERS } from '../mocks/users';

const STORAGE_KEY = 'mundotech_user';

// Exportamos explícitamente AuthContext para blindar importaciones antiguas/directas
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
      
      // AUTOMOCK PARA DESARROLLO:
      // Sofía Lambert (índice 2) carga por defecto con ambos roles para pruebas
      return MOCK_USERS[2]; 
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [currentUser]);

  const login = (email, password) => {
    const foundUser = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (!foundUser) {
      return { success: false, error: 'Email o contraseña incorrectos' };
    }

    const { password: _omit, ...safeUser } = foundUser;
    setCurrentUser(safeUser);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const debugSetUser = (userIndex) => {
    const foundUser = MOCK_USERS[userIndex];
    if (foundUser) {
      const { password: _omit, ...safeUser } = foundUser;
      setCurrentUser(safeUser);
    } else {
      setCurrentUser(null);
    }
  };

  const value = {
    currentUser,
    user: currentUser,
    isAuthenticated: Boolean(currentUser),
    login,
    logout,
    debugSetUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};