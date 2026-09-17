import { useState } from 'react';
import { Text, View, Pressable, Modal, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useStyles } from '../styles/appStyles';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../lib/supabase';

// Shown once, right after a guest finishes their very first quiz.
// Signing in never leaves the app: type an email, get a 6-digit code,
// type the code back in, done.
export function SaveStreakPrompt({ visible, onDismiss, onSignedIn }) {
  const styles = useStyles();
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState('email'); // email | code
  const [busy, setBusy] = useState(false);

  const reset = () => {
    setEmail('');
    setCode('');
    setStep('email');
    setBusy(false);
  };

  const handleDismiss = () => {
    reset();
    onDismiss();
  };

  const handleSendCode = async () => {
    const trimmed = email.trim();
    if (!trimmed.includes('@')) {
      Alert.alert('Enter a valid email', 'Please type a real email address first.');
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.signInWithOtp({ email: trimmed });
    setBusy(false);
    if (error) {
      Alert.alert('Could not send code', error.message);
      return;
    }
    setStep('code');
  };

  const handleVerifyCode = async () => {
    if (code.trim().length < 6) {
      Alert.alert('Enter the code', 'Type the 6-digit code from your email.');
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: code.trim(),
      type: 'email',
    });
    setBusy(false);
    if (error) {
      Alert.alert("That code didn't work", error.message);
      return;
    }
    reset();
    onSignedIn();
  };

  const inputStyle = {
    width: '100%',
    backgroundColor: colors.bg,
    color: colors.text,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 4,
    marginBottom: 12,
    textAlign: 'center',
    fontSize: 16,
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleDismiss}>
      <View style={styles.modalBackdrop}>
        <View style={styles.card}>
          <Text style={{ fontSize: 40 }}>🔥</Text>
          <Text style={styles.h2}>Save your streak</Text>

          {step === 'email' ? (
            <>
              <Text style={styles.body}>Enter your email. We'll send a 6-digit code, no password.</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="you@email.com"
                placeholderTextColor={colors.muted}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                style={inputStyle}
              />
              <Pressable style={styles.primaryButton} onPress={handleSendCode} disabled={busy}>
                {busy ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.primaryButtonText}>Send me a code</Text>}
              </Pressable>
            </>
          ) : (
            <>
              <Text style={styles.body}>Enter the 6-digit code we sent to {email.trim()}.</Text>
              <TextInput
                value={code}
                onChangeText={setCode}
                placeholder="123456"
                placeholderTextColor={colors.muted}
                keyboardType="number-pad"
                maxLength={6}
                style={inputStyle}
              />
              <Pressable style={styles.primaryButton} onPress={handleVerifyCode} disabled={busy}>
                {busy ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.primaryButtonText}>Verify & sign in</Text>}
              </Pressable>
              <Pressable style={styles.textButton} onPress={() => setStep('email')} disabled={busy}>
                <Text style={styles.textButtonLabel}>Use a different email</Text>
              </Pressable>
            </>
          )}

          <Pressable style={styles.textButton} onPress={handleDismiss} disabled={busy}>
            <Text style={styles.textButtonLabel}>Continue as Guest</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
