import { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_USERS } from '../mocks/users';

const STORAGE_KEY = 'mundotech_user';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
      
      // 💡 AUTOMOCK PARA DESARROLLO:
      // Si no hay sesión activa, usamos por defecto a Sofía para que veas 
      // TODAS las opciones del menú simultáneamente (Author y Manager).
      // Puedes cambiar el índice para probar vistas específicas:
      // MOCK_USERS[0] -> Marta Ruiz (Manager)
      // MOCK_USERS[1] -> Carlos Peña (Author)
      // MOCK_USERS[2] -> Sofía Lambert (Ambos roles)
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
    const user = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      return { success: false, error: 'Email o contraseña incorrectos' };
    }

    const { password: _omit, ...safeUser } = user;
    setCurrentUser(safeUser);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const debugSetUser = (userIndex) => {
    setCurrentUser(MOCK_USERS[userIndex] || null);
  };

  const value = {
    currentUser,
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