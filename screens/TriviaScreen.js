import { useState } from 'react';
import { Text, View, Pressable } from 'react-native';
import { useStyles } from '../styles/appStyles';

const QUESTION = {
  prompt: "What are Saturn's rings mostly made of?",
  options: ['Ice and rock', 'Solid metal', 'Liquid gas', 'Sand'],
  correct: 0,
  explanation: "Saturn's rings are countless chunks of ice and rock, some as small as sand, some as big as a house.",
};

export function TriviaScreen({ onDone, onBack }) {
  const styles = useStyles();
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
          <>
            <View style={styles.explanationBox}>
              <Text style={styles.explanationText}>💡 {QUESTION.explanation}</Text>
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
