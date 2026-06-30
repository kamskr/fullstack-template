import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import type { TimestampModel } from '@template/api-client';

import { Spacing } from '@/constants/theme';
import { ActionButton } from './action-button';
import { ThemedText } from './themed-text';

type TimestampFormProps = {
  submitLabel: string;
  timestamp?: TimestampModel;
  isPending?: boolean;
  onSubmit: (values: { note: string }) => void;
};

export function TimestampForm({
  submitLabel,
  timestamp,
  isPending,
  onSubmit,
}: TimestampFormProps) {
  const [note, setNote] = useState(timestamp?.note ?? '');

  return (
    <View style={styles.form}>
      <View style={styles.field}>
        <ThemedText type="smallBold">Note</ThemedText>
        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="Shipped something small."
          multiline
          style={[styles.input, styles.textArea]}
        />
      </View>
      <ActionButton
        label={isPending ? 'Saving…' : submitLabel}
        disabled={isPending}
        onPress={() => onSubmit({ note })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: Spacing.three },
  field: { gap: Spacing.two },
  input: {
    minHeight: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(50,143,151,0.28)',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    color: '#173a40',
    backgroundColor: 'rgba(255,255,255,0.86)',
  },
  textArea: { minHeight: 96, textAlignVertical: 'top' },
});
