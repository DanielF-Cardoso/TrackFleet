import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import tw from '../../utils/tailwind';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isPassword?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  isPassword = false,
  style,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(!isPassword);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.focused,
          error && styles.error,
        ]}
      >
        {leftIcon && <View style={styles.icon}>{leftIcon}</View>}
        <TextInput
          style={[styles.input, style]}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={isPassword && !passwordVisible}
          placeholderTextColor="#9CA3AF"
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            style={styles.icon}
            onPress={togglePasswordVisibility}
          >
            {passwordVisible ? (
              <Feather name="eye" size={20} color="#6B7280" />
            ) : (
              <Feather name="eye-off" size={20} color="#6B7280" />
            )}
          </TouchableOpacity>
        )}
        {rightIcon && !isPassword && <View style={styles.icon}>{rightIcon}</View>}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...tw`mb-4`,
  },
  label: {
    ...tw`text-sm font-medium text-gray-700 mb-1`,
  },
  inputContainer: {
    ...tw`flex-row items-center border border-gray-300 rounded-lg bg-white`,
    height: 48,
    paddingHorizontal: 12,
  },
  input: {
    ...tw`flex-1 text-gray-900`,
    height: '100%',
    textAlignVertical: 'center',
    paddingHorizontal: 4,
  },
  focused: {
    ...tw`border-primary-500`,
  },
  error: {
    ...tw`border-danger-500`,
  },
  icon: {
    ...tw`justify-center items-center`,
    height: '100%',
    width: 40,
  },
  errorText: {
    ...tw`text-sm text-danger-500 mt-1`,
  },
});

export default Input;