import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

// Gruppeprosjekt-skjerm (forenklet UI)
// - Avatar-rad øverst
// - Meldingsbobler i midten
// - Inngang for å skrive melding
// - Oppgaveliste nederst

export default function GruppeprosjektScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gruppeprosjekt</Text>

      <View style={styles.avatarsRow}>
        <View style={styles.avatar} />
        <View style={styles.avatar} />
        <View style={styles.avatar} />
        <View style={styles.avatar} />
      </View>

      <Text style={styles.nameRow}>Mina     Anne     Jonas     Markus</Text>

      <View style={styles.messageBubblePrimary}>
        <Text style={styles.messageText}>Jeg ble ferdig med diagrammet</Text>
      </View>

      <View style={styles.messageBubbleSecondary}>
        <Text style={styles.messageText}>Kan noen teste koden imorgen?</Text>
      </View>

      <TextInput placeholder="Skriv melding..." style={styles.input} />

      <View style={styles.tasks}>
        <View style={styles.taskRow}>
          <View style={styles.checkboxChecked} />
          <Text style={styles.taskText}>Lage ER-diagram</Text>
          <Text style={styles.assignee}>Mina</Text>
        </View>
        <View style={styles.taskRow}>
          <View style={styles.checkbox} />
          <Text style={styles.taskText}>Implementere innlogging</Text>
          <Text style={styles.assignee}>Jonas</Text>
        </View>
        <View style={styles.taskRow}>
          <View style={styles.checkbox} />
          <Text style={styles.taskText}>Dokumentasjon</Text>
          <Text style={styles.assignee}>Markus</Text>
        </View>
        <View style={styles.taskRow}>
          <View style={styles.checkbox} />
          <Text style={styles.taskText}>Testing av koden</Text>
          <Text style={styles.assignee}>Anne</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  avatarsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#eee' },
  nameRow: { color: '#333', marginBottom: 12 },
  messageBubblePrimary: { backgroundColor: '#fff1c9', padding: 12, borderRadius: 24, alignSelf: 'flex-start', marginBottom: 8 },
  messageBubbleSecondary: { backgroundColor: '#f1f1f1', padding: 12, borderRadius: 24, alignSelf: 'flex-start', marginBottom: 12 },
  messageText: { color: '#333' },
  input: { height: 44, borderColor: '#eee', borderWidth: 1, borderRadius: 24, paddingHorizontal: 16, marginBottom: 12 },
  tasks: { marginTop: 8 },
  taskRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 1, borderColor: '#ccc', marginRight: 12 },
  checkboxChecked: { width: 20, height: 20, borderRadius: 4, backgroundColor: '#f7f9c9', marginRight: 12, borderWidth: 1, borderColor: '#f1eaa8' },
  taskText: { flex: 1, color: '#333' },
  assignee: { color: '#e5b400' },
});
