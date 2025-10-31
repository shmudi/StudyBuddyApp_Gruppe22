
// App.tsx
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { AuthProvider, useAuth } from './src/contexts/AuthContext';
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

function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    // Du kan lage en loading screen her
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={user ? 'Main' : 'Login'}
        screenOptions={{ headerShown: false }}
      >
        {user ? (
          // Bruker er logget inn - vis hovedapp
          <Stack.Screen name="Main" component={TabNavigator} />
        ) : (
          // Bruker er ikke logget inn - vis auth flow
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
