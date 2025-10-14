import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

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
  return (
    <View style={styles.container}>
      <Text style={styles.title}>StudyBuddy</Text>

  {/* Brukernavnfelt: koble til state med onChangeText for å lese input */}
  <TextInput placeholder="brukernavn" style={styles.input} />
  {/* Passord-felt: secureTextEntry skjuler input-tegnene */}
  <TextInput placeholder="passord" secureTextEntry style={styles.input} />

      {/* Glemt passord: åpner gjenopprettingsskjerm */}
      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.forgot}>Glemt passord</Text>
      </TouchableOpacity>

      {/* Logg inn-knapp: legg autentiseringslogikk i onPress */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          // Her bør du validere brukernavn/passord. Når innlogging er vellykket,
          // bytt til hoved-appen. replace fjerner login fra stack slik at brukeren
          // ikke kan gå tilbake med fysisk tilbake-knapp.
          navigation.replace('Main');
        }}
      >
        <Text style={styles.buttonText}>Logg inn</Text>
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
  buttonText: {
    color: '#000',
    fontWeight: '700',
  },
  create: {
    textAlign: 'center',
    color: '#2563eb',
  },
});