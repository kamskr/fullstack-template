import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { authClient } from '@/lib/auth-client';

export default function HomeScreen() {
  const session = authClient.useSession();
  const isSignedIn = Boolean(session.data);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.hero}>
          <ThemedText type="smallBold" style={styles.kicker}>
            Template Mobile
          </ThemedText>
          <ThemedText type="title" style={styles.title}>
            Authenticated CRUD, native-ready.
          </ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.copy}>
            Better Auth stores mobile cookies with SecureStore. TanStack Query
            owns timestamp data. Generated OpenAPI clients hit the same Nest API
            as web.
          </ThemedText>
        </View>

        {session.isPending ? (
          <ThemedText themeColor="textSecondary">Checking session…</ThemedText>
        ) : (
          <View style={styles.actions}>
            <Pressable
              style={styles.primaryButton}
              onPress={() => router.push(isSignedIn ? '/timestamps' : '/login')}>
              <ThemedText type="smallBold" style={styles.primaryButtonText}>
                {isSignedIn ? 'Open timestamps' : 'Login'}
              </ThemedText>
            </Pressable>
            <Pressable
              style={styles.secondaryButton}
              onPress={() => router.push('/create-account')}>
              <ThemedText type="smallBold">Create account</ThemedText>
            </Pressable>
          </View>
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    padding: Spacing.four,
    gap: Spacing.five,
  },
  hero: { gap: Spacing.three },
  kicker: { letterSpacing: 2, textTransform: 'uppercase' },
  title: { fontSize: 44, lineHeight: 48 },
  copy: { fontSize: 16, lineHeight: 24 },
  actions: { gap: Spacing.three },
  primaryButton: {
    borderRadius: 18,
    padding: Spacing.four,
    alignItems: 'center',
    backgroundColor: '#328f97',
  },
  primaryButtonText: { color: 'white' },
  secondaryButton: {
    borderRadius: 18,
    padding: Spacing.four,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(50,143,151,0.32)',
  },
});
