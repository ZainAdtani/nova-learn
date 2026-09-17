import { Text, View, Pressable } from 'react-native';
import { useStyles } from '../styles/appStyles';

export function NotifyScreen({ onNext }) {
  const styles = useStyles();
  return (
    <View style={styles.center}>
      <View style={styles.card}>
        <Text style={styles.bellEmoji}>🔔</Text>
        <Text style={styles.h2}>Want a daily reminder?</Text>
        <Text style={styles.body}>
          We'll nudge you once a day so you never miss your tiny lesson, or your streak.
        </Text>
        <Pressable style={styles.primaryButton} onPress={onNext}>
          <Text style={styles.primaryButtonText}>Yes, remind me</Text>
        </Pressable>
        <Pressable style={styles.textButton} onPress={onNext}>
          <Text style={styles.textButtonLabel}>Not now</Text>
        </Pressable>
      </View>
    </View>
  );
}
