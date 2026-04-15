import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '@/components/ScreenContainer';
import { AppInput } from '@/components/AppInput';
import { AppDatePicker } from '@/components/AppDatePicker';
import { AppButton } from '@/components/AppButton';
import { theme } from '@/constants/theme';
import { useLoginMutation, useRegisterMutation } from '@/hooks/useAuthMutations';
import { useAuthStore } from '@/store/authStore';
import { getApiErrorMessage } from '@/utils/error';
import { backendLimits, isValidEmail } from '@/utils/validation';
import { AuthStackParamList } from '@/navigation/types';
import { UserRole } from '@/types/auth';
import { en } from '@/i18n/en';

const t = en;

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export function RegisterScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [role, setRole] = useState<UserRole>('WORKER');
  const [formError, setFormError] = useState<string | null>(null);
  const setNeedsProfileSetup = useAuthStore((state) => state.setNeedsProfileSetup);
  const registerMutation = useRegisterMutation();
  const loginMutation = useLoginMutation();

  const submitLabel = useMemo(
    () => (role === 'WORKER' ? t.register.workerAccount : t.register.clientAccount),
    [role, t],
  );

  const isAdult = (date: Date): boolean => {
    const today = new Date();
    const age = today.getFullYear() - date.getFullYear();
    const monthDiff = today.getMonth() - date.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
      return age - 1 >= 18;
    }
    return age >= 18;
  };

  const onSubmit = async () => {
    setFormError(null);
    if (!name.trim() || !email.trim() || !password.trim()) {
      setFormError(t.common.completeAllFields);
      return;
    }
    if (!birthDate) {
      setFormError(t.register.selectBirthDate);
      return;
    }
    if (!isAdult(birthDate)) {
      setFormError(t.register.mustBeAdult);
      return;
    }
    if (!isValidEmail(email)) {
      setFormError(t.common.invalidEmail);
      return;
    }
    if (name.trim().length > backendLimits.register.nameMax) {
      setFormError(t.common.nameTooLong.replace('{{max}}', String(backendLimits.register.nameMax)));
      return;
    }

    if (
      password.length < backendLimits.register.passwordMin ||
      password.length > backendLimits.register.passwordMax
    ) {
      setFormError(
        t.common.passwordLength
          .replace('{{min}}', String(backendLimits.register.passwordMin))
          .replace('{{max}}', String(backendLimits.register.passwordMax)),
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
        birthDate: birthDate.toISOString(),
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
        <Text style={styles.title}>{t.register.title}</Text>
        <Text style={styles.subtitle}>{t.register.subtitle}</Text>
      </View>

      <AppInput
        label={t.common.name}
        value={name}
        onChangeText={setName}
        placeholder={t.register.namePlaceholder}
        autoCapitalize="words"
      />
      <AppInput
        label={t.common.email}
        value={email}
        onChangeText={setEmail}
        placeholder={t.auth.emailPlaceholder}
        keyboardType="email-address"
        autoComplete="email"
      />
      <AppInput
        label={t.common.password}
        value={password}
        onChangeText={setPassword}
        placeholder={t.auth.minChars}
        secureTextEntry
        autoComplete="password-new"
      />
      <AppDatePicker
        label={t.register.birthDate}
        value={birthDate}
        onChange={setBirthDate}
        maximumDate={new Date()}
      />

      <Text style={styles.roleLabel}>{t.register.accountType}</Text>
      <View style={styles.roleActions}>
        <AppButton
          label={t.register.worker}
          variant={role === 'WORKER' ? 'primary' : 'secondary'}
          onPress={() => setRole('WORKER')}
          style={styles.roleButton}
        />
        <AppButton
          label={t.register.client}
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
        <Text style={styles.footerText}>{t.register.alreadyHaveAccount}</Text>
        <AppButton label={t.auth.goToLogin} variant="ghost" onPress={() => navigation.goBack()} />
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
