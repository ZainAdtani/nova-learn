import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

// One-stop hook: get the current theme's styles, ready to use, recomputed
// only when the theme actually changes.
export function useStyles() {
  const { colors } = useTheme();
  return useMemo(() => getStyles(colors), [colors]);
}

// Takes the active color set (light or dark) and builds the stylesheet from
// it. Called fresh whenever the theme changes, so colors always stay in sync.
export function getStyles(colors) {
  return StyleSheet.create({
    app: { flex: 1, backgroundColor: colors.bg },
    screenArea: { flex: 1 },
    screen: { flex: 1, backgroundColor: colors.bg },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },

    logo: { fontSize: 48, marginBottom: 12 },
    h1: { fontSize: 40, fontWeight: 'bold', color: colors.text },
    h1Small: { fontSize: 22, fontWeight: 'bold', color: colors.text },
    h2: { fontSize: 20, fontWeight: 'bold', color: colors.text, marginTop: 12, marginBottom: 12 },
    tagline: { fontSize: 16, color: colors.pale, marginTop: 8, marginBottom: 40 },
    body: { fontSize: 14, color: colors.muted, textAlign: 'center', marginTop: 4, marginBottom: 16, lineHeight: 20 },
    bullet: { fontSize: 14, color: colors.text, alignSelf: 'flex-start', marginBottom: 6 },

    primaryButton: {
      backgroundColor: colors.blue,
      paddingVertical: 16,
      paddingHorizontal: 40,
      borderRadius: 16,
      width: '100%',
      alignItems: 'center',
      marginTop: 8,
    },
    primaryButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },

    secondaryButton: {
      borderColor: colors.fire,
      borderWidth: 2,
      paddingVertical: 14,
      paddingHorizontal: 36,
      borderRadius: 16,
    },
    secondaryButtonText: { color: colors.fire, fontWeight: 'bold', fontSize: 15 },

    textButton: { marginTop: 12, paddingVertical: 8 },
    textButtonLabel: { color: colors.muted, fontSize: 14 },

    card: {
      backgroundColor: colors.surface,
      borderRadius: 24,
      padding: 24,
      alignItems: 'center',
      width: '100%',
    },
    bellEmoji: { fontSize: 32, marginBottom: 8 },
    modalBackdrop: { flex: 1, backgroundColor: 'rgba(10,15,26,0.85)', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },

    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    streakPill: { backgroundColor: 'rgba(217,119,6,0.15)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
    streakPillText: { color: colors.fire, fontWeight: 'bold' },

    lessonCard: { backgroundColor: colors.surface, borderRadius: 20, padding: 16, marginBottom: 24 },
    lessonImage: { height: 100, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(68,123,190,0.15)', borderRadius: 14, marginBottom: 12 },
    lessonLabel: { color: colors.blue, fontSize: 12, fontWeight: 'bold' },
    lessonTitle: { color: colors.text, fontSize: 16, fontWeight: 'bold', marginTop: 4 },

    sectionLabel: { color: colors.muted, fontSize: 12, fontWeight: 'bold', marginBottom: 10, textTransform: 'uppercase' },
    upcomingCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.surface, borderRadius: 16, padding: 14 },
    upcomingCardStacked: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.surface, borderRadius: 16, padding: 14, marginBottom: 10 },
    upcomingDay: { color: colors.muted, fontSize: 11, fontWeight: 'bold', width: 44 },
    upcomingText: { color: colors.text, fontSize: 14, flexShrink: 1 },

    backLink: { color: colors.muted, marginBottom: 12 },
    optionButton: { backgroundColor: colors.surface, borderRadius: 14, padding: 16, marginBottom: 10 },
    optionText: { color: colors.text, fontSize: 15 },
    optionCorrect: { backgroundColor: 'rgba(76,175,80,0.25)', borderColor: '#4CAF50', borderWidth: 1 },
    optionWrong: { backgroundColor: 'rgba(244,67,54,0.2)', borderColor: '#F44336', borderWidth: 1 },
    explanationBox: { backgroundColor: 'rgba(233,228,166,0.15)', borderRadius: 14, padding: 14, marginTop: 4, marginBottom: 12 },
    explanationText: { color: colors.text, fontSize: 13, lineHeight: 19 },

    flameCircle: { width: 140, height: 140, borderRadius: 70, borderWidth: 4, borderColor: 'rgba(217,119,6,0.3)', backgroundColor: 'rgba(217,119,6,0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
    streakNumber: { fontSize: 34, fontWeight: 'bold', color: colors.text, marginBottom: 4 },

    nav: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 12, paddingBottom: 24, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: 'rgba(128,128,128,0.15)' },
    navButton: { alignItems: 'center' },
    navEmoji: { fontSize: 20, opacity: 0.5 },
    navLabel: { fontSize: 11, color: colors.muted, marginTop: 2 },
    navLabelActive: { color: colors.text, fontWeight: 'bold' },

    settingsSection: { marginBottom: 28 },
    settingsSectionLabel: { color: colors.muted, fontSize: 12, fontWeight: 'bold', marginBottom: 10, textTransform: 'uppercase' },
    settingsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.surface,
      borderRadius: 14,
      padding: 16,
      marginBottom: 10,
    },
    settingsRowLabel: { color: colors.text, fontSize: 15 },
    settingsRowValue: { color: colors.muted, fontSize: 14 },
    settingsOptionRow: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: 14, padding: 4 },
    settingsOption: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
    settingsOptionActive: { backgroundColor: colors.blue },
    settingsOptionText: { color: colors.muted, fontSize: 13, fontWeight: 'bold' },
    settingsOptionTextActive: { color: '#FFFFFF' },
    dangerButton: { paddingVertical: 14, alignItems: 'center' },
    dangerButtonText: { color: colors.sunset, fontWeight: 'bold', fontSize: 14 },
  });
}
