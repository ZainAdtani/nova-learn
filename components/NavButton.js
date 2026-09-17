import { Text, Pressable } from 'react-native';
import { useStyles } from '../styles/appStyles';

export function NavButton({ label, emoji, active, onPress }) {
  const styles = useStyles();
  return (
    <Pressable style={styles.navButton} onPress={onPress}>
      <Text style={[styles.navEmoji, active && { opacity: 1 }]}>{emoji}</Text>
      <Text style={[styles.navLabel, active && styles.navLabelActive]}>{label}</Text>
    </Pressable>
  );
}
