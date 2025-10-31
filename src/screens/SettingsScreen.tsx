import React from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../theme/colors';

export default function SettingsScreen() {
  const { logout, userProfile } = useAuth();

  const handleLogout = async () => {
    Alert.alert(
      'Logg ut',
      'Er du sikker på at du vil logge ut?',
      [
        { text: 'Avbryt', style: 'cancel' },
        { 
          text: 'Logg ut', 
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              Alert.alert('Feil', 'Kunne ikke logge ut. Prøv igjen.');
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileSection}>
        <Image source={require('../../assets/profilbilde.png')} style={styles.profileImage} />
        <Text style={styles.profileName}>
          {userProfile?.fullName || 'Din Profil'}
        </Text>
        {userProfile?.username && (
          <Text style={styles.username}>@{userProfile.username}</Text>
        )}
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
  username: {
    fontSize: 16,
    color: colors.muted,
    marginTop: 4,
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