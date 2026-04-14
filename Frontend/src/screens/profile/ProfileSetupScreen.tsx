import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppButton } from '@/components/AppButton';
import { AppInput } from '@/components/AppInput';
import { LoadingState } from '@/components/LoadingState';
import { PhotoUpload } from '@/components/PhotoUpload';
import { ScreenContainer } from '@/components/ScreenContainer';
import { useMyProfileQuery, useUpdateProfileMutation } from '@/hooks/useProfile';
import { AppStackParamList } from '@/navigation/types';
import { getApiErrorMessage } from '@/utils/error';
import { backendLimits } from '@/utils/validation';
import { useI18n } from '@/i18n';
import { useTheme } from '@/context/ThemeContext';

type Props = NativeStackScreenProps<AppStackParamList, 'ProfileSetup'>;

export function ProfileSetupScreen({ route, navigation }: Props) {
  const mode = route.params.mode;
  const profileQuery = useMyProfileQuery();
  const updateMutation = useUpdateProfileMutation();
  const { t } = useI18n();
  const { colors, spacing } = useTheme();

  const [bio, setBio] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [contact, setContact] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!profileQuery.data) return;
    setBio(profileQuery.data.bio ?? '');
    setCategory(profileQuery.data.category ?? '');
    setLocation(profileQuery.data.location ?? '');
    setContact(profileQuery.data.contact ?? '');
    setPhotoUrl(profileQuery.data.photoUrl ?? null);
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
        photoUrl: photoUrl ?? undefined,
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
      <View style={[styles.header, { marginBottom: spacing.lg }]}>
        <Text style={[styles.title, { color: colors.textPrimary, fontSize: 24, fontWeight: '700' }]}>
          {mode === 'create' ? t.profile.setupProfile : t.profile.editProfile}
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary, marginTop: 4 }]}>
          {t.profile.setupDescription}
        </Text>
      </View>

      <PhotoUpload value={photoUrl} onChange={setPhotoUrl} />

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

      {error ? <Text style={[styles.error, { color: colors.danger, marginBottom: spacing.md }]}>{error}</Text> : null}

      <AppButton
        label={mode === 'create' ? t.profile.saveProfile : t.profile.updateProfile}
        onPress={onSubmit}
        loading={updateMutation.isPending}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {},
  title: {},
  subtitle: {},
  multiline: {
    minHeight: 110,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  error: {},
});
