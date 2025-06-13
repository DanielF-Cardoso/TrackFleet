import React, { useEffect } from 'react';
import { ViewProps } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface FadeInViewProps extends ViewProps {
  delay?: number;
  duration?: number;
}

const FadeInView: React.FC<FadeInViewProps> = ({
  children,
  delay = 0,
  duration = 300,
  style,
  ...rest
}) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(10);

  useEffect(() => {
    opacity.value = withTiming(1, {
      duration,
      easing: Easing.out(Easing.quad),
      delay,
    });
    translateY.value = withTiming(0, {
      duration,
      easing: Easing.out(Easing.quad),
      delay,
    });
  }, [opacity, translateY, duration, delay]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <Animated.View style={[animatedStyle, style]} {...rest}>
      {children}
    </Animated.View>
  );
};

export default FadeInView;