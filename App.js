import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';

// ---- Supernova brand colors, from docs/DESIGN.md ----
const COLORS = {
  bg: '#0A0F1A',
  surface: '#141B2E',
  blue: '#447BBE',
  fire: '#D97706',
  sunset: '#DD5013',
  pale: '#E9E4A6',
  white: '#FFFFFF',
  muted: '#8A93A6',
};

export default function App() {
  const [screen, setScreen] = useState('welcome');
  const isOnboarding = screen === 'welcome' || screen === 'notify';

  return (
    <View style={styles.app}>
      <StatusBar style="light" />
      <View style={styles.screenArea}>
        {screen === 'welcome' && <WelcomeScreen onNext={() => setScreen('notify')} />}
        {screen === 'notify' && <NotifyScreen onNext={() => setScreen('home')} />}
        {screen === 'home' && <HomeScreen onQuiz={() => setScreen('trivia')} streak={7} />}
        {screen === 'trivia' && (
          <TriviaScreen onDone={() => setScreen('streak')} onBack={() => setScreen('home')} />
        )}
        {screen === 'streak' && <StreakScreen streak={7} onUpgrade={() => setScreen('paywall')} />}
        {screen === 'paywall' && <PaywallScreen onClose={() => setScreen('home')} />}
      </View>

      {!isOnboarding && (
        <View style={styles.nav}>
          <NavButton label="Home" emoji="🏠" active={screen === 'home'} onPress={() => setScreen('home')} />
          <NavButton label="Quiz" emoji="⚡" active={screen === 'trivia'} onPress={() => setScreen('trivia')} />
          <NavButton label="Streak" emoji="🔥" active={screen === 'streak'} onPress={() => setScreen('streak')} />
          <NavButton label="Plus" emoji="👑" active={screen === 'paywall'} onPress={() => setScreen('paywall')} />
        </View>
      )}
    </View>
  );
}

function NavButton({ label, emoji, active, onPress }) {
  return (
    <Pressable style={styles.navButton} onPress={onPress}>
      <Text style={[styles.navEmoji, active && { opacity: 1 }]}>{emoji}</Text>
      <Text style={[styles.navLabel, active && styles.navLabelActive]}>{label}</Text>
    </Pressable>
  );
}

// ---------- Screens ----------

function WelcomeScreen({ onNext }) {
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

function NotifyScreen({ onNext }) {
  return (
    <View style={styles.center}>
      <View style={styles.card}>
        <Text style={styles.bellEmoji}>🔔</Text>
        <Text style={styles.h2}>Want a daily reminder?</Text>
        <Text style={styles.body}>
          We'll nudge you once a day so you never miss your tiny lesson, or your streak.
        </Text>
        <Pressable style={styles.primaryButton} onPress={onNext}>
          <Text style={styles.primaryButtonText}>Yes, remind me</Text>
        </Pressable>
        <Pressable style={styles.textButton} onPress={onNext}>
          <Text style={styles.textButtonLabel}>Not now</Text>
        </Pressable>
      </View>
    </View>
  );
}

function HomeScreen({ onQuiz, streak }) {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ padding: 20 }}>
      <View style={styles.headerRow}>
        <Text style={styles.h1Small}>Supernova</Text>
        <View style={styles.streakPill}>
          <Text style={styles.streakPillText}>🔥 {streak}</Text>
        </View>
      </View>

      <Pressable style={styles.lessonCard} onPress={onQuiz}>
        <View style={styles.lessonImage}>
          <Text style={{ fontSize: 40 }}>🪐</Text>
        </View>
        <Text style={styles.lessonLabel}>Today's lesson</Text>
        <Text style={styles.lessonTitle}>Why Saturn's rings are slowly disappearing</Text>
      </Pressable>

      <Text style={styles.sectionLabel}>Coming up</Text>
      <View style={styles.upcomingCard}>
        <Text style={{ fontSize: 28 }}>🧬</Text>
        <Text style={styles.upcomingText}>How evolution builds new species</Text>
      </View>
    </ScrollView>
  );
}

const QUESTION = {
  prompt: "What are Saturn's rings mostly made of?",
  options: ['Ice and rock', 'Solid metal', 'Liquid gas', 'Sand'],
  correct: 0,
};

