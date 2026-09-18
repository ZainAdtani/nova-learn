import { useEffect, useRef } from 'react';
import { Text, View, Pressable, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useStyles } from '../styles/appStyles';
import { useTheme } from '../context/ThemeContext';
import { Starfield } from '../components/Starfield';

export function WelcomeScreen({ onNext }) {
  const styles = useStyles();
  const { colors, scheme } = useTheme();

  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1600, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 1600, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);
  const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.12] });

  const gradientColors = scheme === 'dark' ? [colors.bg, '#1A2340'] : [colors.bg, colors.surface];

  return (
    <LinearGradient colors={gradientColors} style={{ flex: 1 }}>
      {scheme === 'dark' && <Starfield />}
      <View style={styles.center}>
        <Animated.Text style={[styles.logo, { transform: [{ scale }] }]}>✨</Animated.Text>
        <Text style={styles.h1}>Supernova</Text>
        <Text style={styles.tagline}>Tiny lessons, big universe.</Text>
        <Pressable style={styles.primaryButton} onPress={onNext}>
          <Text style={styles.primaryButtonText}>Get Started</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}
