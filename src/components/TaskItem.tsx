import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

type Props = {
  title: string;
  date?: string;
  completed?: boolean;
  onPress?: () => void;
};

export default function TaskItem({ title, date, completed, onPress }: Props) {
  return (
    <TouchableOpacity
      style={[styles.container, completed && styles.completed]}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={styles.row}>
        <View style={[styles.circle, completed && styles.circleDone]} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, completed && styles.completedText]}>{title}</Text>
          {date ? <Text style={styles.date}>{date}</Text> : null}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12, backgroundColor: '#fff', borderRadius: 8, marginBottom: 8, borderWidth: 1, borderColor: '#eee' },
  completed: { backgroundColor: '#FFD70022', borderColor: '#FFD700' },
  row: { flexDirection: 'row', alignItems: 'center' },
  circle: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#bbb', marginRight: 12, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  circleDone: { borderColor: '#FFD700', backgroundColor: '#FFD700' },
  title: { fontWeight: '500' },
  completedText: { color: '#FFD700', fontWeight: '700' },
  date: { fontSize: 12, color: '#6b7280', marginTop: 6 },
});
