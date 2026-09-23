import { useState } from 'react';
import { Text, View, Pressable, Alert, ActivityIndicator } from 'react-native';
import { useStyles } from '../styles/appStyles';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const APPEARANCE_OPTIONS = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

export function SettingsScreen({ onRequestSignIn }) {
  const styles = useStyles();
  const { preference, setPreference } = useTheme();
  const { session } = useAuth();
  const [deleting, setDeleting] = useState(false);

  const handleSignOut = () => {
    Alert.alert('Sign out?', 'You can always sign back in with the same email.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => supabase.auth.signOut() },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete your account?',
      "This permanently deletes your account and your streak. There's no undoing this.",
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Account',
          style: 'destructive',
          onPress: async () => {
            setDeleting(true);
            const { error } = await supabase.functions.invoke('delete-account');
            setDeleting(false);
            if (error) {
              Alert.alert(
                "Couldn't delete your account",
                'Something went wrong. Please try again, or email zkadtani@gmail.com for help.'
              );
              return;
            }
            await supabase.auth.signOut();
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.screen, { padding: 20 }]}>
      <Text style={[styles.h1Small, { marginBottom: 24 }]}>Settings</Text>

      <View style={styles.settingsSection}>
        <Text style={styles.settingsSectionLabel}>Account</Text>
        {session ? (
          <>
            <View style={styles.settingsRow}>
              <Text style={styles.settingsRowLabel}>Signed in</Text>
              <Text style={styles.settingsRowValue}>{session.user.email}</Text>
            </View>
            <Pressable style={styles.dangerButton} onPress={handleSignOut}>
              <Text style={styles.dangerButtonText}>Sign Out</Text>
            </Pressable>
            <Pressable
              style={[styles.dangerButton, { marginTop: 8, opacity: deleting ? 0.6 : 1 }]}
              onPress={handleDeleteAccount}
              disabled={deleting}
            >
              {deleting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.dangerButtonText}>Delete Account</Text>
              )}
            </Pressable>
          </>
        ) : (
          <>
            <View style={styles.settingsRow}>
              <Text style={styles.settingsRowLabel}>You're a guest</Text>
              <Text style={styles.settingsRowValue}>Not signed in</Text>
            </View>
            <Pressable style={styles.primaryButton} onPress={onRequestSignIn}>
              <Text style={styles.primaryButtonText}>Save your streak</Text>
            </Pressable>
          </>
        )}
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
