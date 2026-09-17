import { useState } from 'react';
import { Text, View, Pressable } from 'react-native';
import { useStyles } from '../styles/appStyles';
import { getTodayLesson } from '../lib/lessons';

export function TriviaScreen({ onDone, onBack }) {
  const styles = useStyles();
  const [selected, setSelected] = useState(null);
  const lesson = getTodayLesson();

  return (
    <View style={styles.screen}>
      <View style={{ padding: 20 }}>
        <Pressable onPress={onBack}>
          <Text style={styles.backLink}>← Back</Text>
        </Pressable>
        <Text style={styles.h2}>{lesson.prompt}</Text>

        {lesson.options.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrect = i === lesson.correct;
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
          <>
            <View style={styles.explanationBox}>
              <Text style={styles.explanationText}>💡 {lesson.explanation}</Text>
            </View>
            <Pressable style={styles.primaryButton} onPress={onDone}>
              <Text style={styles.primaryButtonText}>Continue</Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
}
