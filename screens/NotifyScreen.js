import { useState } from 'react';
import { Text, View, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useStyles } from '../styles/appStyles';
import { scheduleDailyReminder } from '../lib/notifications';

export function NotifyScreen({ onNext }) {
  const styles = useStyles();
  const [requesting, setRequesting] = useState(false);

  const handleEnable = async () => {
    setRequesting(true);
    const granted = await scheduleDailyReminder();
    setRequesting(false);
    if (!granted) {
      Alert.alert(
        "No reminders for now",
        "You can turn these on later in your iPhone's Settings app, under Notifications.",
      );
    }
    onNext();
  };

  return (
    <View style={styles.center}>
      <View style={styles.card}>
        <Text style={styles.bellEmoji}>🔔</Text>
        <Text style={styles.h2}>Want a daily reminder?</Text>
        <Text style={styles.body}>
          We'll nudge you once a day so you never miss your tiny lesson, or your streak.
        </Text>
        <Pressable style={styles.primaryButton} onPress={handleEnable} disabled={requesting}>
          {requesting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.primaryButtonText}>Yes, remind me</Text>
          )}
        </Pressable>
        <Pressable style={styles.textButton} onPress={onNext} disabled={requesting}>
          <Text style={styles.textButtonLabel}>Not now</Text>
        </Pressable>
      </View>
    </View>
  );
}
