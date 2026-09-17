import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable } from 'react-native';

// Supernova brand colors
const COLORS = {
  bg: '#0A0F1A',      // Dark Nova
  blue: '#447BBE',     // Spidey Blue
  fire: '#D97706',     // Claude Orange (streaks)
  pale: '#E9E4A6',     // Fresh Hay
  white: '#FFFFFF',
};

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.logo}>✨</Text>
      <Text style={styles.title}>Supernova</Text>
      <Text style={styles.tagline}>Tiny lessons, big universe.</Text>

      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>Get Started</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  logo: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  tagline: {
    fontSize: 16,
    color: COLORS.pale,
    marginTop: 8,
    marginBottom: 48,
  },
  button: {
    backgroundColor: COLORS.blue,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 16,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
