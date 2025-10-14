import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from "../theme/colors";

// Alpha = bare UI og lokal state for nå
type Task = {
  id: string;
  title: string;
  course?: string;
  due?: string;
  done: boolean;
};

// Dummy-data for nå
const INITIAL_TASKS: Task[] = [
  { id: "1", title: "Arbeidskrav 3 - Diskret matte", course: "Diskret matte", due: "2025-10-01", done: false },
  { id: "2", title: "Prosjektoppgave - Software Engineering", course: "SE og testing", due: "2025-10-05", done: true },
  { id: "3", title: "Oblig 2 - Operativsystemer", course: "Operativsystemer", due: "2025-10-03", done: false },
];

export default function TasksScreen() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);

  // Teller hvor mange som er fullført – bruker useMemo for å unngå unødvendige re-renders
  // Ref: https://react.dev/reference/react/useMemo
  const { completed, total } = useMemo(() => {
    const total = tasks.length || 1;
    const completed = tasks.filter((t) => t.done).length;
    return { completed, total };
  }, [tasks]);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Oppgaver</Text>
        <Text style={styles.subTitle}>
          {completed}/{total} fullført
        </Text>

        {/* FlatList brukes for effektiv rendering av oppgaveliste
            Ref: https://reactnative.dev/docs/flatlist */}
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <TaskCard task={item} onToggle={() => toggleTask(item.id)} />
          )}
        />

        {/* Ionicons fra Expo for "legg til"-ikon */}
        {/* Ref: https://docs.expo.dev/guides/icons/ */}
        <TouchableOpacity
          style={styles.fab}
          activeOpacity={0.85}
          onPress={() => {
            // TODO Beta: åpne modal for ny oppgave
          }}
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
