import { useState, useEffect, createContext, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { verifyCredentials } from './db/auth';
import { router } from 'expo-router';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        await AsyncStorage.removeItem('user'); // Limpiar sesión al inicio
        setUser(null);
      } catch (error) {
        console.error('Error clearing stored session:', error);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (username, password) => {
    try {
      const userData = await verifyCredentials(username.trim(), password);

      if (userData) {
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);

        if (userData.role === 'admin') {
          router.replace('/admin/users');
        } else {
          router.replace('/peliculas');
        }

        return { success: true };
      }

      return { success: false, error: 'Credenciales invalidas' };
    } catch (error) {
      console.error('Error durante el login:', error);
      return { success: false, error: 'Ocurrio un error durante el login' };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
      router.replace('/login');
    } catch (error) {
      console.error('Error durante el logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }

  return context;
};
