import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../theme/colors';

export default function SettingsScreen() {
  const { logout, userProfile } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      // Navigation skjer automatisk via AuthContext
    } catch (error) {
      setLoggingOut(false);
      console.error('Logout feil:', error);
    }
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
      
      <TouchableOpacity 
        style={[styles.logoutButton, loggingOut && styles.logoutButtonDisabled]} 
        onPress={handleLogout}
        disabled={loggingOut}
      >
        {loggingOut ? (
          <View style={styles.logoutContent}>
            <ActivityIndicator size="small" color={colors.white} style={{ marginRight: 8 }} />
            <Text style={styles.logoutText}>Logger ut...</Text>
          </View>
        ) : (
          <Text style={styles.logoutText}>Logg ut</Text>
        )}
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
  logoutButtonDisabled: {
    opacity: 0.6,
  },
  logoutContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});