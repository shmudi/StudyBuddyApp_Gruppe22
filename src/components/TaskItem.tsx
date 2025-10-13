import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  title: string;
  date?: string;
};

export default function TaskItem({ title, date }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {date ? <Text style={styles.date}>{date}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12, backgroundColor: '#fff', borderRadius: 8, marginBottom: 8 },
  title: { fontWeight: '500' },
  date: { fontSize: 12, color: '#6b7280', marginTop: 6 },
});
