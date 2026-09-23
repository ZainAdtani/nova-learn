import { Text, View, Pressable, FlatList } from 'react-native';
import { useStyles } from '../styles/appStyles';
import { LESSONS } from '../constants/lessons';
import { usePremium } from '../context/PremiumContext';

// Premium-only: browse every lesson in the library, not just today's.
export function LibraryScreen({ onBack, onUpgrade }) {
  const styles = useStyles();
  const { isPremium } = usePremium();

  if (!isPremium) {
    return (
      <View style={styles.center}>
        <View style={styles.card}>
          <Text style={{ fontSize: 40 }}>🔒</Text>
          <Text style={styles.h2}>Lesson library</Text>
          <Text style={styles.body}>
            The full library of {LESSONS.length} lessons is a Premium perk.
          </Text>
          <Pressable style={styles.primaryButton} onPress={onUpgrade}>
            <Text style={styles.primaryButtonText}>See Plans</Text>
          </Pressable>
          <Pressable style={styles.textButton} onPress={onBack}>
            <Text style={styles.textButtonLabel}>Back</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={{ padding: 20 }}>
        <Pressable onPress={onBack}>
          <Text style={styles.backLink}>← Back</Text>
        </Pressable>
        <Text style={styles.h2}>Lesson library</Text>
        <Text style={styles.body}>
          {LESSONS.length} tiny lessons. Pick one to revisit.
        </Text>
      </View>
      <FlatList
        data={LESSONS}
        keyExtractor={(_, i) => String(i)}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        renderItem={({ item }) => (
          <View style={[styles.card, { marginBottom: 12 }]}>
            <Text style={{ fontSize: 28 }}>{item.emoji}</Text>
            <Text style={styles.lessonTitle}>{item.teaser}</Text>
            <Text style={styles.body}>{item.explanation}</Text>
          </View>
        )}
      />
    </View>
  );
}
