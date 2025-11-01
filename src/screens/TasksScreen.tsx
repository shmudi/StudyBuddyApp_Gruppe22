import { Ionicons } from "@expo/vector-icons";
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
import { useTheme } from "../contexts/ThemeContext";
import { Task, TaskService } from "../services/tasks";
// Importer DateTimePicker kun på native for å unngå web-bundle issues
let DateTimePicker: any = null;
if (Platform.OS !== "web") {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  DateTimePicker = require("@react-native-community/datetimepicker").default;
}

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
  const { theme, colors: themeColors } = useTheme();
  const styles = useMemo(() => makeStyles(themeColors), [themeColors]);
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

  // Lokal komponent så den kan bruke styles og themeColors fra closure
  function TaskCard({ task, onToggle, onDelete }: any) {
    return (
      <View style={styles.card}>
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

        <TouchableOpacity onPress={onDelete}>
          <Ionicons name="trash-outline" size={20} color={themeColors.muted} />
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View
          style={[styles.container, { justifyContent: "center", alignItems: "center" }]}
        >
          <Text style={{ color: themeColors.muted }}>Laster oppgaver...</Text>
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

        {/* Knapp for å åpne modal */}
        <TouchableOpacity
          style={styles.fab}
          activeOpacity={0.85}
          onPress={() => setModalVisible(true)}
          accessibilityLabel="Legg til oppgave"
        >
          <Ionicons name="add" size={28} color={'#111'} />
        </TouchableOpacity>

        {/* Modal for å legge til oppgave */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContainer, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
              <Text style={styles.modalTitle}>Ny oppgave</Text>

              <TextInput
                placeholder="Tittel"
                placeholderTextColor={themeColors.muted}
                style={styles.input}
                value={newTitle}
                onChangeText={setNewTitle}
              />
              <TextInput
                placeholder="Fag (valgfritt)"
                placeholderTextColor={themeColors.muted}
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
                    borderColor: theme === 'light' ? '#333' : themeColors.border,
                    borderRadius: 10,
                    padding: 10,
                    marginBottom: 10,
                    color: theme === 'light' ? '#fff' : themeColors.text,
                    backgroundColor: theme === 'light' ? '#000' : themeColors.card,
                    fontSize: 16,
                    width: "100%",
                  }}
                />
              ) : (
                <>
                  <TouchableOpacity
                    onPress={() => setShowDatePicker(true)}
                    style={[
                      styles.input,
                      { justifyContent: "center" },
                      theme === 'light' && { backgroundColor: '#000', borderColor: '#333' },
                    ]}
                  >
                    <Text style={{ color: theme === 'light' ? '#fff' : (newDue ? themeColors.text : themeColors.muted) }}>
                      {newDue ? `Frist: ${newDue}` : "Velg fristdato"}
                    </Text>
                  </TouchableOpacity>

                  {showDatePicker && DateTimePicker && (
                    <DateTimePicker
                      value={selectedDate || new Date()}
                      mode="date"
                      display={Platform.OS === "ios" ? "spinner" : "calendar"}
                      {...(Platform.OS === 'ios' ? { themeVariant: theme === 'dark' ? 'dark' : 'light' } : {})}
                      onChange={(event: any, date?: Date) => {
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

// (TaskCard er flyttet inn i komponenten over)

// Styles avledet fra aktivt tema
const makeStyles = (theme: any) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: theme.background },
    container: { flex: 1, backgroundColor: theme.background },
    title: {
      fontSize: 28,
      fontWeight: "800",
      color: theme.text,
      paddingHorizontal: 20,
      paddingTop: 8,
    },
    subTitle: {
      fontSize: 13,
      color: theme.muted,
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
      color: theme.muted,
      fontWeight: "600",
    },
    emptySubtext: {
      fontSize: 14,
      color: theme.muted,
      marginTop: 4,
    },
    card: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: theme.card,
      borderRadius: 14,
      paddingVertical: 14,
      paddingHorizontal: 14,
      borderWidth: 1,
      borderColor: theme.border,
    },
    check: { marginRight: 12 },
    checkOuter: {
      width: 22,
      height: 22,
      borderRadius: 11,
      borderWidth: 2,
      borderColor: theme.muted,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.card,
    },
    checkOuterOn: { borderColor: theme.accent, backgroundColor: theme.card },
    checkInner: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: theme.accent,
    },
    cardTextWrap: { flex: 1, marginRight: 8 },
    cardTitle: { fontSize: 16, color: theme.text, fontWeight: "600" },
    cardTitleDone: { textDecorationLine: "line-through", color: theme.muted },
    cardSubtitle: { marginTop: 2, fontSize: 13, color: theme.muted },
    fab: {
      position: "absolute",
      right: 20,
      bottom: 26,
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: theme.accent,
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
    // Modal styles
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.4)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContainer: {
      width: "85%",
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 20,
      borderWidth: 1,
      borderColor: theme.border,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "700",
      marginBottom: 10,
      color: theme.text,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 10,
      padding: 10,
      marginBottom: 10,
      color: theme.text,
      backgroundColor: theme.card,
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
      backgroundColor: theme.border,
    },
    saveBtn: {
      backgroundColor: theme.accent,
    },
    modalBtnText: {
      fontWeight: "700",
      color: theme.text,
    },
  });
