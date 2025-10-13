import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';


  type TabType = 'Kalender' | 'Oppgaver' | 'Grupper' | 'Fokus' | 'Innstillinger';

  const GruppeprosjektScreen: React.FC = () => {
    const [selected, setSelected] = useState<TabType>('Oppgaver');
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Oppgaver</Text>
          <Text style={styles.subtitle}>1/3 fullført</Text>
          {/* Oppgavekort, kan gjøres dynamisk senere. */}
          <View style={styles.card}>
            <View style={styles.radioChecked} />
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Arbeidskrav 3 - Diskret matte</Text>
              <Text style={styles.cardMeta}>Diskret matte • Frist: 2025-10-01</Text>
            </View>
          </View>
          <View style={styles.card}>
            <View style={styles.radio} />
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Prosjektoppgave - Software Engineering</Text>
              <Text style={styles.cardMeta}>SE og testing • Frist: 2025-10-05</Text>
            </View>
          </View>
          <View style={styles.card}>
            <View style={styles.radio} />
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Oblig 2 - Operativsystemer</Text>
              <Text style={styles.cardMeta}>Operativsystemer • Frist: 2025-10-03</Text>
            </View>
          </View>
        </ScrollView>
        {/* Pluss-knapp for å legge til oppgave. */}
        <TouchableOpacity style={styles.fab} onPress={() => { /* TODO: åpne ny oppgave-dialog/modal */ }}>
          <Text style={styles.fabPlus}>+</Text>
        </TouchableOpacity>
        {/* Bunnmeny med fem faner. */}
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.tab} onPress={() => setSelected('Kalender')}>
            <Text style={[styles.tabIcon, selected === 'Kalender' && styles.tabIconActive]}>📅</Text>
            <Text style={[styles.tabLabel, selected === 'Kalender' && styles.tabLabelActive]}>Kalender</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab} onPress={() => setSelected('Oppgaver')}>
            <Text style={[styles.tabIcon, selected === 'Oppgaver' && styles.tabIconActive]}>📝</Text>
            <Text style={[styles.tabLabel, selected === 'Oppgaver' && styles.tabLabelActive]}>Oppgaver</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab} onPress={() => setSelected('Grupper')}>
            <Text style={[styles.tabIcon, selected === 'Grupper' && styles.tabIconActive]}>👥</Text>
            <Text style={[styles.tabLabel, selected === 'Grupper' && styles.tabLabelActive]}>Grupper</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab} onPress={() => setSelected('Fokus')}>
            <Text style={[styles.tabIcon, selected === 'Fokus' && styles.tabIconActive]}>⏱️</Text>
            <Text style={[styles.tabLabel, selected === 'Fokus' && styles.tabLabelActive]}>Fokus</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab} onPress={() => setSelected('Innstillinger')}>
            <Text style={[styles.tabIcon, selected === 'Innstillinger' && styles.tabIconActive]}>⚙️</Text>
            <Text style={[styles.tabLabel, selected === 'Innstillinger' && styles.tabLabelActive]}>Innstillinger</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  };

  export default GruppeprosjektScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { flexGrow: 1, paddingHorizontal: 20, paddingTop: 20, backgroundColor: '#fff', paddingBottom: 120 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 4 },
  subtitle: { color: '#666', marginBottom: 16 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#eee', marginBottom: 12 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#cfcfcf', marginRight: 12 },
  radioChecked: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#f1c34a', backgroundColor: '#fff7e6', marginRight: 12, justifyContent: 'center', alignItems: 'center' },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#111' },
  cardMeta: { color: '#6b7280', marginTop: 4 },
  fab: { position: 'absolute', right: 20, bottom: 72, width: 56, height: 56, borderRadius: 28, backgroundColor: '#f59e0b', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 6, elevation: 6 },
  fabPlus: { color: '#fff', fontSize: 28, lineHeight: 28, fontWeight: '700' },
  bottomBar: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 72, borderTopWidth: 1, borderTopColor: '#eee', backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingHorizontal: 8 },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tabIcon: { fontSize: 18, color: '#9ca3af' },
  tabIconActive: { color: '#f59e0b' },
  tabLabel: { fontSize: 12, color: '#9ca3af', marginTop: 4 },
  tabLabelActive: { color: '#f59e0b', fontWeight: '700' },
});
