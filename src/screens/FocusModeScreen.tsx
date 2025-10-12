import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function FocusModeScreen() {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Fokus</Text>
			<Text>Fokusmodus (placeholder)</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16, backgroundColor: '#fff' },
	title: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
});

