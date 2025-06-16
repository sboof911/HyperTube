import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  profilePicture?: string;
  watchedMovies: string[];
  languagePreference: 'en' | 'fr';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  loginWithOAuth: (provider: 'google' | '42') => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // In a real app, this would call your backend to validate the token
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Authentication error:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Mock login function - in a real app, this would call your backend
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // This is a mock user - in a real app, this would come from your backend
      const mockUser: User = {
        id: '123',
        name: 'John Doe',
        username: 'johndoe',
        email,
        profilePicture: 'https://i.pravatar.cc/150?img=68',
        watchedMovies: ['tt0111161', 'tt0068646'],
        languagePreference: 'en'
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Mock register function
  const register = async (name: string, username: string, email: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          username,
          email,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await response.json();

      const registeredUser: User = {
        id: data.id,
        name: data.name,
        username: data.username,
        email: data.email,
        profilePicture: data.profilePicture || 'https://i.pravatar.cc/150?img=68',
        watchedMovies: data.watchedMovies || [],
        languagePreference: data.languagePreference || 'en',
      };

      setUser(registeredUser);
      localStorage.setItem('user', JSON.stringify(registeredUser));
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Mock logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Mock update profile function
  const updateProfile = async (userData: Partial<User>) => {
    setLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (user) {
        const updatedUser = { ...user, ...userData };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Mock OAuth login
  const loginWithOAuth = async (provider: 'google' | '42') => {
    setLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // This is a mock user - in a real app, this would come from your OAuth provider
      const mockUser: User = {
        id: '123',
        name: provider === 'google' ? 'Google User' : '42 User',
        username: provider === 'google' ? 'googleuser' : '42user',
        email: provider === 'google' ? 'user@gmail.com' : 'user@student.42.fr',
        profilePicture: 'https://i.pravatar.cc/150?img=68',
        watchedMovies: [],
        languagePreference: 'en'
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error) {
      console.error(`${provider} login error:`, error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Mock forgot password function
  const forgotPassword = async (email: string) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In a real app, this would send a reset email
      console.log(`Password reset requested for ${email}`);
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  };

  // Mock reset password function
  const resetPassword = async (token: string, newPassword: string) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In a real app, this would validate the token and update the password
      console.log(`Password reset with token ${token}`);
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        loginWithOAuth,
        forgotPassword,
        resetPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};