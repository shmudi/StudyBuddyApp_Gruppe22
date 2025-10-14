/**
 * Fant en Pomodoro-timer laget av BoyagoCode på Expo Snack og brukte den som inspirasjon.
 * Ref: https://snack.expo.dev/@boyagocode/pomodoro-timer
 */

import React, { useEffect, useMemo, useRef, useState } from "react";
import { AppState, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";

type Mode = "focus" | "short" | "long";

const YELLOW = "#FFD54F";
const DARK = "#111";

// Standardverdier for timeren
const CONFIG = {
  focusMin: 25,       // 25 minutter fokus
  shortBreakMin: 5,   // 5 minutters pause
  longBreakMin: 15,   // 15 minutters lang pause
  cyclesBeforeLong: 4 // Hver fjerde økt gir lang pause
};

export default function FocusModeScreen() {
  // --- Tilstandsvariabler
  const [mode, setMode] = useState<Mode>("focus");   // Nåværende modus
  const [running, setRunning] = useState(false);     // Om timeren går
  const [completedCycles, setCompletedCycles] = useState(0); // Antall fullførte fokusøkter

  const [tick, setTick] = useState(0); // For å trigge re-render hver ~300 ms når timeren går

  // Referanser for start- og sluttidspunkt
  const startTimeRef = useRef<number | null>(null);
  const endTimeRef = useRef<number | null>(null);

  // Henter varighet i sekunder basert på modus
  const getDuration = (m: Mode) => {
    if (m === "focus") return CONFIG.focusMin * 60;
    if (m === "short") return CONFIG.shortBreakMin * 60;
    return CONFIG.longBreakMin * 60;
  };

  // Starter ny økt i valgt modus
  const startNewSession = (m: Mode) => {
    const now = Date.now();
    startTimeRef.current = now;
    endTimeRef.current = now + getDuration(m) * 1000;
    setMode(m);
    setRunning(true);
    setTick((t) => t + 1);  // Trigger re-render
  };

  // Bytter til neste modus når en økt er ferdig
  const goToNextMode = () => {
    if (mode === "focus") {
      const nextIsLong = (completedCycles + 1) % CONFIG.cyclesBeforeLong === 0;
      setCompletedCycles((c) => c + 1);
      startNewSession(nextIsLong ? "long" : "short");
    } else {
      startNewSession("focus");
    }
  };

  // Beregner progresjon (sirkel) og tid igjen
  const getProgressData = () => {
    if (!startTimeRef.current || !endTimeRef.current)
      return { fill: 0, secondsLeft: getDuration(mode) };

    const now = Date.now();
    const total = (endTimeRef.current - startTimeRef.current) / 1000;
    const remaining = Math.max(0, Math.round((endTimeRef.current - now) / 1000));
    const fill = Math.min(100, ((total - remaining) / total) * 100);
    return { fill, secondsLeft: remaining };
  };

  const { fill, secondsLeft } = useMemo(() => getProgressData(), [tick, mode]);

  // Starter eller pauser timeren
  const handleStartPause = () => {
    if (running) {
      setRunning(false);
    } else {
      if (!startTimeRef.current || !endTimeRef.current) {
        startNewSession(mode);
      } else {
        const now = Date.now();
        endTimeRef.current = now + secondsLeft * 1000;
        setRunning(true);
        setTick((t) => t + 1);
      }
    }
  };

  // Tilbakestiller alt
  const resetTimer = () => {
    setRunning(false);
    setCompletedCycles(0);
    startTimeRef.current = null;
    endTimeRef.current = null;
    setMode("focus");
    setTick((t) => t + 1);
  };

  // Intervall som sjekker når tiden er ute + driver UI-tikkingen
  useEffect(() => {
    if (!running) return;

    const id = setInterval(() => {          // FIX: legg inn setInterval og få et id
      setTick((t) => t + 1);                 // driver UI-tikk
      if (endTimeRef.current && Date.now() >= endTimeRef.current) {
        clearInterval(id);                   // FIX: clear riktig id
        setRunning(false);
        goToNextMode();
      }
    }, 300); // 300 ms

    return () => clearInterval(id);   
  }, [running, mode, completedCycles]);

  // Oppdaterer når appen går fra bakgrunn til forgrunn
  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        setTick((t) => t + 1); // henter igjen korrekt resttid ved retur til appen
      }
    });
    return () => sub.remove();
  }, []);

  // Formatterer tid til MM:SS
  const formatTime = () => {
    const minutes = Math.floor(secondsLeft / 60).toString().padStart(2, "0");
    const seconds = (secondsLeft % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  // Tittel basert på modus
  const title =
    mode === "focus" ? "FOKUSMODUS" : mode === "short" ? "KORT PAUSE" : "LANG PAUSE";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <AnimatedCircularProgress
        size={260}
        width={14}
        rotation={0}
        backgroundWidth={14}
        tintColor={DARK}
        backgroundColor="rgba(0,0,0,0.08)"
        fill={fill}
        style={styles.progress}
      >
        {() => (
          <View style={styles.center}>
            <Text style={styles.time}>{formatTime()}</Text>
            <Text style={styles.sub}>
              {mode === "focus" ? "hold fokus 💪" : "ta en liten pause 😌"}
            </Text>
          </View>
        )}
      </AnimatedCircularProgress>

      <TouchableOpacity style={styles.mainButton} onPress={handleStartPause}>
        <Text style={styles.mainButtonText}>{running ? "Pause" : "Start"}</Text>
      </TouchableOpacity>

      <View style={styles.row}>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => startNewSession("focus")}>
          <Text style={styles.secondaryText}>Ny økt</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={resetTimer}>
          <Text style={styles.secondaryText}>Nullstill</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.meta}>Fullførte fokusøkter: {completedCycles}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: YELLOW, alignItems: "center", justifyContent: "center", paddingHorizontal: 20 },
  title: { fontSize: 22, fontWeight: "800", letterSpacing: 0.5, marginBottom: 18 },
  progress: { marginBottom: 24 },
  center: { alignItems: "center", justifyContent: "center" },
  time: { fontSize: 80, fontWeight: "800", color: DARK },
  sub: { marginTop: 6, opacity: 0.7, fontSize: 16 },
  mainButton: { backgroundColor: "#fff", paddingVertical: 14, paddingHorizontal: 32, borderRadius: 16, marginTop: 6, elevation: 2 },
  mainButtonText: { fontSize: 18, fontWeight: "800" },
  row: { flexDirection: "row", gap: 12, marginTop: 12 },
  secondaryButton: { paddingVertical: 10, paddingHorizontal: 16, backgroundColor: "rgba(0,0,0,0.08)", borderRadius: 12 },
  secondaryText: { fontWeight: "600" },
  meta: { marginTop: 12, opacity: 0.7 },
});
