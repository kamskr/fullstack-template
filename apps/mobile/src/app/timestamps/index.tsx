import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActionButton } from '@/components/action-button';
import { AuthGate } from '@/components/auth-gate';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TimestampForm } from '@/components/timestamp-form';
import { Spacing } from '@/constants/theme';
import { authClient } from '@/lib/auth-client';
import { getErrorMessage } from '@/lib/errors';
import {
  createTimestamp,
  deleteTimestamp,
  listTimestamps,
  timestampKeys,
} from '@/lib/timestamps';

export default function TimestampsScreen() {
  const queryClient = useQueryClient();
  const timestampsQuery = useQuery({ queryKey: timestampKeys.all, queryFn: listTimestamps });
  const createMutation = useMutation({
    mutationFn: createTimestamp,
    onSuccess: async () => queryClient.invalidateQueries({ queryKey: timestampKeys.all }),
  });
  const deleteMutation = useMutation({
    mutationFn: deleteTimestamp,
    onSuccess: async () => queryClient.invalidateQueries({ queryKey: timestampKeys.all }),
  });

  return (
    <AuthGate>
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <FlatList
            ListHeaderComponent={
              <View style={styles.header}>
                <View style={styles.headingRow}>
                  <View style={styles.headingText}>
                    <ThemedText type="smallBold" style={styles.kicker}>
                      Timestamps
                    </ThemedText>
                    <ThemedText type="title">Timeline</ThemedText>
                  </View>
                  <ActionButton label="Sign out" variant="secondary" onPress={() => void authClient.signOut()} />
                </View>

                <View style={styles.card}>
                  <ThemedText type="subtitle">Create</ThemedText>
                  <TimestampForm
                    submitLabel="Create timestamp"
                    isPending={createMutation.isPending}
                    onSubmit={(values) =>
                      createMutation.mutate({
                        ...values,
                        dateOccurredAt: new Date().toISOString(),
                      })
                    }
                  />
                  {createMutation.error ? (
                    <ThemedText style={styles.error}>
                      {getErrorMessage(createMutation.error)}
                    </ThemedText>
                  ) : null}
                </View>

                {timestampsQuery.isLoading ? (
                  <ThemedText themeColor="textSecondary">Loading timestamps…</ThemedText>
                ) : null}
                {timestampsQuery.error ? (
                  <ThemedText style={styles.error}>
                    {getErrorMessage(timestampsQuery.error)}
                  </ThemedText>
                ) : null}
                {timestampsQuery.data?.length === 0 ? (
                  <ThemedText themeColor="textSecondary">No timestamps yet.</ThemedText>
                ) : null}
              </View>
            }
            data={timestampsQuery.data ?? []}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <Pressable
                style={styles.item}
                onPress={() => router.push(`/timestamps/${item.id}`)}>
                <View style={styles.itemCopy}>
                  <ThemedText type="smallBold">{item.note}</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {new Intl.DateTimeFormat(undefined, {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    }).format(new Date(item.dateOccurredAt))}
                  </ThemedText>
                </View>
                <ActionButton
                  label="Delete"
                  variant="danger"
                  disabled={deleteMutation.isPending}
                  onPress={() => deleteMutation.mutate(item.id)}
                />
              </Pressable>
            )}
          />
        </SafeAreaView>
      </ThemedView>
    </AuthGate>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  listContent: { padding: Spacing.four, gap: Spacing.three },
  header: { gap: Spacing.four },
  headingRow: { flexDirection: 'row', gap: Spacing.three, alignItems: 'center' },
  headingText: { flex: 1 },
  kicker: { letterSpacing: 2, textTransform: 'uppercase' },
  card: {
    gap: Spacing.three,
    borderRadius: 24,
    padding: Spacing.four,
    borderWidth: 1,
    borderColor: 'rgba(50,143,151,0.22)',
  },
  item: {
    flexDirection: 'row',
    gap: Spacing.three,
    alignItems: 'center',
    borderRadius: 18,
    padding: Spacing.three,
    borderWidth: 1,
    borderColor: 'rgba(50,143,151,0.18)',
  },
  itemCopy: { flex: 1, gap: Spacing.one },
  error: { color: '#9f3030' },
});
