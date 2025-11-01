import { Ionicons } from "@expo/vector-icons"; 
import React, { useEffect, useMemo, useState } from "react"; 
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native"; 
import { useAuth } from "../contexts/AuthContext";
import { Task, TaskService } from "../services/tasks"; 
import { colors } from "../theme/colors";

// Ukedager forkortet (manuelt definert)
const WEEKDAYS = ["M", "T", "O", "T", "F", "L", "S"];

type DayCell = {
  key: string;
  label?: number;
  muted?: boolean;
  hasDot?: boolean;
};

export default function CalendarScreen() {
  const { user } = useAuth();
  const [monthOffset, setMonthOffset] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);


  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const userTasks = await TaskService.getUserTasks(user.uid);
        setTasks(userTasks);
      } catch (error) {
        console.warn("Kunne ikke hente oppgaver:", error);
      }
    })();
  }, [user, monthOffset]);

  // useMemo brukes for å optimalisere kalendergrid-beregning
  // Kilde: https://react.dev/reference/react/useMemo
  const { monthLabel, daysGrid, todayNum } = useMemo(() => {
    const base = new Date();
    // Beregner aktuell måned basert på offset (positiv = fremtid, negativ = fortid)
    const current = new Date(base.getFullYear(), base.getMonth() + monthOffset, 1);

    // Formatterer månedsnavn til norsk språkform
    // Kilde: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
    const monthName = new Intl.DateTimeFormat("no-NO", {
      month: "long",
      year: "numeric",
    }).format(current);
    const label = monthName.charAt(0).toUpperCase() + monthName.slice(1);

    // Finner første ukedag i måneden (mandag = 0)
    // Kilde: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getDay
    const firstWeekday = (current.getDay() + 6) % 7;

    // Beregner antall dager i måneden
    // Kilde: https://stackoverflow.com/questions/1184334/get-number-days-in-a-specified-month-using-javascript
    const daysInMonth = new Date(current.getFullYear(), current.getMonth() + 1, 0).getDate();

    // Lager et grid for kalenderen, og fyller ut tomme plasser fra forrige måned
    const grid: DayCell[] = [];
    for (let i = 0; i < firstWeekday; i++) grid.push({ key: `p${i}`, muted: true });

    // Finn alle oppgaver som har frist i denne måneden
    const eventsByDay = new Set<number>();
    tasks.forEach((task) => {
      if (!task.due) return;
      const dueDate = new Date(task.due);
      if (
        dueDate.getFullYear() === current.getFullYear() &&
        dueDate.getMonth() === current.getMonth()
      ) {
        eventsByDay.add(dueDate.getDate());
      }
    });

    // Legger inn dager med eventuelle markeringer (prikker)
    for (let d = 1; d <= daysInMonth; d++) {
      grid.push({
        key: `d${d}`,
        label: d,
        hasDot: eventsByDay.has(d),
      });
    }

    // Fyller ut siste rad slik at alle uker vises korrekt
    while (grid.length % 7 !== 0) grid.push({ key: `n${grid.length}`, muted: true });

    // Marker dagens dato (brukes til visuell markering)
    // Kilde: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
    const t = new Date();
    const isSameMonth =
      t.getFullYear() === current.getFullYear() && t.getMonth() === current.getMonth();
    const todayNum = isSameMonth ? t.getDate() : null;

    return { monthLabel: label, daysGrid: grid, todayNum };
  }, [monthOffset, tasks]);

  // Filtrerer alle oppgaver som tilhører valgt dato
  // Bruker Date-objekt for å sammenligne dag, måned og år
  // Kilde: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
  const selectedTasks = useMemo(() => {
    if (!selected) return [];
    const base = new Date();
    const currentMonth = new Date(base.getFullYear(), base.getMonth() + monthOffset, 1);
    return tasks.filter((t) => {
      if (!t.due) return false;
      const d = new Date(t.due);
      return (
        d.getFullYear() === currentMonth.getFullYear() &&
        d.getMonth() === currentMonth.getMonth() &&
        d.getDate() === selected
      );
    });
  }, [selected, tasks, monthOffset]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header med knapp for å bytte måned */}
      {/* Kilde: https://docs.expo.dev/guides/icons/ */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => setMonthOffset((o) => o - 1)}
          accessibilityRole="button"
          accessibilityLabel="Forrige måned"
        >
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </TouchableOpacity>

        <Text style={styles.month}>{monthLabel}</Text>

        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => setMonthOffset((o) => o + 1)}
          accessibilityRole="button"
          accessibilityLabel="Neste måned"
        >
          <Ionicons name="chevron-forward" size={22} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Viser ukedagene øverst */}
      {/* Kilde: https://reactnative.dev/docs/text */}
      <View style={styles.weekRow}>
        {WEEKDAYS.map((d, i) => (
          <Text key={`${d}-${i}`} style={styles.weekday}>
            {d}
          </Text>
        ))}
      </View>

      {/* Kalendergrid – bruker FlatList for optimal rendering */}
      {/* Kilde: https://reactnative.dev/docs/flatlist */}
      <FlatList
        data={daysGrid}
        numColumns={7}
        keyExtractor={(i) => i.key}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.grid}
        initialNumToRender={21}
        windowSize={7}
        renderItem={({ item }) => {
          const isToday = !!item.label && item.label === todayNum;
          const isSelected = !!item.label && item.label === selected;

          return (
            <TouchableOpacity
              activeOpacity={0.8}
              disabled={!item.label || item.muted}
              onPress={() => item.label && setSelected(item.label)}
              style={[
                styles.dayCell,
                item.muted && styles.dayMuted,
                isToday && styles.today,
                isSelected && styles.selected,
              ]}
              accessibilityRole="button"
              accessibilityLabel={
                item.label
                  ? `Dag ${item.label} i ${monthLabel}${isToday ? ", i dag" : ""}`
                  : undefined
              }
            >
              <Text
                style={[
                  styles.dayText,
                  item.muted && styles.muted,
                  isSelected && styles.selectedText,
                ]}
              >
                {item.label ?? ""}
              </Text>

              {/* Viser prikk på dager med registrerte oppgaver */}
              {/* Kilde: https://firebase.google.com/docs/firestore/query-data/get-data */}
              {item.hasDot && !item.muted && (
                <View style={[styles.dot, isSelected && styles.dotOnSelected]} />
              )}
            </TouchableOpacity>
          );
        }}
      />

      {/* Info-kort nederst – viser oppgaver for valgt dag */}
      <View style={styles.infoCard}>
        {selected ? (
          <>
            <Text style={styles.infoTitle}>
              {`Valgt: ${selected}. ${monthLabel.split(" ")[0]}`}
            </Text>
            {selectedTasks.length > 0 ? (
              selectedTasks.map((t) => (
                <Text key={t.id} style={styles.infoSub}>
                  • {t.title} ({t.course || "Uten fag"})
                </Text>
              ))
            ) : (
              <Text style={styles.infoSub}>Ingen oppgaver denne dagen 🎉</Text>
            )}
          </>
        ) : (
          <>
            <Text style={styles.infoTitle}>Velg en dag i kalenderen</Text>
            <Text style={styles.infoSub}>
              Prikker viser dager med oppgaver fra Firebase
            </Text>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

// Styles
const CELL_GAP = 8;
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 16 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  iconBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  month: { fontSize: 20, fontWeight: "700", color: colors.text },
  weekRow: { flexDirection: "row", justifyContent: "space-between", marginVertical: 6 },
  weekday: { flex: 1, textAlign: "center", fontWeight: "600", color: colors.muted },
  grid: { paddingBottom: 16 },
  gridRow: { justifyContent: "space-between", marginBottom: CELL_GAP },
  dayCell: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: 2,
  },
  dayMuted: { backgroundColor: "#fff", borderColor: "transparent" },
  dayText: { fontSize: 16, color: colors.text },
  muted: { color: colors.muted },
  today: { borderColor: colors.gold, borderWidth: 2 },
  selected: { backgroundColor: colors.gold, borderColor: colors.gold },
  selectedText: { color: "#fff", fontWeight: "700" },
  dot: {
    position: "absolute",
    bottom: 6,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.gold,
  },
  dotOnSelected: { backgroundColor: "#fff" },
  infoCard: {
    backgroundColor: colors.goldSoft,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  infoTitle: { color: colors.text, fontWeight: "700" },
  infoSub: { color: colors.muted, marginTop: 2, fontSize: 13 },
});
