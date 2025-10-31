import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';


  type TabType = 'Kalender' | 'Oppgaver' | 'Grupper' | 'Fokus' | 'Innstillinger';

  const GruppeprosjektScreen: React.FC = () => {
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
          <View style={styles.chatBubbleYellow}><Text style={styles.chatText}>Jeg ble ferdig med diagrammet</Text></View>
          <View style={styles.chatBubbleGray}><Text style={styles.chatText}>Kan noen teste koden imorgen?</Text></View>
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

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { flexGrow: 1, paddingHorizontal: 20, paddingTop: 20, backgroundColor: '#fff', paddingBottom: 120 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 16 },
  avatarsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  avatarCol: { alignItems: 'center', flex: 1 },
  avatarCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#ededed', marginBottom: 6, justifyContent: 'center', alignItems: 'center' },
  avatarIcon: { fontSize: 32 },
  avatarName: { fontSize: 14, color: '#444' },
  chatBubbleYellow: { backgroundColor: '#fff7e0', borderRadius: 18, padding: 12, marginBottom: 10, alignSelf: 'flex-start', maxWidth: '80%' },
  chatBubbleGray: { backgroundColor: '#ededed', borderRadius: 18, padding: 12, marginBottom: 10, alignSelf: 'flex-start', maxWidth: '80%' },
  chatText: { color: '#222', fontSize: 16 },
  inputWrap: { backgroundColor: '#fff', borderRadius: 18, borderWidth: 1, borderColor: '#eee', padding: 12, marginBottom: 18 },
  inputText: { color: '#bbb', fontSize: 16 },
  checklistWrap: { marginTop: 8 },
  checkRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: '#ddd', backgroundColor: '#fff', marginRight: 12 },
  checkboxChecked: { borderColor: '#f1c34a', backgroundColor: '#fff7e6' },
  checkText: { fontSize: 16, color: '#222', flex: 1 },
  checkOwner: { fontSize: 14, color: '#f1c34a', fontWeight: '700', marginLeft: 8 },
});