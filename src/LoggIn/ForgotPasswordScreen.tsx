import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Glemt passord
// Kort og enkelt:
// - Skriv e-post og trykk "Send" for å få en nullstillingslenke (mock).
// - Knappen gjør enkel validering. Legg inn ekte API-kall i sendReset.
// - "Tilbake" går tilbake til innlogging.

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ForgotPassword'>;

export default function ForgotPasswordScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState('');

  const sendReset = () => {
    const trimmed = email.trim();
    if (!trimmed) {
      Alert.alert('Manglende e-post', 'Vennligst skriv inn e-posten din.');
      return;
    }
    // Enkel e-post-sjekk
    const re = /^\S+@\S+\.\S+$/;
    if (!re.test(trimmed)) {
      Alert.alert('Ugyldig e-post', 'Skriv inn en gyldig e-postadresse.');
      return;
    }

    // Mock: vis bekreftelse og gå tilbake
    // Her kan du erstatte med ekte API-kall (fetch/axios)
    Alert.alert('E-post sendt', 'Sjekk innboksen din for instruksjoner.');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Glemt passord</Text>

      <Text style={styles.help}>Skriv inn e-posten din, så sender vi en lenke for å nullstille passordet.</Text>

      {/* E-postfelt: onChangeText oppdaterer state */}
      <TextInput
        placeholder="E-post"
        keyboardType="email-address"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      {/* Send-knapp: kjører sendReset (validering + mock) */}
      <TouchableOpacity style={styles.button} onPress={sendReset}>
        <Text style={styles.buttonText}>Send</Text>
      </TouchableOpacity>

      {/* Tilbake: naviger tilbake */}
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.back}>Tilbake</Text>
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
    marginBottom: 12,
  },
  help: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  input: {
    height: 44,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#f7f9c9',
    height: 48,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#000',
    fontWeight: '700',
  },
  back: {
    textAlign: 'center',
    color: '#2563eb',
  },
});
