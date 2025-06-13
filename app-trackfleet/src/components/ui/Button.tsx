import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TouchableOpacityProps,
  StyleSheet,
} from 'react-native';
import tw from '../../utils/tailwind';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  disabled,
  style,
  ...rest
}) => {
  const getVariantStyle = (variant: ButtonVariant) => {
    switch (variant) {
      case 'primary':
        return tw`bg-primary-500`;
      case 'secondary':
        return tw`bg-secondary-500`;
      case 'outline':
        return tw`bg-transparent border border-gray-300`;
      case 'danger':
        return tw`bg-danger-500`;
      default:
        return tw`bg-primary-500`;
    }
  };

  const getTextColor = (variant: ButtonVariant) => {
    switch (variant) {
      case 'outline':
        return tw`text-gray-700`;
      default:
        return tw`text-white`;
    }
  };

  const getSizeStyle = (size: ButtonSize) => {
    switch (size) {
      case 'sm':
        return tw`py-1 px-3`;
      case 'md':
        return tw`py-2 px-4`;
      case 'lg':
        return tw`py-3 px-6`;
      default:
        return tw`py-2 px-4`;
    }
  };

  const getTextSize = (size: ButtonSize) => {
    switch (size) {
      case 'sm':
        return tw`text-sm`;
      case 'md':
        return tw`text-base`;
      case 'lg':
        return tw`text-lg`;
      default:
        return tw`text-base`;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getVariantStyle(variant),
        getSizeStyle(size),
        fullWidth && tw`w-full`,
        disabled && tw`opacity-50`,
        style,
      ]}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'outline' ? '#6B7280' : 'white'} />
      ) : (
        <>
          {leftIcon && <Text style={styles.iconLeft}>{leftIcon}</Text>}
          <Text
            style={[
              styles.text,
              getTextColor(variant),
              getTextSize(size),
              disabled && tw`opacity-50`,
            ]}
          >
            {title}
          </Text>
          {rightIcon && <Text style={styles.iconRight}>{rightIcon}</Text>}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    ...tw`rounded-lg flex-row justify-center items-center`,
  },
  text: {
    ...tw`font-medium text-center`,
  },
  iconLeft: {
    ...tw`mr-2`,
  },
  iconRight: {
    ...tw`ml-2`,
  },
});

export default Button;