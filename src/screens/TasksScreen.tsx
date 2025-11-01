import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker"; // Kalender-velger
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../contexts/AuthContext";
import { Task, TaskService } from "../services/tasks";
import { colors } from "../theme/colors";

// Fallback sample data hvis Firebase ikke fungerer
const SAMPLE_TASKS: Task[] = [
  {
    id: "1",
    title: "Les kapittel 5",
    course: "React Native",
    due: "2025-11-01",
    done: false,
    userId: "sample",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function TasksScreen() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [useLocalData, setUseLocalData] = useState(false);

  // Modal-state for å legge til oppgave
  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCourse, setNewCourse] = useState("");
  const [newDue, setNewDue] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Hent oppgaver fra Firestore
  const loadTasks = useCallback(async () => {
    if (!user) {
      setTasks(SAMPLE_TASKS);
      setLoading(false);
      return;
    }

    try {
      const userTasks = await TaskService.getUserTasks(user.uid);
      setTasks(userTasks);
      setUseLocalData(false);
    } catch (error) {
      console.warn("Firebase feil, bruker local data:", error);
      setTasks(SAMPLE_TASKS);
      setUseLocalData(true);
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

  // Oppdater status (ferdig / ikke ferdig)
  const toggleTask = async (id: string, currentDone: boolean) => {
    if (useLocalData) {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, done: !currentDone } : t))
      );
      return;
    }

    try {
      await TaskService.toggleTask(id, !currentDone);
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, done: !currentDone } : t))
      );
    } catch (error) {
      Alert.alert("Feil", "Kunne ikke oppdatere oppgave");
    }
  };

  // Slett oppgave
  const handleDelete = async (id: string) => {
    if (useLocalData) {
      setTasks((prev) => prev.filter((t) => t.id !== id));
      return;
    }

    try {
      await TaskService.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      Alert.alert("Slettet", "Oppgaven er slettet");
    } catch (error) {
      Alert.alert("Feil", "Kunne ikke slette oppgave");
    }
  };

  // Lagre ny oppgave
  const handleAddTask = async () => {
    if (!newTitle.trim()) {
      Alert.alert("Feil", "Oppgaven må ha en tittel");
      return;
    }

    try {
      if (!user) throw new Error("Ikke logget inn");

      await TaskService.createTask(user.uid, {
        title: newTitle,
        course: newCourse || "",
        due: newDue || "",
      });

      setNewTitle("");
      setNewCourse("");
      setNewDue("");
      setModalVisible(false);
      await loadTasks();
      Alert.alert("Suksess", "Oppgaven ble lagt til!");
    } catch (error) {
      Alert.alert("Feil", "Kunne ikke opprette oppgave");
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View
          style={[styles.container, { justifyContent: "center", alignItems: "center" }]}
        >
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

        {/* Liste over oppgaver */}
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <TaskCard
              task={item}
              onToggle={() => toggleTask(item.id, item.done)}
              onDelete={() => handleDelete(item.id)}
            />
          )}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Ingen oppgaver ennå</Text>
              <Text style={styles.emptySubtext}>Trykk + for å legge til en oppgave</Text>
            </View>
          )}
        />

        {/* 🔹 Knapp for å åpne modal */}
        <TouchableOpacity
          style={styles.fab}
          activeOpacity={0.85}
          onPress={() => setModalVisible(true)}
          accessibilityLabel="Legg til oppgave"
        >
          <Ionicons name="add" size={28} color={colors.text} />
        </TouchableOpacity>

        {/* Modal for å legge til oppgave */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Ny oppgave</Text>

              <TextInput
                placeholder="Tittel"
                placeholderTextColor={colors.subtext}
                style={styles.input}
                value={newTitle}
                onChangeText={setNewTitle}
              />
              <TextInput
                placeholder="Fag (valgfritt)"
                placeholderTextColor={colors.subtext}
                style={styles.input}
                value={newCourse}
                onChangeText={setNewCourse}
              />

              {/* Dato-velger */}
              {Platform.OS === "web" ? (
                // Web fallback – bruker vanlig input type=date
                <input
                  type="date"
                  value={newDue}
                    onChange={(e) => setNewDue(((e as any).target?.value ?? (e as any).currentTarget?.value) ?? '')}
                  style={{
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 10,
                    padding: 10,
                    marginBottom: 10,
                    color: colors.text,
                    backgroundColor: "white",
                    fontSize: 16,
                    width: "100%",
                  }}
                />
              ) : (
                <>
                  <TouchableOpacity
                    onPress={() => setShowDatePicker(true)}
                    style={[styles.input, { justifyContent: "center" }]}
                  >
                    <Text style={{ color: newDue ? colors.text : colors.subtext }}>
                      {newDue ? `Frist: ${newDue}` : "Velg fristdato"}
                    </Text>
                  </TouchableOpacity>

                  {showDatePicker && (
                    <DateTimePicker
                      value={selectedDate || new Date()}
                      mode="date"
                      display={Platform.OS === "ios" ? "spinner" : "calendar"}
                      onChange={(event, date) => {
                        setShowDatePicker(false);
                        if (date) {
                          setSelectedDate(date);
                          const isoDate = date.toISOString().split("T")[0];
                          setNewDue(isoDate);
                        }
                      }}
                    />
                  )}
                </>
              )}

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalBtn, styles.cancelBtn]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.modalBtnText}>Avbryt</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalBtn, styles.saveBtn]}
                  onPress={handleAddTask}
                >
                  <Text style={styles.modalBtnText}>Lagre</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

function TaskCard({ task, onToggle, onDelete }: any) {
  return (
    <View style={styles.card}>
      {/* TouchableOpacity brukes for trykkbare elementer (checkbox) */}
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

      {/* Slett-knapp */}
      <TouchableOpacity onPress={onDelete}>
        <Ionicons name="trash-outline" size={20} color={colors.subtext} />
      </TouchableOpacity>
    </View>
  );
}

// Styles //
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
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    color: colors.muted,
    fontWeight: "600",
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.subtext,
    marginTop: 4,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  cardTextWrap: { flex: 1, marginRight: 8 },
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
    ...Platform.select({
      web: { boxShadow: "0 4px 12px rgba(0,0,0,0.15)" },
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
      },
      android: { elevation: 5 },
    }),
  },

  // 🔹 Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    color: colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    color: colors.text,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  modalBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 8,
  },
  cancelBtn: {
    backgroundColor: colors.border,
  },
  saveBtn: {
    backgroundColor: colors.accent,
  },
  modalBtnText: {
    fontWeight: "700",
    color: colors.text,
  },
});
