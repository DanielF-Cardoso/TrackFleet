import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import tw from '../../utils/tailwind';

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Loading...',
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0066FF" />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...tw`flex-1 justify-center items-center p-4 bg-white`,
  },
  text: {
    ...tw`mt-4 text-base text-gray-600`,
  },
});

export default LoadingScreen;