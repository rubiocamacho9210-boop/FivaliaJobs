import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '@/components/ScreenContainer';
import { AppInput } from '@/components/AppInput';
import { AppButton } from '@/components/AppButton';
import { theme } from '@/constants/theme';
import { useLoginMutation } from '@/hooks/useAuthMutations';
import { getApiErrorMessage } from '@/utils/error';
import { isValidEmail } from '@/utils/validation';
import { AuthStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const loginMutation = useLoginMutation();

  const onSubmit = async () => {
    setFormError(null);
    if (!email.trim() || !password.trim()) {
      setFormError('Completa correo y contraseña.');
      return;
    }
    if (!isValidEmail(email)) {
      setFormError('Ingresa un correo valido.');
      return;
    }

    try {
      await loginMutation.mutateAsync({
        email: email.trim().toLowerCase(),
        password,
      });
    } catch (error) {
      setFormError(getApiErrorMessage(error));
    }
  };

  return (
    <ScreenContainer scrollable>
      <View style={styles.header}>
        <Text style={styles.title}>Bienvenido a FivaliaJobs</Text>
        <Text style={styles.subtitle}>Encuentra trabajo o talento rapido.</Text>
      </View>

      <AppInput
        label="Correo"
        value={email}
        onChangeText={setEmail}
        placeholder="tu@email.com"
        keyboardType="email-address"
        autoComplete="email"
      />
      <AppInput
        label="Contraseña"
        value={password}
        onChangeText={setPassword}
        placeholder="********"
        secureTextEntry
        autoComplete="password"
      />

      {formError ? <Text style={styles.error}>{formError}</Text> : null}

      <AppButton label="Entrar" onPress={onSubmit} loading={loginMutation.isPending} />

      <View style={styles.footer}>
        <Text style={styles.footerText}>No tienes cuenta?</Text>
        <AppButton
          label="Crear cuenta"
          variant="ghost"
          onPress={() => navigation.navigate('Register')}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: theme.spacing.xl,
    marginTop: theme.spacing.lg,
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: theme.text.heading,
    fontWeight: '700',
    marginBottom: 6,
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: theme.text.body,
  },
  error: {
    color: theme.colors.danger,
    marginBottom: theme.spacing.md,
  },
  footer: {
    marginTop: theme.spacing.lg,
    alignItems: 'center',
  },
  footerText: {
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
});
