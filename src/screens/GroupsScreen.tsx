import React, { useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';


  type TabType = 'Kalender' | 'Oppgaver' | 'Grupper' | 'Fokus' | 'Innstillinger';

  const GruppeprosjektScreen: React.FC = () => {
    const { colors: themeColors } = useTheme();
    const styles = useMemo(() => makeStyles(themeColors), [themeColors]);
    // Dummy state for checkboxes
    const [checked, setChecked] = useState([true, false, false, false]);
    const handleCheck = (idx: number) => {
      setChecked(prev => {
        const next = [...prev];
        next[idx] = !next[idx];
        return next;
      });
    };
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Gruppeprosjekt</Text>
          {/* Avatarer */}
          <View style={styles.avatarsRow}>
            {[
              { name: 'Mina', icon: '🐱' },
              { name: 'Anne', icon: '🐶' },
              { name: 'Jonas', icon: '🦊' },
              { name: 'Markus', icon: '🐻' },
            ].map(({ name, icon }) => (
              <View key={name} style={styles.avatarCol}>
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarIcon}>{icon}</Text>
                </View>
                <Text style={styles.avatarName}>{name}</Text>
              </View>
            ))}
          </View>
          {/* Meldinger */}
          <View style={styles.chatBubbleAccent}><Text style={styles.chatText}>Jeg ble ferdig med diagrammet</Text></View>
          <View style={styles.chatBubbleCard}><Text style={styles.chatText}>Kan noen teste koden imorgen?</Text></View>
          {/* Input-felt */}
          <View style={styles.inputWrap}>
            <Text style={styles.inputText}>Skriv melding...</Text>
          </View>
          {/* Oppgaveliste */}
          <View style={styles.checklistWrap}>
            <TouchableOpacity style={styles.checkRow} onPress={() => handleCheck(0)}>
              <View style={[styles.checkbox, checked[0] && styles.checkboxChecked]} />
              <Text style={styles.checkText}>Lage ER-diagram</Text>
              <Text style={styles.checkOwner}>Mina</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.checkRow} onPress={() => handleCheck(1)}>
              <View style={[styles.checkbox, checked[1] && styles.checkboxChecked]} />
              <Text style={styles.checkText}>Implementere innlogging</Text>
              <Text style={styles.checkOwner}>Jonas</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.checkRow} onPress={() => handleCheck(2)}>
              <View style={[styles.checkbox, checked[2] && styles.checkboxChecked]} />
              <Text style={styles.checkText}>Dokumentasjon</Text>
              <Text style={styles.checkOwner}>Markus</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.checkRow} onPress={() => handleCheck(3)}>
              <View style={[styles.checkbox, checked[3] && styles.checkboxChecked]} />
              <Text style={styles.checkText}>Testing av koden</Text>
              <Text style={styles.checkOwner}>Anne</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  };

  export default GruppeprosjektScreen;

const makeStyles = (theme: any) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: theme.background },
    container: { flexGrow: 1, paddingHorizontal: 20, paddingTop: 20, backgroundColor: theme.background, paddingBottom: 120 },
    title: { fontSize: 28, fontWeight: '700', marginBottom: 16, color: theme.text },
    avatarsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
    avatarCol: { alignItems: 'center', flex: 1 },
    avatarCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: theme.card, marginBottom: 6, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: theme.border },
    avatarIcon: { fontSize: 32 },
    avatarName: { fontSize: 14, color: theme.text },
    chatBubbleAccent: { backgroundColor: theme.card, borderRadius: 18, padding: 12, marginBottom: 10, alignSelf: 'flex-start', maxWidth: '80%', borderLeftWidth: 4, borderLeftColor: theme.accent },
    chatBubbleCard: { backgroundColor: theme.card, borderRadius: 18, padding: 12, marginBottom: 10, alignSelf: 'flex-start', maxWidth: '80%', borderLeftWidth: 4, borderLeftColor: theme.border },
    chatText: { color: theme.text, fontSize: 16 },
    inputWrap: { backgroundColor: theme.card, borderRadius: 18, borderWidth: 1, borderColor: theme.border, padding: 12, marginBottom: 18 },
    inputText: { color: theme.muted, fontSize: 16 },
    checklistWrap: { marginTop: 8 },
    checkRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: theme.border, backgroundColor: theme.card, marginRight: 12 },
    checkboxChecked: { borderColor: theme.accent, backgroundColor: theme.card },
    checkText: { fontSize: 16, color: theme.text, flex: 1 },
    checkOwner: { fontSize: 14, color: theme.accent, fontWeight: '700', marginLeft: 8 },
  });