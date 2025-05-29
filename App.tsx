import React from 'react';
import './global.css';
import Meditation from './src/pages/Meditation/Meditation';
import Dashboard from './src/pages/Dashboard';
import Journal from './src/pages/Journal/Journal';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';

const App = () => {
  return (
    <>

     <AuthProvider>
      <AppNavigator />
    </AuthProvider>
      {/* <Dashboard />  */}
      {/* <Journal /> */}
      {/* <Meditation />  */}
    </>
  );
};

export default App;
