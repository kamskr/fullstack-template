import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActionButton } from '@/components/action-button';
import { AuthGate } from '@/components/auth-gate';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TimestampForm } from '@/components/timestamp-form';
import { Spacing } from '@/constants/theme';
import { getErrorMessage } from '@/lib/errors';
import {
  deleteTimestamp,
  getTimestamp,
  timestampKeys,
  updateTimestamp,
} from '@/lib/timestamps';

export default function TimestampDetailScreen() {
  const { timestampId } = useLocalSearchParams<{ timestampId: string }>();
  const queryClient = useQueryClient();
  const timestampQuery = useQuery({
    queryKey: timestampKeys.detail(timestampId),
    queryFn: () => getTimestamp(timestampId),
    enabled: Boolean(timestampId),
  });
  const updateMutation = useMutation({
    mutationFn: (values: { note: string; dateOccurredAt: string }) =>
      updateTimestamp(timestampId, values),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: timestampKeys.all }),
        queryClient.invalidateQueries({ queryKey: timestampKeys.detail(timestampId) }),
      ]);
    },
  });
  const deleteMutation = useMutation({
    mutationFn: () => deleteTimestamp(timestampId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: timestampKeys.all });
      router.replace('/timestamps');
    },
  });

  return (
    <AuthGate>
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.content}>
            <ActionButton label="Back to list" variant="secondary" onPress={() => router.back()} />
            {timestampQuery.isLoading ? (
              <ThemedText themeColor="textSecondary">Loading timestamp…</ThemedText>
            ) : null}
            {timestampQuery.error ? (
              <ThemedText style={styles.error}>{getErrorMessage(timestampQuery.error)}</ThemedText>
            ) : null}
            {timestampQuery.data ? (
              <View style={styles.card}>
                <ThemedText type="smallBold" style={styles.kicker}>
                  Detail
                </ThemedText>
                <ThemedText type="title">Timestamp</ThemedText>
                <View style={styles.preview}>
                  <ThemedText type="subtitle">{timestampQuery.data.note}</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {new Intl.DateTimeFormat(undefined, {
                      dateStyle: 'full',
                      timeStyle: 'short',
                    }).format(new Date(timestampQuery.data.dateOccurredAt))}
                  </ThemedText>
                  <ThemedText type="code">{timestampQuery.data.id}</ThemedText>
                </View>
                <TimestampForm
                  timestamp={timestampQuery.data}
                  submitLabel="Save changes"
                  isPending={updateMutation.isPending}
                  onSubmit={(values) => updateMutation.mutate(values)}
                />
                {updateMutation.error ? (
                  <ThemedText style={styles.error}>
                    {getErrorMessage(updateMutation.error)}
                  </ThemedText>
                ) : null}
                <ActionButton
                  label={deleteMutation.isPending ? 'Deleting…' : 'Delete'}
                  variant="danger"
                  disabled={deleteMutation.isPending}
                  onPress={() => deleteMutation.mutate()}
                />
              </View>
            ) : null}
          </ScrollView>
        </SafeAreaView>
      </ThemedView>
    </AuthGate>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  content: { padding: Spacing.four, gap: Spacing.four },
  card: { gap: Spacing.three },
  kicker: { letterSpacing: 2, textTransform: 'uppercase' },
  preview: {
    gap: Spacing.two,
    borderRadius: 18,
    padding: Spacing.three,
    borderWidth: 1,
    borderColor: 'rgba(50,143,151,0.22)',
  },
  error: { color: '#9f3030' },
});
