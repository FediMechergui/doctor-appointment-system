
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@/services/api';
import { toast } from '@/components/ui/sonner';

type Doctor = {
  id: number;
  nom: string;
  prenom: string;
  email: string;
};

interface AuthContextType {
  isAuthenticated: boolean;
  doctor: Doctor | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  doctor: null,
  login: async () => {},
  logout: () => {},
  isLoading: true
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      try {
        if (token) {
          try {
            // Verify token by getting doctor profile
            const doctorProfile = await authService.getProfile();
            setIsAuthenticated(true);
            setDoctor(doctorProfile);
          } catch (error) {
            // Token invalid or expired
            localStorage.removeItem('token');
            localStorage.removeItem('doctor');
            console.error('Authentication error:', error);
            toast.error("Erreur d'authentification ou serveur injoignable.");
          }
        }
      } catch (e) {
        toast.error("Impossible de contacter le serveur d'authentification.");
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  // Fallback: if isLoading is still true after 3 seconds, force it to false
  useEffect(() => {
    if (isLoading) {
      const timeout = setTimeout(() => {
        setIsLoading(false);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [isLoading]);

  // Login function using API
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Call API login endpoint
      const response = await authService.login(email, password);
      const { token, doctor } = response;
      
      // Save to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('doctor', JSON.stringify(doctor));
      
      setIsAuthenticated(true);
      setDoctor(doctor);
    } catch (error) {
      console.error('Login failed', error);
      toast.error("Échec de connexion. Vérifiez vos identifiants.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('doctor');
    setIsAuthenticated(false);
    setDoctor(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, doctor, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
