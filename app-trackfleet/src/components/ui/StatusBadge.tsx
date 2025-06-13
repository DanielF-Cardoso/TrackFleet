import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import tw from '../../utils/tailwind';

type StatusType = 'active' | 'inactive' | 'maintenance';

interface StatusBadgeProps {
  status: StatusType;
  size?: 'sm' | 'md' | 'lg';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
}) => {
  const getStatusColor = (status: StatusType) => {
    switch (status) {
      case 'active':
        return {
          bg: tw`bg-green-100`,
          text: tw`text-green-800`,
          dot: tw`bg-green-500`,
        };
      case 'inactive':
        return {
          bg: tw`bg-red-100`,
          text: tw`text-red-800`,
          dot: tw`bg-red-500`,
        };
      case 'maintenance':
        return {
          bg: tw`bg-yellow-100`,
          text: tw`text-yellow-800`,
          dot: tw`bg-yellow-500`,
        };
      default:
        return {
          bg: tw`bg-gray-100`,
          text: tw`text-gray-800`,
          dot: tw`bg-gray-500`,
        };
    }
  };

  const getSizeStyle = (size: string) => {
    switch (size) {
      case 'sm':
        return {
          badge: tw`px-2 py-1`,
          text: tw`text-xs`,
          dot: tw`w-1.5 h-1.5`,
        };
      case 'md':
        return {
          badge: tw`px-2.5 py-1.5`,
          text: tw`text-sm`,
          dot: tw`w-2 h-2`,
        };
      case 'lg':
        return {
          badge: tw`px-3 py-2`,
          text: tw`text-base`,
          dot: tw`w-2.5 h-2.5`,
        };
      default:
        return {
          badge: tw`px-2.5 py-1.5`,
          text: tw`text-sm`,
          dot: tw`w-2 h-2`,
        };
    }
  };

  const statusColors = getStatusColor(status);
  const sizeStyles = getSizeStyle(size);

  return (
    <View
      style={[
        styles.container,
        statusColors.bg,
        sizeStyles.badge,
      ]}
    >
      <View
        style={[
          styles.dot,
          statusColors.dot,
          sizeStyles.dot,
        ]}
      />
      <Text
        style={[
          styles.text,
          statusColors.text,
          sizeStyles.text,
        ]}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...tw`flex-row items-center rounded-full`,
  },
  dot: {
    ...tw`rounded-full mr-1.5`,
  },
  text: {
    ...tw`font-medium`,
  },
});

export default StatusBadge;