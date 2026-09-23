import { Text, View, Pressable, ActivityIndicator, Linking } from 'react-native';
import { useStyles } from '../styles/appStyles';
import { usePremium } from '../context/PremiumContext';

const PRIVACY_POLICY_URL = 'https://zainadtani.github.io/supernova-app/privacy-policy.html';

export function PaywallScreen({ onClose }) {
  const styles = useStyles();
  const {
    isPremium,
    isLoading,
    storeAvailable,
    product,
    purchasing,
    restoring,
    error,
    subscribe,
    restore,
    clearError,
  } = usePremium();

  const priceLabel = product?.localizedPrice
    ? `${product.localizedPrice} / month`
    : '$2.99 / month';

  const handleSubscribe = () => {
    clearError();
    subscribe();
  };

  const handleRestore = () => {
    clearError();
    restore();
  };

  const openPrivacyPolicy = () => {
    Linking.openURL(PRIVACY_POLICY_URL).catch(() => {});
  };

  return (
    <View style={styles.center}>
      <View style={styles.card}>
        <Text style={{ fontSize: 40 }}>👑</Text>
        <Text style={styles.h2}>Go Premium</Text>

        {isLoading ? (
          <>
            <ActivityIndicator size="large" />
            <Text style={styles.body}>Contacting the App Store…</Text>
          </>
        ) : isPremium ? (
          <>
            <Text style={styles.body}>You're Premium! Enjoy the full lesson library.</Text>
            <Pressable style={styles.primaryButton} onPress={onClose}>
              <Text style={styles.primaryButtonText}>Start learning</Text>
            </Pressable>
          </>
        ) : (
          <>
            <Text style={styles.body}>{priceLabel}</Text>
            <Text style={styles.bullet}>• Deeper lesson library</Text>
            <Text style={styles.bullet}>• Custom streak reminders</Text>
            <Text style={styles.bullet}>• No ads, ever</Text>

            {error ? (
              <Text style={[styles.body, { color: '#FF6B6B' }]}>{error}</Text>
            ) : null}

            {storeAvailable ? (
              <>
                <Pressable
                  style={[styles.primaryButton, purchasing && { opacity: 0.6 }]}
                  onPress={handleSubscribe}
                  disabled={purchasing}
                >
                  {purchasing ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.primaryButtonText}>
                      Subscribe for {priceLabel}
                    </Text>
                  )}
                </Pressable>
                <Pressable
                  style={styles.textButton}
                  onPress={handleRestore}
                  disabled={restoring}
                >
                  <Text style={styles.textButtonLabel}>
                    {restoring ? 'Restoring…' : 'Restore Purchases'}
                  </Text>
                </Pressable>
              </>
            ) : (
              <Text style={styles.body}>
                Subscriptions are available in the App Store version of this app.
              </Text>
            )}

            <Text style={[styles.body, { fontSize: 12, opacity: 0.7 }]}>
              Payment will be charged to your Apple ID account at confirmation of
              purchase. Your subscription automatically renews each month unless
              auto-renew is turned off at least 24 hours before the end of the
              current period. Manage or cancel anytime in iPhone Settings → Apple
              ID → Subscriptions.
            </Text>
            <Pressable style={styles.textButton} onPress={openPrivacyPolicy}>
              <Text style={styles.textButtonLabel}>Privacy Policy</Text>
            </Pressable>
            <Pressable style={styles.textButton} onPress={onClose}>
              <Text style={styles.textButtonLabel}>Maybe later</Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
}
