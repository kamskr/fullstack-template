import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Spacing } from '@/constants/theme';
import { authClient } from '@/lib/auth-client';
import { ActionButton } from './action-button';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

export function AuthGate({ children }: { children: React.ReactNode }) {
  const session = authClient.useSession();

  if (session.isPending) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <ThemedText type="subtitle">Checking session…</ThemedText>
        </SafeAreaView>
      </ThemedView>
    );
  }

  if (!session.data) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.card}>
            <ThemedText type="smallBold" style={styles.kicker}>
              Private demo
            </ThemedText>
            <ThemedText type="subtitle">Sign in to use timestamps.</ThemedText>
            <ThemedText themeColor="textSecondary">
              Auth is handled by Better Auth; API data is loaded with the
              generated client plus TanStack Query.
            </ThemedText>
            <ActionButton label="Login" onPress={() => router.push('/login')} />
            <ActionButton
              label="Create account"
              variant="secondary"
              onPress={() => router.push('/create-account')}
            />
          </View>
        </SafeAreaView>
      </ThemedView>
    );
  }

  return children;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    padding: Spacing.four,
  },
  card: { gap: Spacing.three },
  kicker: { letterSpacing: 2, textTransform: 'uppercase' },
});
