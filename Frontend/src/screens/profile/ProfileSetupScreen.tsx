import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppButton } from '@/components/AppButton';
import { AppInput } from '@/components/AppInput';
import { LoadingState } from '@/components/LoadingState';
import { ScreenContainer } from '@/components/ScreenContainer';
import { theme } from '@/constants/theme';
import { useMyProfileQuery, useUpdateProfileMutation } from '@/hooks/useProfile';
import { AppStackParamList } from '@/navigation/types';
import { getApiErrorMessage } from '@/utils/error';
import { backendLimits } from '@/utils/validation';
import { useI18n } from '@/i18n';

type Props = NativeStackScreenProps<AppStackParamList, 'ProfileSetup'>;

export function ProfileSetupScreen({ route, navigation }: Props) {
  const mode = route.params.mode;
  const profileQuery = useMyProfileQuery();
  const updateMutation = useUpdateProfileMutation();
  const { t } = useI18n();

  const [bio, setBio] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [contact, setContact] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!profileQuery.data) return;
    setBio(profileQuery.data.bio ?? '');
    setCategory(profileQuery.data.category ?? '');
    setLocation(profileQuery.data.location ?? '');
    setContact(profileQuery.data.contact ?? '');
  }, [profileQuery.data]);

  const onSubmit = async () => {
    setError(null);
    if (bio.trim().length > backendLimits.profile.bioMax) {
      setError(t.profile.bioTooLong.replace('{{max}}', String(backendLimits.profile.bioMax)));
      return;
    }
    if (category.trim().length > backendLimits.profile.categoryMax) {
      setError(t.profile.categoryTooLong.replace('{{max}}', String(backendLimits.profile.categoryMax)));
      return;
    }
    if (location.trim().length > backendLimits.profile.locationMax) {
      setError(t.profile.locationTooLong.replace('{{max}}', String(backendLimits.profile.locationMax)));
      return;
    }
    if (contact.trim().length > backendLimits.profile.contactMax) {
      setError(t.profile.contactTooLong.replace('{{max}}', String(backendLimits.profile.contactMax)));
      return;
    }

    try {
      await updateMutation.mutateAsync({
        bio: bio.trim() || undefined,
        category: category.trim() || undefined,
        location: location.trim() || undefined,
        contact: contact.trim() || undefined,
      });
      if (mode === 'create') {
        navigation.replace('MainTabs', { screen: 'Feed' });
        return;
      }
      navigation.goBack();
    } catch (updateError) {
      setError(getApiErrorMessage(updateError));
    }
  };

  if (mode === 'edit' && profileQuery.isLoading) {
    return (
      <ScreenContainer>
        <LoadingState />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable>
      <View style={styles.header}>
        <Text style={styles.title}>
          {mode === 'create' ? t.profile.setupProfile : t.profile.editProfile}
        </Text>
        <Text style={styles.subtitle}>{t.profile.setupDescription}</Text>
      </View>

      <AppInput
        label={t.profile.bio}
        value={bio}
        onChangeText={setBio}
        placeholder={t.profile.bioPlaceholder}
        multiline
        style={styles.multiline}
      />
      <AppInput
        label={t.profile.category}
        value={category}
        onChangeText={setCategory}
        placeholder={t.profile.categoryPlaceholder}
      />
      <AppInput
        label={t.profile.location}
        value={location}
        onChangeText={setLocation}
        placeholder={t.profile.locationPlaceholder}
      />
      <AppInput
        label={t.profile.contact}
        value={contact}
        onChangeText={setContact}
        placeholder={t.profile.contactPlaceholder}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <AppButton
        label={mode === 'create' ? t.profile.saveProfile : t.profile.updateProfile}
        onPress={onSubmit}
        loading={updateMutation.isPending}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: theme.spacing.lg,
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: theme.text.heading,
    fontWeight: '700',
  },
  subtitle: {
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  multiline: {
    minHeight: 110,
    textAlignVertical: 'top',
    paddingTop: theme.spacing.sm,
  },
  error: {
    color: theme.colors.danger,
    marginBottom: theme.spacing.md,
  },
});
