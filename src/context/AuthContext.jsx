import { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_USERS } from '../mocks/users';
import { deleteAccount as deleteAccountApi } from '../services/userService';

const STORAGE_KEY = 'mundotech_user';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
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

  const deleteAccount = async () => {
    if (!currentUser) return { success: false, error: 'No hay sesión activa' };
    try {
      await deleteAccountApi(currentUser.id);
      setCurrentUser(null);
      return { success: true };
    } catch {
      return { success: false, error: 'No se pudo eliminar la cuenta' };
    }
  };

  const value = {
    currentUser,
    isAuthenticated: Boolean(currentUser),
    login,
    logout,
    deleteAccount,
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