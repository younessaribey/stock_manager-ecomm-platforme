import React, { createContext, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import jwtDecode from 'jwt-decode';
import APP_CONFIG from '../config/appConfig';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Configure axios defaults
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
  axios.defaults.withCredentials = true;


  // Declare checkAuth before it is used
  const checkAuth = useCallback(async () => {
    setLoading(true);
    let token = localStorage.getItem('token');
    if (!token) {
      token = sessionStorage.getItem('token');
    }
    if (!token) {
      setCurrentUser(null);
      setLoading(false);
      return;
    }
    try {
      let decodedToken;
      
      if (APP_CONFIG.DEMO_MODE) {
        // In demo mode, decode the token (it's base64 encoded JSON)
        try {
          decodedToken = JSON.parse(atob(token));
          // Check if token is expired
          if (decodedToken.exp && decodedToken.exp < Date.now()) {
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
            setCurrentUser(null);
            setLoading(false);
            return;
          }
        } catch {
          localStorage.removeItem('token');
          sessionStorage.removeItem('token');
          setCurrentUser(null);
          setLoading(false);
          return;
        }
      } else {
        // In production mode, use jwt-decode
        decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          // Token is expired
          localStorage.removeItem('token');
          sessionStorage.removeItem('token');
          setCurrentUser(null);
          setLoading(false);
          return;
        }
      }
      
      // Token is valid, set user data
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      setCurrentUser(decodedToken);
    } catch (error) {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize currentUser from token on mount
  // Using empty dependency array to run only once on mount
  React.useEffect(() => {
    // List of public routes where auth should not be checked
    const publicRoutes = ['/login', '/register', '/forgot-password'];
    const currentPath = window.location.pathname;
    if (!publicRoutes.includes(currentPath)) {
      checkAuth();
    } else {
      setCurrentUser(null); // Always clear user on public route
      setLoading(false);
    }
    // checkAuth is now a stable callback and included in deps
  }, [checkAuth]);
  
  // Add token to requests if available - setup interceptor only once using useEffect
  React.useEffect(() => {
    const interceptor = axios.interceptors.request.use(
      (config) => {
        let token = localStorage.getItem('token');
        if (!token) {
          token = sessionStorage.getItem('token');
        }
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    // Clean up interceptor when component unmounts
    return () => axios.interceptors.request.eject(interceptor);
  }, []);

  // Register user
  const register = async (userData, isAdmin = false) => {
    try {
      const endpoint = isAdmin ? '/auth/register-admin' : '/auth/register';
      const response = await axios.post(endpoint, userData, { withCredentials: true });
      
      if (!isAdmin) {
        localStorage.setItem('token', response.data.token);
        setCurrentUser(response.data.user);
      } else {
        toast.success('Admin registration successful! Waiting for approval.');
        return { pendingApproval: true };
      }
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      throw new Error(message);
    }
  };

  // Login user
  const login = async (credentials, isAdmin = false, rememberMe = false) => {
    try {
      let response;
      
      if (APP_CONFIG.DEMO_MODE) {
        // Use demo API for authentication
        const users = JSON.parse(localStorage.getItem('demo_users') || '[]');
        const user = users.find(u => u.email === credentials.email);
        
        if (!user) {
          throw new Error('Invalid credentials');
        }
        
        // Check if admin login is required
        if (isAdmin && user.role !== 'admin') {
          throw new Error('Invalid admin credentials');
        }
        
        // In demo mode, simple password check (not secure, just for demo)
        // The demo passwords are stored as plain text or we just accept the known passwords
        const validPassword = credentials.password === 'admin123' || credentials.password === 'user123';
        
        if (!validPassword) {
          throw new Error('Invalid credentials');
        }
        
        // Generate simple token (base64 encoded JSON)
        const { password, ...userWithoutPassword } = user;
        const tokenData = {
          ...userWithoutPassword,
          exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
        };
        const token = btoa(JSON.stringify(tokenData));
        
        response = {
          data: {
            user: userWithoutPassword,
            token: token
          }
        };
      } else {
        // Use real API
        const endpoint = isAdmin ? '/auth/login-admin' : '/auth/login';
        response = await axios.post(endpoint, credentials, { withCredentials: true });
      }
      
      // Store token in localStorage or sessionStorage based on rememberMe
      if (rememberMe) {
        localStorage.setItem('token', response.data.token);
        sessionStorage.removeItem('token');
      } else {
        sessionStorage.setItem('token', response.data.token);
        localStorage.removeItem('token');
      }
      axios.defaults.headers.common.Authorization = `Bearer ${response.data.token}`;
      setCurrentUser(response.data.user);
      return { success: true };
    } catch (error) {
      const message = error.message || 'Login failed';
      toast.error(message);
      throw new Error(message);
    }
  };


  // Google OAuth login
  const googleLogin = async (googleData) => {
    try {
      const response = await axios.post('/auth/google', googleData, { withCredentials: true });
      localStorage.setItem('token', response.data.token);
      setCurrentUser(response.data.user);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Google login failed';
      toast.error(message);
      throw new Error(message);
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    setCurrentUser(null);
    toast.info('You have been logged out');
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      const response = await axios.put(`/users/${currentUser.id}`, userData);
      setCurrentUser(response.data);
      toast.success('Profile updated successfully');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile';
      toast.error(message);
      throw new Error(message);
    }
  };

  // Update password - simple implementation that accepts any password
  const updatePassword = async (currentPassword, newPassword) => {
    try {
      // Call the API to update the password
      const response = await axios.put(`/users/${currentUser.id}/change-password`, {
        currentPassword,
        newPassword
      });
      
      // Successful password change
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update password';
      toast.error(message);
      throw new Error(message);
    }
  };

  const value = {
    currentUser,
    loading,
    register,
    login,
    googleLogin,
    logout,
    checkAuth,
    updateProfile,
    updatePassword,
  };

  if (loading) return null;
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
