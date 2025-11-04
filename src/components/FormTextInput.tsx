import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface FormTextInputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export default function FormTextInput({ 
  label, 
  error, 
  style, 
  ...props 
}: FormTextInputProps) {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      marginBottom: 16,
    },
    label: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 6,
    },
    input: {
      borderWidth: 1,
      borderColor: error ? colors.error : colors.border,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      fontSize: 16,
      color: colors.text,
      backgroundColor: colors.card,
    },
    error: {
      fontSize: 12,
      color: colors.error,
      marginTop: 4,
    },
  });

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor={colors.muted}
        {...props}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}