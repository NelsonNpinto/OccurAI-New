// src/context/AuthContext.js
import React, {createContext, useContext, useReducer, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {authService} from '../services/api/authService';

const AuthContext = createContext();

// Auth reducer for state management
const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {...state, isLoading: action.payload};
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
      };
    case 'SET_TOKEN':
      return {...state, token: action.payload};
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'SET_ERROR':
      return {...state, error: action.payload, isLoading: false};
    case 'CLEAR_ERROR':
      return {...state, error: null};
    default:
      return state;
  }
};

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

export const AuthProvider = ({children}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for stored token on app launch
  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      dispatch({type: 'SET_LOADING', payload: true});

      const token = await AsyncStorage.getItem('auth_token');
      if (token) {
        dispatch({type: 'SET_TOKEN', payload: token});
        // Verify token is still valid by fetching user profile
        const user = await authService.getProfile(token);
        dispatch({type: 'SET_USER', payload: user});
      } else {
        dispatch({type: 'SET_LOADING', payload: false});
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
      // Token might be expired, clear it
      await AsyncStorage.removeItem('auth_token');
      dispatch({type: 'LOGOUT'});
    }
  };

  const login = async (username, password) => {
    try {
      dispatch({type: 'SET_LOADING', payload: true});
      dispatch({type: 'CLEAR_ERROR'});

      const response = await authService.login(username, password);
      const {access_token} = response;

      // Store token
      await AsyncStorage.setItem('auth_token', access_token);
      dispatch({type: 'SET_TOKEN', payload: access_token});

      // Get user profile
      const user = await authService.getProfile(access_token);
      dispatch({type: 'SET_USER', payload: user});

      return {success: true};
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Login failed';
      console.log('Trying to login with:', username, password);
      console.log('Trying to login with:', username, password);

      dispatch({type: 'SET_ERROR', payload: errorMessage});
      return {success: false, error: errorMessage};
    }
  };

  const register = async userData => {
    try {
      dispatch({type: 'SET_LOADING', payload: true});
      dispatch({type: 'CLEAR_ERROR'});

      await authService.register(userData);

      // Auto-login after successful registration
      const loginResult = await login(userData.username, userData.password);
      return loginResult;
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail || 'Registration failed';
      dispatch({type: 'SET_ERROR', payload: errorMessage});
      return {success: false, error: errorMessage};
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('auth_token');
      dispatch({type: 'LOGOUT'});
    } catch (error) {
      console.error('Error during logout:', error);
      dispatch({type: 'LOGOUT'});
    }
  };

  const updateProfile = async updateData => {
    try {
      dispatch({type: 'SET_LOADING', payload: true});
      dispatch({type: 'CLEAR_ERROR'});

      await authService.updateProfile(updateData, state.token);

      // Refresh user data
      const user = await authService.getProfile(state.token);
      dispatch({type: 'SET_USER', payload: user});

      return {success: true};
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Update failed';
      dispatch({type: 'SET_ERROR', payload: errorMessage});
      return {success: false, error: errorMessage};
    }
  };

  const clearError = () => {
    dispatch({type: 'CLEAR_ERROR'});
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
