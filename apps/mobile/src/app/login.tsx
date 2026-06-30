import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActionButton } from '@/components/action-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { authClient } from '@/lib/auth-client';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function loginEmail() {
    setIsPending(true);
    setError(null);
    const result = await authClient.signIn.email({ email, password });
    setIsPending(false);
    if (result.error) {
      setError(result.error.message ?? 'Could not login.');
      return;
    }
    router.replace('/timestamps');
  }

  async function loginAnonymous() {
    setIsPending(true);
    setError(null);
    const result = await authClient.signIn.anonymous();
    setIsPending(false);
    if (result.error) {
      setError(result.error.message ?? 'Could not start anonymous session.');
      return;
    }
    router.replace('/timestamps');
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="smallBold" style={styles.kicker}>
          Welcome back
        </ThemedText>
        <ThemedText type="title">Login</ThemedText>
        <ThemedText themeColor="textSecondary">
          Use email/password or start as an anonymous user.
        </ThemedText>
        {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}
        <View style={styles.form}>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="email@example.com"
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
          />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="password"
            secureTextEntry
            style={styles.input}
          />
          <ActionButton label={isPending ? 'Signing in…' : 'Login'} disabled={isPending} onPress={loginEmail} />
          <ActionButton
            label="Continue anonymously"
            variant="secondary"
            disabled={isPending}
            onPress={loginAnonymous}
          />
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

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, justifyContent: 'center', padding: Spacing.four, gap: Spacing.three },
  kicker: { letterSpacing: 2, textTransform: 'uppercase' },
  form: { gap: Spacing.three },
  input: {
    minHeight: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(50,143,151,0.28)',
    paddingHorizontal: Spacing.three,
    color: '#173a40',
    backgroundColor: 'rgba(255,255,255,0.86)',
  },
  error: { color: '#9f3030' },
});
