import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppButton } from '@/components/AppButton';
import { AppInput } from '@/components/AppInput';
import { ScreenContainer } from '@/components/ScreenContainer';
import { useSendVerificationCodeMutation, useVerifyEmailMutation } from '@/hooks/useEmailVerification';
import { AppStackParamList } from '@/navigation/types';
import { useI18n } from '@/i18n';
import { useTheme } from '@/context/ThemeContext';
import { theme } from '@/constants/theme';
import { getApiErrorMessage } from '@/utils/error';

type Props = NativeStackScreenProps<AppStackParamList, 'VerifyEmail'>;

export function VerifyEmailScreen({ navigation }: Props) {
  const { t } = useI18n();
  const { colors, spacing } = useTheme();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const sendCodeMutation = useSendVerificationCodeMutation();
  const verifyMutation = useVerifyEmailMutation();

  const handleSendCode = async () => {
    setError(null);
    try {
      await sendCodeMutation.mutateAsync();
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  const handleVerify = async () => {
    if (code.length !== 6) {
      setError(t.emailVerification.codeLength);
      return;
    }
    setError(null);
    try {
      await verifyMutation.mutateAsync(code);
      setSuccess(true);
      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  return (
    <ScreenContainer scrollable>
      <View style={[styles.container, { padding: spacing.lg }]}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          {t.emailVerification.title}
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {t.emailVerification.subtitle}
        </Text>

        {success ? (
          <View style={[styles.successBox, { backgroundColor: colors.surface, borderRadius: theme.radius.lg, padding: spacing.lg, marginTop: spacing.lg }]}>
            <Text style={[styles.successText, { color: colors.success }]}>
              {t.emailVerification.success}
            </Text>
          </View>
        ) : (
          <>
            <View style={{ marginTop: spacing.lg, marginBottom: spacing.md }}>
              <AppInput
                label={t.emailVerification.codeLabel}
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
                maxLength={6}
                placeholder="000000"
                autoFocus
              />
            </View>

            {error ? (
              <Text style={[styles.error, { color: colors.danger, marginBottom: spacing.md }]}>
                {error}
              </Text>
            ) : null}

            <AppButton
              label={t.emailVerification.verify}
              onPress={handleVerify}
              loading={verifyMutation.isPending}
              disabled={code.length !== 6}
            />

            <View style={[styles.resendContainer, { marginTop: spacing.lg }]}>
              <Text style={[styles.resendText, { color: colors.textSecondary }]}>
                {t.emailVerification.noCode}
              </Text>
              <AppButton
                label={t.emailVerification.resend}
                onPress={handleSendCode}
                loading={sendCodeMutation.isPending}
                variant="secondary"
              />
            </View>
          </>
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: theme.text.title,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.text.body,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
  error: {
    fontSize: theme.text.body,
    textAlign: 'center',
  },
  successBox: {
    alignItems: 'center',
    marginTop: theme.spacing.lg,
  },
  successText: {
    fontSize: theme.text.body,
    fontWeight: '600',
  },
  resendContainer: {
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  resendText: {
    fontSize: theme.text.body,
  },
});
