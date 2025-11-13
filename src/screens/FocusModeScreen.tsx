/**
 * Fant en Pomodoro-timer laget av BoyagoCode på Expo Snack og brukte den som inspirasjon.
 * Ref: https://snack.expo.dev/@boyagocode/pomodoro-timer
 */

import React, { useEffect, useMemo, useRef, useState } from "react";
import { AppState, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";

// Modus for timeren
type Mode = "focus" | "short" | "long";

// Dine farger
const YELLOW = "#FFD54F";
const DARK = "#111";

/** Fargepalett */
const COLORS = {
  yellow: "#FFD54F",
  yellowSoft: "#FFE680",
  dark: "#111",
  text: "#222",
  white: "#FFF",
  subtle: "rgba(0,0,0,0.08)",
  accent: "#FF6F00",
};

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
  const [tick, setTick] = useState(0);               // For å trigge re-render hver ~300 ms

  /** Bruker-valgt fokuslengde */
  const [customFocusLength, setCustomFocusLength] = useState(25); // 25 min som standard

  // Referanser for start- og sluttidspunkt
  const startTimeRef = useRef<number | null>(null);
  const endTimeRef = useRef<number | null>(null);

  // Henter varighet i sekunder basert på modus
  const getDuration = (m: Mode) => {
    if (m === "focus") return customFocusLength * 60; // bruker sitt valg
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

    const id = setInterval(() => {    
      setTick((t) => t + 1);
      if (endTimeRef.current && Date.now() >= endTimeRef.current) {
        clearInterval(id);
        setRunning(false);
        goToNextMode();
      }
    }, 300);

    return () => clearInterval(id);
  }, [running, mode, completedCycles]);

  // Oppdaterer når appen går fra bakgrunn til forgrunn
  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        setTick((t) => t + 1);
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
    mode === "focus" ? "FOKUMODUS" : mode === "short" ? "KORT PAUSE" : "LANG PAUSE";

  return (
    <View style={styles.container}>
      {/* Tittel */}
      <Text style={styles.title}>{title}</Text>

      {/* Økt-lengde valg (kun synlig når timer ikke kjører) */}
      {!running && mode === "focus" && (
        <View style={styles.selectorRow}>
          {[25, 30, 45].map((min) => (
            <TouchableOpacity
              key={min}
              onPress={() => setCustomFocusLength(min)}
              style={[
                styles.optionButton,
                customFocusLength === min && styles.optionButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.optionText,
                  customFocusLength === min && styles.optionTextActive,
                ]}
              >
                {min} min
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Sirkel-progress */}
      <AnimatedCircularProgress
        size={270}
        width={14}
        rotation={0}
        backgroundWidth={12}
        tintColor={DARK}
        backgroundColor="rgba(0,0,0,0.05)"
        fill={fill}
        style={styles.progress}
      >
        {() => (
          <View style={styles.center}>
            <Text style={styles.time}>{formatTime()}</Text>
            <Text style={styles.sub}>
              {mode === "focus" ? "Hold fokus 💪" : "Ta en liten pause 😌"}
            </Text>
          </View>
        )}
      </AnimatedCircularProgress>

      {/* Start/Pause-knapp */}
      <TouchableOpacity
        style={[styles.mainButton, running && styles.pauseButton]}
        onPress={handleStartPause}
      >
        <Text style={[styles.mainButtonText, running && styles.pauseButtonText]}>
          {running ? "Pause" : "Start"}
        </Text>
      </TouchableOpacity>

      {/* Sekundærknapper */}
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => startNewSession("focus")}
        >
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
  container: {
    flex: 1,
    backgroundColor: COLORS.yellow,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: 0.8,
    color: COLORS.dark,
    marginBottom: 14,
  },

  // ⭐ Ny: valgknapper
  selectorRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 18,
  },
  optionButton: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  optionButtonActive: {
    backgroundColor: COLORS.white,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  optionText: {
    fontWeight: "600",
    color: COLORS.dark,
  },
  optionTextActive: {
    fontWeight: "800",
    color: COLORS.accent,
  },

  progress: { marginBottom: 28 },
  center: { alignItems: "center", justifyContent: "center" },
  time: { fontSize: 78, fontWeight: "900", color: COLORS.dark },
  sub: { marginTop: 8, opacity: 0.75, fontSize: 16, fontWeight: "500" },

  mainButton: {
    backgroundColor: COLORS.dark,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 20,
    marginTop: 10,
    elevation: 3,
  },
  mainButtonText: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.white,
  },
  pauseButton: {
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.dark,
  },
  pauseButtonText: {
    color: COLORS.dark,
  },

  row: {
    flexDirection: "row",
    gap: 14,
    marginTop: 16,
  },
  secondaryButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: "rgba(255,255,255,0.5)",
    borderRadius: 14,
  },
  secondaryText: {
    fontWeight: "700",
    color: COLORS.dark,
  },

  meta: {
    marginTop: 16,
    opacity: 0.6,
    fontSize: 14,
    fontWeight: "500",
  },
});
