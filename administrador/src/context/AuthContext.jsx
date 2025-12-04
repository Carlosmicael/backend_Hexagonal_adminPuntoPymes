import { createContext, useState, useContext, useEffect } from 'react';
import authService from '../api/auth';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);    
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser)); 
    }
    setLoading(false); 
  }, []);

  
  const login = async (usuario, password) => {
    const data = await authService.login(usuario, password);
    setUser(data);
    localStorage.setItem('user', JSON.stringify(data)); 
    return data;
  };

  const logout = () => {
    authService.logout(); 
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = { user, isAuthenticated: !!user, loading, login, logout };

  if (loading) return <div>Cargando sesión...</div>;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
