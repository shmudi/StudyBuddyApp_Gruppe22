import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

// Innlogging
type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Main: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Feil', 'Vennligst fyll inn både e-post og passord');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      // Navigasjon håndteres automatisk av AuthContext
    } catch (error) {
      Alert.alert('Innloggingsfeil', error instanceof Error ? error.message : 'Ukjent feil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>StudyBuddy</Text>

      {/* E-post felt */}
      <TextInput 
        placeholder="E-post" 
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      {/* Passord-felt */}
      <TextInput 
        placeholder="Passord" 
        secureTextEntry 
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      {/* Glemt passord */}
      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.forgot}>Glemt passord</Text>
      </TouchableOpacity>

      {/* Logg inn-knapp */}
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Logger inn...' : 'Logg inn'}
        </Text>
      </TouchableOpacity>

      {/* Åpne registrering */}
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.create}>Registrer</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 40,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    height: 44,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  forgot: {
    color: '#3b82f6',
    textAlign: 'right',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#f7f9c9',
    height: 48,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#000',
    fontWeight: '700',
  },
  create: {
    textAlign: 'center',
    color: '#2563eb',
  },
});