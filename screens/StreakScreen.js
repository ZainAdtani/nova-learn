import { Text, View, Pressable } from 'react-native';
import { useStyles } from '../styles/appStyles';

export function StreakScreen({ streak, isPremium, onUpgrade }) {
  const styles = useStyles();
  return (
    <View style={styles.center}>
      <View style={styles.flameCircle}>
        <Text style={{ fontSize: 56 }}>🔥</Text>
      </View>
      <Text style={styles.streakNumber}>{streak} days</Text>
      <Text style={styles.body}>Keep it going. One tiny lesson a day.</Text>
      {isPremium ? (
        <Text style={styles.body}>👑 Premium active</Text>
      ) : (
        <Pressable style={styles.secondaryButton} onPress={onUpgrade}>
          <Text style={styles.secondaryButtonText}>See Plans</Text>
        </Pressable>
      )}
    </View>
  );
}
