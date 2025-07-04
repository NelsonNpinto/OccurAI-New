import React from 'react';
import './global.css';
import AppNavigator from './src/navigation/AppNavigator';
import {AuthProvider} from './src/context/AuthContext';

const App = () => {
  return (
    <>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </>
  );
};

export default App;
