import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Registrering
type RootStackParamList = {
  Login: undefined;
  Register: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

export default function RegisterScreen() {
  const navigation = useNavigation<NavigationProp>();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrer</Text>

  {/* Fullt navn: valgfritt */}
      <TextInput placeholder="Fullt navn" style={styles.input} />
  {/* E-post: vis e-posttastatur */}
      <TextInput placeholder="E-post" style={styles.input} keyboardType="email-address" />
      <TextInput placeholder="Brukernavn" style={styles.input} />
      {/* Passord: secureTextEntry skjuler tegnene */}
      <TextInput placeholder="Passord" secureTextEntry style={styles.input} />

  {/* Opprett konto: legg validering/API-kall i onPress */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Opprett konto</Text>
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