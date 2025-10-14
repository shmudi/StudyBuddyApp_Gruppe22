import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function GroupsScreen() {
  return (
    <View style={styles.container}>
  <Text style={styles.title}>Grupper</Text>
  <Text>Du er på Grupper-siden! Navigasjonen fungerer.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f0f0f0' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
});
