import React from 'react';
import './global.css';
import Meditation from './src/pages/Meditation/Meditation';
import Dashboard from './src/pages/Dashboard';
import Journal from './src/pages/Journal/Journal';
import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
  return (
    <>

      <AppNavigator />;
      {/* <Dashboard />  */}
      {/* <Journal /> */}
      {/* <Meditation />  */}
    </>
  );
};

export default App;
