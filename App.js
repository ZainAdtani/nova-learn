import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStyles } from './styles/appStyles';
import { supabase } from './lib/supabase';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { PremiumProvider, usePremium } from './context/PremiumContext';
import { useStreak } from './hooks/useStreak';
import { NavButton } from './components/NavButton';
import { SaveStreakPrompt } from './components/SaveStreakPrompt';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { NotifyScreen } from './screens/NotifyScreen';
import { HomeScreen } from './screens/HomeScreen';
import { TriviaScreen } from './screens/TriviaScreen';
import { StreakScreen } from './screens/StreakScreen';
import { LibraryScreen } from './screens/LibraryScreen';
import { PaywallScreen } from './screens/PaywallScreen';
import { SettingsScreen } from './screens/SettingsScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <PremiumProvider>
            <AppContent />
          </PremiumProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

function AppContent() {
  const styles = useStyles();
  const { scheme } = useTheme();
  const insets = useSafeAreaInsets();
  const [screen, setScreen] = useState('welcome');
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const { streak, completeQuiz, claimGuestStreak } = useStreak();
  const { isPremium } = usePremium();
  const isOnboarding = screen === 'welcome' || screen === 'notify';

  const handleQuizDone = async () => {
    const isFirstGuestQuiz = await completeQuiz();
    setScreen('streak');
    if (isFirstGuestQuiz) setShowSavePrompt(true);
  };

  const handleSignedIn = async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) await claimGuestStreak(data.session.user.id);
    setShowSavePrompt(false);
  };

  return (
    <View style={styles.app}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <View style={[styles.screenArea, { paddingTop: insets.top }]}>
        {screen === 'welcome' && <WelcomeScreen onNext={() => setScreen('notify')} />}
        {screen === 'notify' && <NotifyScreen onNext={() => setScreen('home')} />}
        {screen === 'home' && (
          <HomeScreen
            onQuiz={() => setScreen('trivia')}
            streak={streak}
            isPremium={isPremium}
            onUpgrade={() => setScreen('paywall')}
            onLibrary={() => setScreen('library')}
          />
        )}
        {screen === 'trivia' && (
          <TriviaScreen onDone={handleQuizDone} onBack={() => setScreen('home')} />
        )}
        {screen === 'streak' && (
          <StreakScreen
            streak={streak}
            isPremium={isPremium}
            onUpgrade={() => setScreen('paywall')}
          />
        )}
        {screen === 'library' && (
          <LibraryScreen
            onBack={() => setScreen('home')}
            onUpgrade={() => setScreen('paywall')}
          />
        )}
        {screen === 'paywall' && <PaywallScreen onClose={() => setScreen('home')} />}
        {screen === 'settings' && <SettingsScreen onRequestSignIn={() => setShowSavePrompt(true)} />}
      </View>

      {!isOnboarding && (
        <View style={[styles.nav, { paddingBottom: Math.max(insets.bottom, 12) + 12 }]}>
          <NavButton label="Home" emoji="🏠" active={screen === 'home'} onPress={() => setScreen('home')} />
          <NavButton label="Quiz" emoji="⚡" active={screen === 'trivia'} onPress={() => setScreen('trivia')} />
          <NavButton label="Streak" emoji="🔥" active={screen === 'streak'} onPress={() => setScreen('streak')} />
          <NavButton label="Plus" emoji="👑" active={screen === 'paywall'} onPress={() => setScreen('paywall')} />
          <NavButton label="Settings" emoji="⚙️" active={screen === 'settings'} onPress={() => setScreen('settings')} />
        </View>
      )}

      <SaveStreakPrompt
        visible={showSavePrompt}
        onDismiss={() => setShowSavePrompt(false)}
        onSignedIn={handleSignedIn}
      />
    </View>
  );
}
