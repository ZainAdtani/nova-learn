import { Text, View, Pressable } from 'react-native';
import { useStyles } from '../styles/appStyles';

export function WelcomeScreen({ onNext }) {
  const styles = useStyles();
  return (
    <View style={styles.center}>
      <Text style={styles.logo}>✨</Text>
      <Text style={styles.h1}>Supernova</Text>
      <Text style={styles.tagline}>Tiny lessons, big universe.</Text>
      <Pressable style={styles.primaryButton} onPress={onNext}>
        <Text style={styles.primaryButtonText}>Get Started</Text>
      </Pressable>
    </View>
  );
}
