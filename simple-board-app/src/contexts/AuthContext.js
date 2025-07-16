import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as loginApi } from '../api/authApi';
import { storage } from '../utils/commonUtils';

/**
 * 인증 Context
 */

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = storage.get('user');
    if (savedUser && savedUser.userId) {
      setUser(savedUser);
    } else {
      setUser(null);
    }
    setIsLoading(false);
  }, []);



  const login = async (userId, password) => {
    try {
      const response = await loginApi(userId, password);
      
      if (response.success !== false) {
        const userData = {
          userId: response.userId,
          name: response.name,
          email: response.email
        };
        setUser(userData);
        storage.set('user', userData);
        
        return { success: true };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('AuthContext - 로그인 오류:', error);
      return { success: false, message: '로그인에 실패했습니다.' };
    }
  };

  const logout = () => {
    setUser(null);
    storage.remove('user');
  };

  const updateUser = (userData) => {
    setUser(userData);
    storage.set('user', userData);
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 