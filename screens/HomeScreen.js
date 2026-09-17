import { useRef, useEffect } from 'react';
import { Text, View, Pressable, ScrollView, Animated, Easing } from 'react-native';
import { useStyles } from '../styles/appStyles';

export function HomeScreen({ onQuiz, streak }) {
  const styles = useStyles();
  // Simple animated fact card: the emoji spins slowly instead of using a real video.
  const spin = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 9000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);
  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ padding: 20 }}>
      <View style={styles.headerRow}>
        <Text style={styles.h1Small}>Supernova</Text>
        <View style={styles.streakPill}>
          <Text style={styles.streakPillText}>🔥 {streak}</Text>
        </View>
      </View>

      <Pressable style={styles.lessonCard} onPress={onQuiz}>
        <View style={styles.lessonImage}>
          <Animated.Text style={{ fontSize: 40, transform: [{ rotate }] }}>🪐</Animated.Text>
        </View>
        <Text style={styles.lessonLabel}>Today's fact card</Text>
        <Text style={styles.lessonTitle}>Why Saturn's rings are slowly disappearing</Text>
      </Pressable>

      <Text style={styles.sectionLabel}>Coming up</Text>
      <View style={styles.upcomingCard}>
        <Text style={{ fontSize: 28 }}>🧬</Text>
        <Text style={styles.upcomingText}>How evolution builds new species</Text>
      </View>
    </ScrollView>
  );
}