function TriviaScreen({ onDone, onBack }) {
  const [selected, setSelected] = useState(null);

  return (
    <View style={styles.screen}>
      <View style={{ padding: 20 }}>
        <Pressable onPress={onBack}>
          <Text style={styles.backLink}>← Back</Text>
        </Pressable>
        <Text style={styles.h2}>{QUESTION.prompt}</Text>

        {QUESTION.options.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrect = i === QUESTION.correct;
          const showState = selected !== null;
          return (
            <Pressable
              key={opt}
              style={[
                styles.optionButton,
                showState && isCorrect && styles.optionCorrect,
                showState && isSelected && !isCorrect && styles.optionWrong,
              ]}
              onPress={() => setSelected(i)}
            >
              <Text style={styles.optionText}>{opt}</Text>
            </Pressable>
          );
        })}

        {selected !== null && (
          <Pressable style={styles.primaryButton} onPress={onDone}>
            <Text style={styles.primaryButtonText}>Continue</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

function StreakScreen({ streak, onUpgrade }) {
  return (
    <View style={styles.center}>
      <View style={styles.flameCircle}>
        <Text style={{ fontSize: 56 }}>🔥</Text>
      </View>
      <Text style={styles.streakNumber}>{streak} days</Text>
      <Text style={styles.body}>Keep it going. One tiny lesson a day.</Text>
      <Pressable style={styles.secondaryButton} onPress={onUpgrade}>
        <Text style={styles.secondaryButtonText}>See Plans</Text>
      </Pressable>
    </View>
  );
}

function PaywallScreen({ onClose }) {
  return (
    <View style={styles.center}>
      <View style={styles.card}>
        <Text style={{ fontSize: 40 }}>👑</Text>
        <Text style={styles.h2}>Go Premium</Text>
        <Text style={styles.body}>Coming soon:</Text>
        <Text style={styles.bullet}>• Deeper lesson library</Text>
        <Text style={styles.bullet}>• Custom streak reminders</Text>
        <Text style={styles.bullet}>• No ads, ever</Text>
        <Pressable style={styles.textButton} onPress={onClose}>
          <Text style={styles.textButtonLabel}>Maybe later</Text>
        </Pressable>
      </View>
    </View>
  );
}

// ---------- Styles ----------

const styles = StyleSheet.create({
  app: { flex: 1, backgroundColor: COLORS.bg },
  screenArea: { flex: 1 },
  screen: { flex: 1, backgroundColor: COLORS.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },

  logo: { fontSize: 48, marginBottom: 12 },
  h1: { fontSize: 40, fontWeight: 'bold', color: COLORS.white },
  h1Small: { fontSize: 22, fontWeight: 'bold', color: COLORS.white },
  h2: { fontSize: 20, fontWeight: 'bold', color: COLORS.white, marginTop: 12, marginBottom: 12 },
  tagline: { fontSize: 16, color: COLORS.pale, marginTop: 8, marginBottom: 40 },
  body: { fontSize: 14, color: COLORS.muted, textAlign: 'center', marginTop: 4, marginBottom: 16, lineHeight: 20 },
  bullet: { fontSize: 14, color: COLORS.white, alignSelf: 'flex-start', marginBottom: 6 },

  primaryButton: {
    backgroundColor: COLORS.blue,
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
  },
  primaryButtonText: { color: COLORS.white, fontWeight: 'bold', fontSize: 16 },

  secondaryButton: {
    borderColor: COLORS.fire,
    borderWidth: 2,
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 16,
  },
  secondaryButtonText: { color: COLORS.fire, fontWeight: 'bold', fontSize: 15 },

  textButton: { marginTop: 12, paddingVertical: 8 },
  textButtonLabel: { color: COLORS.muted, fontSize: 14 },

  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    width: '100%',
  },
  bellEmoji: { fontSize: 32, marginBottom: 8 },

  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  streakPill: { backgroundColor: 'rgba(217,119,6,0.15)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  streakPillText: { color: COLORS.fire, fontWeight: 'bold' },

  lessonCard: { backgroundColor: COLORS.surface, borderRadius: 20, padding: 16, marginBottom: 24 },
  lessonImage: { height: 100, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(68,123,190,0.15)', borderRadius: 14, marginBottom: 12 },
  lessonLabel: { color: COLORS.blue, fontSize: 12, fontWeight: 'bold' },
  lessonTitle: { color: COLORS.white, fontSize: 16, fontWeight: 'bold', marginTop: 4 },

  sectionLabel: { color: COLORS.muted, fontSize: 12, fontWeight: 'bold', marginBottom: 10, textTransform: 'uppercase' },
  upcomingCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: COLORS.surface, borderRadius: 16, padding: 14 },
  upcomingText: { color: COLORS.white, fontSize: 14, flexShrink: 1 },

  backLink: { color: COLORS.muted, marginBottom: 12 },
  optionButton: { backgroundColor: COLORS.surface, borderRadius: 14, padding: 16, marginBottom: 10 },
  optionText: { color: COLORS.white, fontSize: 15 },
  optionCorrect: { backgroundColor: 'rgba(76,175,80,0.25)', borderColor: '#4CAF50', borderWidth: 1 },
  optionWrong: { backgroundColor: 'rgba(244,67,54,0.2)', borderColor: '#F44336', borderWidth: 1 },

  flameCircle: { width: 140, height: 140, borderRadius: 70, borderWidth: 4, borderColor: 'rgba(217,119,6,0.3)', backgroundColor: 'rgba(217,119,6,0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  streakNumber: { fontSize: 34, fontWeight: 'bold', color: COLORS.white, marginBottom: 4 },

  nav: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 12, paddingBottom: 24, backgroundColor: COLORS.surface, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  navButton: { alignItems: 'center' },
  navEmoji: { fontSize: 20, opacity: 0.5 },
  navLabel: { fontSize: 11, color: COLORS.muted, marginTop: 2 },
  navLabelActive: { color: COLORS.white, fontWeight: 'bold' },
});
