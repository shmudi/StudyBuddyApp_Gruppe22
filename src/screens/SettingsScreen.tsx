import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../theme/colors';

type RootStackParamList = {
  Login: undefined;
};

export default function SettingsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleLogout = () => {
    // Kode til å logge ut 
  navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileSection}>
  <Image source={require('../../assets/profilbilde.png')} style={styles.profileImage} />
        <Text style={styles.profileName}>Din Profil</Text>
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logg ut</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    backgroundColor: colors.soft,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.dark,
  },
  logoutButton: {
    backgroundColor: colors.error,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  logoutText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});