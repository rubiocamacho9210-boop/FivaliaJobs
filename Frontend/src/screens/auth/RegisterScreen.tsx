import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '@/components/ScreenContainer';
import { AppInput } from '@/components/AppInput';
import { AppButton } from '@/components/AppButton';
import { theme } from '@/constants/theme';
import { useLoginMutation, useRegisterMutation } from '@/hooks/useAuthMutations';
import { useAuthStore } from '@/store/authStore';
import { getApiErrorMessage } from '@/utils/error';
import { backendLimits, isValidEmail } from '@/utils/validation';
import { AuthStackParamList } from '@/navigation/types';
import { UserRole } from '@/types/auth';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export function RegisterScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('WORKER');
  const [formError, setFormError] = useState<string | null>(null);
  const setNeedsProfileSetup = useAuthStore((state) => state.setNeedsProfileSetup);

  const registerMutation = useRegisterMutation();
  const loginMutation = useLoginMutation();

  const submitLabel = useMemo(
    () => (role === 'WORKER' ? 'Crear cuenta como trabajador' : 'Crear cuenta como cliente'),
    [role],
  );

  const onSubmit = async () => {
    setFormError(null);
    if (!name.trim() || !email.trim() || !password.trim()) {
      setFormError('Completa todos los campos.');
      return;
    }
    if (!isValidEmail(email)) {
      setFormError('Ingresa un correo valido.');
      return;
    }
    if (name.trim().length > backendLimits.register.nameMax) {
      setFormError(`El nombre debe tener maximo ${backendLimits.register.nameMax} caracteres.`);
      return;
    }

    if (
      password.length < backendLimits.register.passwordMin ||
      password.length > backendLimits.register.passwordMax
    ) {
      setFormError(
        `La contrasena debe tener entre ${backendLimits.register.passwordMin} y ${backendLimits.register.passwordMax} caracteres.`,
      );
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    try {
      await registerMutation.mutateAsync({
        name: name.trim(),
        email: normalizedEmail,
        password,
        role,
      });
      await loginMutation.mutateAsync({
        email: normalizedEmail,
        password,
      });
      setNeedsProfileSetup(true);
    } catch (error) {
      setFormError(getApiErrorMessage(error));
    }
  };

  return (
    <ScreenContainer scrollable>
      <View style={styles.header}>
        <Text style={styles.title}>Crear cuenta</Text>
        <Text style={styles.subtitle}>Empieza a publicar o encontrar oportunidades.</Text>
      </View>

      <AppInput
        label="Nombre"
        value={name}
        onChangeText={setName}
        placeholder="Tu nombre"
        autoCapitalize="words"
      />
      <AppInput
        label="Correo"
        value={email}
        onChangeText={setEmail}
        placeholder="tu@email.com"
        keyboardType="email-address"
        autoComplete="email"
      />
      <AppInput
        label="Contrasena"
        value={password}
        onChangeText={setPassword}
        placeholder="Minimo 8 caracteres"
        secureTextEntry
        autoComplete="password-new"
      />

      <Text style={styles.roleLabel}>Tipo de cuenta</Text>
      <View style={styles.roleActions}>
        <AppButton
          label="Trabajador"
          variant={role === 'WORKER' ? 'primary' : 'secondary'}
          onPress={() => setRole('WORKER')}
          style={styles.roleButton}
        />
        <AppButton
          label="Cliente"
          variant={role === 'CLIENT' ? 'primary' : 'secondary'}
          onPress={() => setRole('CLIENT')}
          style={styles.roleButton}
        />
      </View>

      {formError ? <Text style={styles.error}>{formError}</Text> : null}

      <AppButton
        label={submitLabel}
        onPress={onSubmit}
        loading={registerMutation.isPending || loginMutation.isPending}
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>Ya tienes cuenta?</Text>
        <AppButton label="Ir a login" variant="ghost" onPress={() => navigation.goBack()} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: theme.spacing.lg,
    marginTop: theme.spacing.md,
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
  roleLabel: {
    color: theme.colors.textSecondary,
    fontSize: theme.text.caption,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
  },
  roleActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  roleButton: {
    flex: 1,
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
