import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../theme/colors';



const WEEKDAYS = ['M', 'T', 'O', 'T', 'F', 'L', 'S'];

type DayCell = {
  key: string;
  label?: number;   // 1..31 (dag i måneden)
  muted?: boolean;  // tomme ruter før/etter måneden
  hasDot?: boolean; // liten indikator for “noe skjer” (dummy i Alpha)
};

// Hvis vi vil koble på ekte events senere, kan vi la komponenten ta inn props. For nå holder vi det enkelt for alpha-demo
export default function CalendarScreen() {
  const [monthOffset, setMonthOffset] = useState(0);       
  const [selected, setSelected] = useState<number | null>(null); 

  // useMemo så vi ikke bygger grid på nytt uten grunn når offset endrer seg.
  // (Cache av beregninger basically.)
  // Ref: https://react.dev/reference/react/useMemo
  const { monthLabel, daysGrid, todayNum } = useMemo(() => {
    const base = new Date();
    const current = new Date(base.getFullYear(), base.getMonth() + monthOffset, 1);

    // Norsk måned + år. (Intl er nice, gir riktig språk automatisk.)
    // Ref: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
    const monthName = new Intl.DateTimeFormat('no-NO', {
      month: 'long',
      year: 'numeric',
    }).format(current);
    const label = monthName.charAt(0).toUpperCase() + monthName.slice(1);

    // Date.getDay(): 0=søndag … 6=lørdag. Jeg vil ha mandag=0:
    // (getDay() + 6) % 7 skyver søndag bakerst. Enkelt triks.
    // Ref: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date/getDay
    const firstWeekday = (current.getDay() + 6) % 7;

  
    const daysInMonth = new Date(current.getFullYear(), current.getMonth() + 1, 0).getDate();

    const grid: DayCell[] = [];
    for (let i = 0; i < firstWeekday; i++) grid.push({ key: `p${i}`, muted: true });

    // Demo-dots i Alpha - kalenderen vil ser mer “levende” ut på skjerm.
    // Når vi kobler data: sett hasDot = eventsByDay.has(d) i stedet.
    const demoDots = new Set([3, 9, 14, 21, 28]);

    for (let d = 1; d <= daysInMonth; d++) {
      grid.push({
        key: `d${d}`,
        label: d,
        hasDot: demoDots.has(d), // skal bytte til eventsByDay.has(d) når vi har ekte data
      });
    }


    while (grid.length % 7 !== 0) grid.push({ key: `n${grid.length}`, muted: true });

    // Marker i dag (kun hvis vi er på inneværende måned)
    const t = new Date();
    const isSameMonth = t.getFullYear() === current.getFullYear() && t.getMonth() === current.getMonth();
    const todayNum = isSameMonth ? t.getDate() : null;

    return { monthLabel: label, daysGrid: grid, todayNum };
  }, [monthOffset /*, events*/]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header m/ knapper for måned −/+ (med a11y på plass fordi, ja takk) */}
      {/* Ref: https://reactnative.dev/docs/accessibility */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => setMonthOffset(o => o - 1)}
          accessibilityRole="button"
          accessibilityLabel="Forrige måned"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          {/* Ionicons via Expo */}
          {/* Ref: https://docs.expo.dev/guides/icons/ */}
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </TouchableOpacity>

        <Text style={styles.month}>{monthLabel}</Text>

        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => setMonthOffset(o => o + 1)}
          accessibilityRole="button"
          accessibilityLabel="Neste måned"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="chevron-forward" size={22} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Ukedager (statisk rad, monospaced-ish layout) */}
      <View style={styles.weekRow}>
        {WEEKDAYS.map((d, i) => (
          <Text key={`${d}-${i}`} style={styles.weekday}>
            {d}
          </Text>
        ))}
      </View>

      {/* FlatList fordi den er smooth på lister/grid og resirkulerer views fint. */}
      {/* Ref: https://reactnative.dev/docs/flatlist */}
      {/* Ytelsestweaks: https://reactnative.dev/docs/optimizing-flatlist-configuration */}
      <FlatList
        data={daysGrid}
        numColumns={7}
        keyExtractor={i => i.key}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.grid}
        initialNumToRender={21} // 3 rader først for snappier start
        windowSize={7}          // litt cache for smooth scroll
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
                  ? `Dag ${item.label} i ${monthLabel}${isToday ? ', i dag' : ''}`
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
                {item.label ?? ''}
              </Text>

              {/* Liten dot nederst = “det skjer noe den dagen” (kun visuelt i Alpha). */}
              {item.hasDot && !item.muted && (
                <View style={[styles.dot, isSelected && styles.dotOnSelected]} />
              )}
            </TouchableOpacity>
          );
        }}
      />

      {/* Info-kort nederst - bare for å vise selection i Alpha. */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>
          {selected
            ? `Valgt: ${selected}. ${monthLabel.split(' ')[0]}`
            : 'Velg en dag i kalenderen'}
        </Text>
        <Text style={styles.infoSub}>(Kun visuelt i Alpha ekte funksjon kommer senere :D )</Text>
      </View>
    </SafeAreaView>
  );
}

// Litt spacing for grid mellom rader
const CELL_GAP = 8;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 16 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 },
  iconBtn: { padding: 6, borderRadius: 8, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  month: { fontSize: 20, fontWeight: '700', color: colors.text },

  weekRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6, marginBottom: 8 },
  weekday: { flex: 1, textAlign: 'center', fontWeight: '600', color: colors.muted },

  grid: { paddingBottom: 16 },
  gridRow: { justifyContent: 'space-between', marginBottom: CELL_GAP },

  dayCell: {
    flex: 1,
    aspectRatio: 1,            // gjør cella kvadratisk uansett skjerm
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: 2,
  },
  dayMuted: { backgroundColor: '#fff', borderColor: 'transparent' },
  dayText: { fontSize: 16, color: colors.text },
  muted: { color: colors.muted },

  today: { borderColor: colors.gold, borderWidth: 2 }, // highlight rundt dagens dato
  selected: { backgroundColor: colors.gold, borderColor: colors.gold },
  selectedText: { color: '#fff', fontWeight: '700' },

  dot: { position: 'absolute', bottom: 6, width: 6, height: 6, borderRadius: 3, backgroundColor: colors.gold },
  dotOnSelected: { backgroundColor: '#fff' },

  infoCard: {
    backgroundColor: colors.goldSoft,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  infoTitle: { color: colors.text, fontWeight: '700' },
  infoSub: { color: colors.muted, marginTop: 2, fontSize: 12 },
});