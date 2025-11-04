import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { AuthService } from "../services/auth";

export default function EditProfileScreen({ navigation }: { navigation: any }) {
  const { userProfile, user, refreshUserProfile } = useAuth();
  const { colors } = useTheme();

  const [fullName, setFullName] = useState(userProfile?.fullName || "");
  const [username, setUsername] = useState(userProfile?.username || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Profilbilde-håndtering er fjernet
  }, [userProfile]);

  const handleSave = async () => {
    if (!fullName.trim() || !username.trim()) {
      Alert.alert("Ugyldig", "Vennligst fyll ut alle feltene.");
      return;
    }

    try {
      setLoading(true);
      if (user?.uid) {
        await AuthService.updateUserProfile(user.uid, {
          fullName,
          username,
        });
  await refreshUserProfile();
      }

      Alert.alert("Lagret", "Profilen din ble oppdatert!");
      navigation.goBack();
    } catch (error: any) {
      console.error("Feil ved oppdatering:", error);
      Alert.alert("Feil", error?.message || "Kunne ikke oppdatere profilen akkurat nå.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Rediger profil</Text>

      <TextInput
        style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
        placeholder="Fullt navn"
        placeholderTextColor={colors.muted}
        value={fullName}
        onChangeText={setFullName}
      />

      <TextInput
        style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
        placeholder="Brukernavn"
        placeholderTextColor={colors.muted}
        value={username}
        onChangeText={setUsername}
      />

      <TouchableOpacity
        style={[styles.saveButton, { backgroundColor: colors.accent }]}
        onPress={handleSave}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveText}>Lagre endringer</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={[styles.cancelText, { color: colors.muted }]}>Avbryt</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginVertical: 20,
  },
  input: {
    width: "100%",
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    fontSize: 16,
  },
  saveButton: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
    marginTop: 10,
  },
  saveText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  cancelText: {
    marginTop: 16,
    fontSize: 15,
  },
});
