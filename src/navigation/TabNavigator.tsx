import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import CalendarScreen from '../screens/CalendarScreen';
import FocusModeScreen from '../screens/FocusModeScreen';
import GroupsScreen from '../screens/GroupsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import TasksScreen from '../screens/TasksScreen';
import { useTheme } from '../contexts/ThemeContext';


const colors = {
  gold: '#FFD700',
  muted: '#888888',
};

type RootTabParamList = {
  Kalender: undefined;
  Oppgaver: undefined;
  Grupper: undefined;
  Fokus: undefined;
  Innstillinger: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function TabNavigator() {
  const { colors: themeColors } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: themeColors.accent,
        tabBarInactiveTintColor: themeColors.muted,
        tabBarStyle: {
          backgroundColor: themeColors.card,
          borderTopColor: themeColors.border,
        },
        tabBarIcon: ({ color, size }) => {
          
          if (route.name === 'Kalender') return <Ionicons name="calendar" size={size} color={color} />;
          if (route.name === 'Oppgaver') return <MaterialCommunityIcons name="format-list-bulleted" size={size} color={color} />;
          if (route.name === 'Fokus') return <Ionicons name="timer" size={size} color={color} />;
          if (route.name === 'Grupper') return <Ionicons name="people" size={size} color={color} />;
          if (route.name === 'Innstillinger') return <Ionicons name="settings" size={size} color={color} />;
          return null;
        },
      })}
    >
      <Tab.Screen name="Kalender" component={CalendarScreen} />
      <Tab.Screen name="Oppgaver" component={TasksScreen} />
      <Tab.Screen name="Grupper" component={GroupsScreen} />
      <Tab.Screen name="Fokus" component={FocusModeScreen} />
      <Tab.Screen name="Innstillinger" component={SettingsScreen} />

    </Tab.Navigator>
  );

}