import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const CustomTextInput = ({
  placeholder,
  label,
  value,
  onChangeText,
  containerStyle,
  secureTextEntry,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholder={placeholder}
        onChangeText={onChangeText}
        value={value}
        style={styles.input}
        secureTextEntry={secureTextEntry}
        autoCapitalize="none"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 10,
  },
  label: {
    marginBottom: 5,
    fontSize: 14,
    color: '#888',
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
  },
});

export default CustomTextInput;
