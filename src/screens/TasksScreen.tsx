
import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import TaskItem from '../components/TaskItem';

export default function TasksScreen() {
  // Demo tasks
  const tasks = [
    { title: 'Arbeidskrav 3 - Diskret matte', date: 'Frist: 2025-10-01' },
    { title: 'Prosjektoppgave - Software Engineering', date: 'Frist: 2025-10-05' },
    { title: 'Oblig 2 - Operativsystemer', date: 'Frist: 2025-10-03' },
  ];
  const [completed, setCompleted] = useState([false, false, false]);
  const handlePress = (idx: number) => {
    setCompleted(prev => {
      const next = [...prev];
      next[idx] = !next[idx];
      return next;
    });
  };
  const completedCount = completed.filter(Boolean).length;
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      <Text style={styles.title}>Oppgaver</Text>
      <Text style={styles.subtitle}>{completedCount}/3 fullført</Text>
      {tasks.map((task, idx) => (
        <TaskItem
          key={idx}
          title={task.title}
          date={task.date}
          completed={completed[idx]}
          onPress={() => handlePress(idx)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f0f0f0' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
  subtitle: { color: '#888', marginBottom: 16 },
});
