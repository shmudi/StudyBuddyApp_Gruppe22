import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ThemeMode = "light" | "dark";

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  colors: {
    background: string;
    text: string;
    card: string;
    border: string;
    muted: string;
    accent: string;
    error: string;
  };
}

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

const lightColors = {
  background: "#FFFFFF",
  text: "#111111",
  card: "#F7F7F7",
  border: "#E5E7EB",
  muted: "#6B7280",
  accent: "#EAB308", // varmere gull (amber-500)
  error: "#EF4444",
};

// En mykere, mer behagelig "slate"-palett for dark mode
const darkColors = {
  background: "#0F172A", // slate-900
  text: "#E5E7EB", // gray-200
  card: "#111827", // slate-800
  border: "#1F2937", // slate-700
  muted: "#94A3B8", // slate-400
  accent: "#EAB308", // amber-500
  error: "#EF4444", // red-500
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<ThemeMode>("light");

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem("theme");
      if (saved === "dark" || saved === "light") setTheme(saved);
    })();
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    await AsyncStorage.setItem("theme", newTheme);
  };

  const colors = theme === "dark" ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
