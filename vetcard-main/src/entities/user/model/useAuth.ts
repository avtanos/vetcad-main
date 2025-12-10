import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import type { User } from './types';

let authState: { isAuthenticated: boolean; user: User | null } = {
    isAuthenticated: false,
    user: null,
};

const token = localStorage.getItem('authToken');
const savedUser = localStorage.getItem('user');
if (token && savedUser) {
    authState = {
        isAuthenticated: true,
        user: JSON.parse(savedUser)
    };
}

export const useAuth = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(authState.isAuthenticated);
  const [user, setUser] = useState<User | null>(authState.user);

  const login = (userData: User, accessToken?: string) => {
    if (accessToken) {
      localStorage.setItem('authToken', accessToken);
    }
    localStorage.setItem('user', JSON.stringify(userData));
    authState = { isAuthenticated: true, user: userData };
    setIsAuthenticated(true);
    setUser(userData);
    navigate('/dashboard'); 
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('registrationProgress');
    authState = { isAuthenticated: false, user: null };
    setIsAuthenticated(false);
    setUser(null);
    navigate('/'); 
  };

  return {
    isAuthenticated,
    user,
    login,
    logout
  };
};