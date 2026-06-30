import { Pressable, StyleSheet } from 'react-native';

import { Spacing } from '@/constants/theme';
import { ThemedText } from './themed-text';

type ActionButtonProps = {
  label: string;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  onPress: () => void;
};

export function ActionButton({
  label,
  variant = 'primary',
  disabled,
  onPress,
}: ActionButtonProps) {
  return (
    <Pressable
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        styles[variant],
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
      onPress={onPress}>
      <ThemedText type="smallBold" style={variant === 'primary' && styles.primaryText}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 18,
    padding: Spacing.four,
    alignItems: 'center',
    borderWidth: 1,
  },
  primary: {
    backgroundColor: '#328f97',
    borderColor: '#328f97',
  },
  secondary: {
    backgroundColor: 'transparent',
    borderColor: 'rgba(50,143,151,0.32)',
  },
  danger: {
    backgroundColor: 'rgba(196,71,71,0.12)',
    borderColor: 'rgba(196,71,71,0.32)',
  },
  primaryText: { color: 'white' },
  disabled: { opacity: 0.55 },
  pressed: { opacity: 0.74, transform: [{ scale: 0.99 }] },
});
