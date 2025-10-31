import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from "../contexts/AuthContext";
import { Task, TaskService } from "../services/tasks";
import { colors } from "../theme/colors";

export default function TasksScreen() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Hent oppgaver fra Firebase
  const loadTasks = useCallback(async () => {
    if (!user) return;
    
    try {
      const userTasks = await TaskService.getUserTasks(user.uid);
      setTasks(userTasks);
    } catch (error) {
      Alert.alert('Feil', 'Kunne ikke hente oppgaver');
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Teller hvor mange som er fullført
  const { completed, total } = useMemo(() => {
    const total = tasks.length || 1;
    const completed = tasks.filter((t) => t.done).length;
    return { completed, total };
  }, [tasks]);

  const toggleTask = async (id: string, currentDone: boolean) => {
    try {
      await TaskService.toggleTask(id, !currentDone);
      // Oppdater lokal state
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, done: !currentDone } : t))
      );
    } catch (error) {
      Alert.alert('Feil', 'Kunne ikke oppdatere oppgave');
    }
  };

  const createSampleTask = async () => {
    if (!user) return;
    
    try {
      const sampleTasks = [
        { title: "Les kapittel 5", course: "React Native", due: "2025-11-01" },
        { title: "Øv på TypeScript", course: "Programmering", due: "2025-11-03" },
        { title: "Lag Firebase app", course: "Backend", due: "2025-11-05" }
      ];
      
      const randomTask = sampleTasks[Math.floor(Math.random() * sampleTasks.length)];
      
      await TaskService.createTask(user.uid, randomTask);
      await loadTasks(); // Refresh listen
      Alert.alert('Suksess', 'Ny oppgave lagt til!');
    } catch (error) {
      Alert.alert('Feil', 'Kunne ikke opprette oppgave');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text>Laster oppgaver...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Oppgaver</Text>
        <Text style={styles.subTitle}>
          {completed}/{total} fullført
        </Text>

        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <TaskCard task={item} onToggle={() => toggleTask(item.id, item.done)} />
          )}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Ingen oppgaver ennå</Text>
              <Text style={styles.emptySubtext}>Trykk + for å legge til en oppgave</Text>
            </View>
          )}
        />

        <TouchableOpacity
          style={styles.fab}
          activeOpacity={0.85}
          onPress={createSampleTask}
          accessibilityLabel="Legg til oppgave"
        >
          <Ionicons name="add" size={28} color={colors.text} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function TaskCard({
  task,
  onToggle,
}: {
  task: Task;
  onToggle: () => void;
}) {
  return (
    <View style={styles.card}>
      {/* TouchableOpacity brukes for trykkbare elementer (checkbox)
          https://reactnative.dev/docs/touchableopacity */}
      <TouchableOpacity
        onPress={onToggle}
        style={styles.check}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: task.done }}
      >
        <View style={[styles.checkOuter, task.done && styles.checkOuterOn]}>
          {task.done && <View style={styles.checkInner} />}
        </View>
      </TouchableOpacity>

      <View style={styles.cardTextWrap}>
        <Text style={[styles.cardTitle, task.done && styles.cardTitleDone]}>
          {task.title}
        </Text>
        {!!(task.course || task.due) && (
          <Text style={styles.cardSubtitle}>
            {task.course ? `${task.course}` : ""}
            {task.course && task.due ? "  •  " : ""}
            {task.due ? `Frist: ${task.due}` : ""}
          </Text>
        )}
      </View>
    </View>
  );
}

// StyleSheet
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { flex: 1, backgroundColor: colors.bg },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.text,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  subTitle: {
    fontSize: 13,
    color: colors.subtext,
    paddingHorizontal: 20,
    paddingBottom: 12,
    marginTop: 2,
  },
  listContent: { paddingHorizontal: 16, paddingBottom: 16 },
  separator: { height: 10 },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    color: colors.muted,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.subtext,
    marginTop: 4,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  check: { marginRight: 12 },
  checkOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.subtext,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  checkOuterOn: { borderColor: colors.accent, backgroundColor: "#fff7d6" },
  checkInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.accent,
  },
  cardTextWrap: { flex: 1 },
  cardTitle: { fontSize: 16, color: colors.text, fontWeight: "600" },
  cardTitleDone: { textDecorationLine: "line-through", color: colors.subtext },
  cardSubtitle: { marginTop: 2, fontSize: 13, color: colors.subtext },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 26,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
});
