import { useState, useEffect } from 'react';

interface User {
  email: string;
  name: string;
}

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setUser(JSON.parse(user));
      setIsAuthenticated(true);
    }
  }, []);

  const login = (email: string, password: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      // In a real app, this would be an API call
      if (email && password) {
        const user = { email, name: email.split('@')[0] };
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        setIsAuthenticated(true);
        resolve();
      } else {
        reject(new Error('Invalid credentials'));
      }
    });
  };

  const signup = (email: string, password: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      // In a real app, this would be an API call
      if (email && password) {
        const user = { email, name: email.split('@')[0] };
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        setIsAuthenticated(true);
        resolve();
      } else {
        reject(new Error('Invalid credentials'));
      }
    });
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    user,
    login,
    signup,
    logout
  };
};