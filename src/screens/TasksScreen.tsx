import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function TasksScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Oppgaver</Text>
      <Text>Placeholder tasks</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
});
