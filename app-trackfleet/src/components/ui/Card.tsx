import React from 'react';
import { View, Text, StyleSheet, ViewProps } from 'react-native';
import tw from '../../utils/tailwind';

interface CardProps extends ViewProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  footer,
  style,
  ...rest
}) => {
  return (
    <View style={[styles.card, style]} {...rest}>
      {(title || subtitle) && (
        <View style={styles.header}>
          {title && <Text style={styles.title}>{title}</Text>}
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      )}
      <View style={styles.content}>{children}</View>
      {footer && <View style={styles.footer}>{footer}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    ...tw`bg-white rounded-xl shadow-sm my-2 overflow-hidden`,
  },
  header: {
    ...tw`p-4 border-b border-gray-100`,
  },
  content: {
    ...tw`p-4`,
  },
  title: {
    ...tw`text-lg font-bold text-gray-800`,
  },
  subtitle: {
    ...tw`text-sm text-gray-500 mt-1`,
  },
  footer: {
    ...tw`p-4 bg-gray-50 border-t border-gray-100`,
  },
});

export default Card;