import { Text, View, Pressable } from 'react-native';
import { useStyles } from '../styles/appStyles';
import { useTheme } from '../context/ThemeContext';

const APPEARANCE_OPTIONS = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

export function SettingsScreen() {
  const styles = useStyles();
  const { preference, setPreference } = useTheme();

  return (
    <View style={[styles.screen, { padding: 20 }]}>
      <Text style={[styles.h1Small, { marginBottom: 24 }]}>Settings</Text>

      <View style={styles.settingsSection}>
        <Text style={styles.settingsSectionLabel}>Your streak</Text>
        <View style={styles.settingsRow}>
          <Text style={styles.settingsRowLabel}>Saved on this phone</Text>
          <Text style={styles.settingsRowValue}>No account needed</Text>
        </View>
      </View>

      <View style={styles.settingsSection}>
        <Text style={styles.settingsSectionLabel}>Appearance</Text>
        <View style={styles.settingsOptionRow}>
          {APPEARANCE_OPTIONS.map((opt) => (
            <Pressable
              key={opt.value}
              style={[styles.settingsOption, preference === opt.value && styles.settingsOptionActive]}
              onPress={() => setPreference(opt.value)}
            >
              <Text
                style={[styles.settingsOptionText, preference === opt.value && styles.settingsOptionTextActive]}
              >
                {opt.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}
