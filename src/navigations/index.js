import React from 'react';
import { useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigations from './AuthNavigations';
import MainNavigations from './MainNavigations';

const RootNavigations = () => {
  const { isSignedIn } = useSelector((state) => state.auth);

  return (
    <NavigationContainer>
      {isSignedIn ? <MainNavigations /> : <AuthNavigations />}
    </NavigationContainer>
  );
};

export default RootNavigations;
