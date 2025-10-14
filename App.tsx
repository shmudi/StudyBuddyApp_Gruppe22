
// App.tsx
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useState } from 'react';

import TabNavigator from './src/navigation/TabNavigator';
import ForgotPasswordScreen from './src/screens/Login/ForgotPasswordScreen';
import LoginScreen from './src/screens/Login/LoginScreen';
import RegisterScreen from './src/screens/Login/RegisterScreen';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Main: undefined; // TabNavigator
};

const Stack = createNativeStackNavigator<RootStackParamList>();
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/LoggIn/LoginScreen';
import RegisterScreen from './src/LoggIn/RegisterScreen';
import ForgotPasswordScreen from './src/LoggIn/ForgotPasswordScreen';
import GruppeprosjektScreen from './src/Gruppeprosjekt/GruppeprosjektScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isSignedIn] = useState(false);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isSignedIn ? 'Main' : 'Login'} screenOptions={{ headerShown: false }}>
        {/* Auth-flow */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />

        {/* Hoved-appen (faner) */}
        <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="Gruppeprosjekt" component={GruppeprosjektScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
