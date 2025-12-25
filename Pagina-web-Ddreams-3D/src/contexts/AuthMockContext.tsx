'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User } from '../shared/types';
import { mockUsers } from '../shared/data/mockData';

interface AuthMockContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Omit<User, 'id' | 'createdAt'>) => Promise<boolean>;
  updateUser: (userData: Partial<User>) => Promise<boolean>;
}

const AuthMockContext = createContext<AuthMockContextType | undefined>(undefined);

export const useAuthMock = () => {
  const context = useContext(AuthMockContext);
  if (context === undefined) {
    throw new Error('useAuthMock must be used within an AuthMockProvider');
  }
  return context;
};

interface AuthMockProviderProps {
  children: ReactNode;
}

export const AuthMockProvider: React.FC<AuthMockProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isAuthenticated = user !== null;

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user by email (mock authentication)
      const foundUser = mockUsers.find(u => u.email === email);
      
      if (foundUser && password === 'password123') { // Mock password validation
        setUser(foundUser);
        // Store in localStorage for persistence
        localStorage.setItem('auth_mock_user', JSON.stringify(foundUser));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('auth_mock_user');
  }, []);

  const register = useCallback(async (userData: Omit<User, 'id' | 'createdAt'>): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check if user already exists
      const existingUser = mockUsers.find(u => u.email === userData.email);
      if (existingUser) {
        return false; // User already exists
      }
      
      // Create new user
      const newUser: User = {
        ...userData,
        id: `user_${Date.now()}`,
        createdAt: new Date(),
      };
      
      // Add to mock users (in real app, this would be an API call)
      mockUsers.push(newUser);
      
      // Auto-login after registration
      setUser(newUser);
      localStorage.setItem('auth_mock_user', JSON.stringify(newUser));
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (userData: Partial<User>): Promise<boolean> => {
    if (!user) return false;
    
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user data
      const updatedUser: User = {
        ...user,
        ...userData,
        updatedAt: new Date(),
      };
      
      // Update in mock users array
      const userIndex = mockUsers.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        mockUsers[userIndex] = updatedUser;
      }
      
      // Update state and localStorage
      setUser(updatedUser);
      localStorage.setItem('auth_mock_user', JSON.stringify(updatedUser));
      
      return true;
    } catch (error) {
      console.error('Update user error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Check for stored user on mount
  React.useEffect(() => {
    const storedUser = localStorage.getItem('auth_mock_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('auth_mock_user');
      }
    }
  }, []);

  const value: AuthMockContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    register,
    updateUser,
  };

  return (
    <AuthMockContext.Provider value={value}>
      {children}
    </AuthMockContext.Provider>
  );
};