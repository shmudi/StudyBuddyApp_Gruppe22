import React, { useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Switch,
  Linking,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";


export default function SettingsScreen({ navigation }: { navigation: any }) {
  const { logout, userProfile } = useAuth();
  const { theme, toggleTheme, colors } = useTheme();
  const darkMode = theme === "dark";
  const [loggingOut, setLoggingOut] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleLogout = () => {
    Alert.alert("Logg ut", "Er du sikker på at du vil logge ut?", [
      { text: "Avbryt", style: "cancel" },
      {
        text: "Logg ut",
        style: "destructive",
        onPress: async () => {
          setLoggingOut(true);
          try {
            await logout();
          } catch (error) {
            console.error("Logout-feil:", error);
            setLoggingOut(false);
          }
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.profileSection}>
        <Image
          source={require("../../assets/profilbilde.png")}
          style={[styles.profileImage, { backgroundColor: colors.card }]}
        />
        <Text style={[styles.profileName, { color: colors.text }]}>
          {userProfile?.fullName || "Din Profil"}
        </Text>
        {userProfile?.username && (
          <Text style={[styles.username, { color: colors.muted }]}>
            @{userProfile.username}
          </Text>
        )}
      </View>

      <View style={styles.settingsSection}>
        <View style={styles.settingRow}>
          <Text style={[styles.optionText, { color: colors.text }]}>Mørk modus</Text>
          <Switch value={darkMode} onValueChange={toggleTheme} />
        </View>

        <View style={styles.settingRow}>
          <Text style={[styles.optionText, { color: colors.text }]}>Varsler</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
          />
        </View>

        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => navigation.navigate("EditProfile")}
        >
          <Text style={[styles.optionText, { color: colors.text }]}>Rediger profil</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => Linking.openURL("mailto:eclipse.regis@gmail.com")}
        >
          <Text style={[styles.optionText, { color: colors.text }]}>Kontakt support</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.logoutButton, { backgroundColor: colors.error }]}
        onPress={handleLogout}
        disabled={loggingOut}
      >
        {loggingOut ? (
          <View style={styles.logoutContent}>
            <ActivityIndicator size="small" color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.logoutText}>Logger ut...</Text>
          </View>
        ) : (
          <Text style={styles.logoutText}>Logg ut</Text>
        )}
      </TouchableOpacity>

      <View style={styles.appInfoSection}>
        <Text style={[styles.appInfo, { color: colors.muted }]}>StudyBuddy v1.0.0</Text>
        <Text style={[styles.appInfoSmall, { color: colors.muted }]}>Utviklet av Gruppe 22</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 40,
  },
  profileSection: {
    alignItems: "center",
    marginTop: 60,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  profileName: { fontSize: 22, fontWeight: "bold" },
  username: { fontSize: 16, marginTop: 4 },
  settingsSection: { width: "85%", marginTop: 20 },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  optionButton: {
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionText: { fontSize: 18 },
  logoutButton: {
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  logoutContent: { flexDirection: "row", alignItems: "center" },
  logoutText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  appInfoSection: { alignItems: "center", marginBottom: 20 },
  appInfo: { fontSize: 14 },
  appInfoSmall: { fontSize: 12 },
});
