import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
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
    // På web mangler Alert-knapper; bruk confirm eller logg ut direkte
    if (Platform.OS === "web") {
      const ok = typeof window !== "undefined" ? window.confirm("Er du sikker på at du vil logge ut?") : true;
      if (!ok) return;
      (async () => {
        setLoggingOut(true);
        try {
          await logout();
        } catch (error) {
          console.error("Logout-feil:", error);
          Alert.alert("Kunne ikke logge ut", "Prøv igjen om litt.");
        } finally {
          setLoggingOut(false);
        }
      })();
      return;
    }

    // Native-plattformer: normal Alert med to knapper
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
            Alert.alert("Kunne ikke logge ut", "Prøv igjen om litt.");
          } finally {
            // Stopp spinner hvis skjermen ikke unmountes umiddelbart
            setLoggingOut(false);
          }
        },
      },
    ]);
  };

  return (
    <ScrollView
      style={[styles.scrollContainer, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* PROFIL */}
      <View style={styles.profileSection}>
        <Image
          source={
            userProfile?.photoURL
              ? { uri: userProfile.photoURL }
              : require("../../assets/profilbilde.png")
          }
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

      {/* INNSTILLINGER */}
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

      {/* LOGG UT */}
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

      {/* APP INFO */}
      <View style={styles.appInfoSection}>
        <Text style={[styles.appInfo, { color: colors.muted }]}>StudyBuddy v1.0.0</Text>
        <Text style={[styles.appInfoSmall, { color: colors.muted }]}>
          Utviklet av Gruppe 22
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    alignItems: "center",
    paddingVertical: 40,
    paddingBottom: 80, // ekstra luft nederst
  },
  profileSection: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  profileName: {
    fontSize: 22,
    fontWeight: "bold",
  },
  username: {
    fontSize: 16,
    marginTop: 4,
  },
  settingsSection: {
    width: "85%",
    marginTop: 20,
    marginBottom: 40,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  optionButton: {
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionText: {
    fontSize: 18,
  },
  logoutButton: {
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginTop: 40,
    marginBottom: 50, // luft før app-info
    alignSelf: "center",
  },
  logoutContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  appInfoSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  appInfo: {
    fontSize: 14,
  },
  appInfoSmall: {
    fontSize: 12,
  },
});
