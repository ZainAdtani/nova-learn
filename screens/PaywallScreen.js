import { Text, View, Pressable, Alert } from 'react-native';
import { useStyles } from '../styles/appStyles';

export function PaywallScreen({ onClose }) {
  const styles = useStyles();

  const handleSubscribe = () => {
    Alert.alert(
      'Coming soon',
      'Real subscriptions turn on once this app is fully set up with Apple. For now this is just a preview of how it will look.'
    );
  };

  return (
    <View style={styles.center}>
      <View style={styles.card}>
        <Text style={{ fontSize: 40 }}>👑</Text>
        <Text style={styles.h2}>Go Premium</Text>
        <Text style={styles.body}>$2.99 / month</Text>
        <Text style={styles.bullet}>• Deeper lesson library</Text>
        <Text style={styles.bullet}>• Custom streak reminders</Text>
        <Text style={styles.bullet}>• No ads, ever</Text>
        <Pressable style={styles.primaryButton} onPress={handleSubscribe}>
          <Text style={styles.primaryButtonText}>Subscribe for $2.99/mo</Text>
        </Pressable>
        <Pressable style={styles.textButton} onPress={onClose}>
          <Text style={styles.textButtonLabel}>Maybe later</Text>
        </Pressable>
      </View>
    </View>
  );
}
