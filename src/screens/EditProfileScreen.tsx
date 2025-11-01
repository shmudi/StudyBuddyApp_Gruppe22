import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
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
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userProfile?.photoURL) setImage(userProfile.photoURL);
  }, [userProfile]);

  const handleSelectImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Tillatelse kreves", "Appen trenger tilgang til bildene dine.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const handleSave = async () => {
    if (!fullName.trim() || !username.trim()) {
      Alert.alert("Ugyldig", "Vennligst fyll ut alle feltene.");
      return;
    }

    try {
      setLoading(true);
      let photoURL: string | undefined = userProfile?.photoURL;
      if (image && user?.uid) {
        // Laster opp bildet og får en offentlig URL
        photoURL = await AuthService.uploadProfilePhoto(user.uid, image);
      }

      if (user?.uid) {
        await AuthService.updateUserProfile(user.uid, {
          fullName,
          username,
          photoURL,
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

      <TouchableOpacity onPress={handleSelectImage} style={styles.imageWrapper}>
        {image ? (
          <Image source={{ uri: image }} style={styles.profileImage} />
        ) : (
          <View
            style={[
              styles.placeholder,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={{ color: colors.muted }}>Velg bilde</Text>
          </View>
        )}
      </TouchableOpacity>

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
  imageWrapper: {
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  placeholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
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
