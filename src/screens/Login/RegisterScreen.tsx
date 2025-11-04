import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

// Registrering
type RootStackParamList = {
  Login: undefined;
  Register: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

export default function RegisterScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { register } = useAuth();
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!fullName || !email || !username || !password) {
      Alert.alert('Feil', 'Vennligst fyll inn alle feltene');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Feil', 'Passordet må være minst 6 tegn');
      return;
    }

    setLoading(true);
    try {
      await register(email, password, fullName, username);
      Alert.alert('Suksess', 'Kontoen ble opprettet!');
      // Navigasjon håndteres automatisk av AuthContext
    } catch (error) {
      Alert.alert('Registreringsfeil', error instanceof Error ? error.message : 'Ukjent feil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrer</Text>

      {/* Fullt navn */}
      <TextInput 
        placeholder="Fullt navn" 
        style={styles.input}
        value={fullName}
        onChangeText={setFullName}
      />
      
      {/* E-post */}
      <TextInput 
        placeholder="E-post" 
        style={styles.input} 
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      
      {/* Brukernavn */}
      <TextInput 
        placeholder="Brukernavn" 
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      
      {/* Passord */}
      <TextInput 
        placeholder="Passord" 
        secureTextEntry 
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      {/* Opprett konto */}
      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Oppretter konto...' : 'Opprett konto'}
        </Text>
      </TouchableOpacity>

      {/* Tilbake til innlogging */}
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.back}>Tilbake til innlogging</Text>
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
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    height: 44,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#f7f9c9',
    height: 48,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#000',
    fontWeight: '700',
  },
  back: {
    textAlign: 'center',
    color: '#2563eb',
    marginTop: 16,
  },
});