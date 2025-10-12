import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/LoggIn/LoginScreen';
import RegisterScreen from './src/LoggIn/RegisterScreen';
import ForgotPasswordScreen from './src/LoggIn/ForgotPasswordScreen';
import GruppeprosjektScreen from './src/Gruppeprosjekt/GruppeprosjektScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="Gruppeprosjekt" component={GruppeprosjektScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
