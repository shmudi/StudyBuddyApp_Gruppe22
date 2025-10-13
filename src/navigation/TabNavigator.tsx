import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CalendarScreen from '../screens/CalendarScreen';
import FocusModeScreen from '../screens/FocusModeScreen';
import GroupsScreen from '../screens/GroupsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import TasksScreen from '../screens/TasksScreen';


const colors = {
  gold: '#FFD700',
  muted: '#888888',
};

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }: { route: { name: string } }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.gold,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: { backgroundColor: '#fff' },
        tabBarIcon: ({ color, size }: { color: string; size: number }) => {
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