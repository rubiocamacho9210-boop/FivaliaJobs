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

type Props = NativeStackScreenProps<AppStackParamList, 'ProfileSetup'>;

export function ProfileSetupScreen({ route, navigation }: Props) {
  const mode = route.params.mode;
  const profileQuery = useMyProfileQuery();
  const updateMutation = useUpdateProfileMutation();

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
    try {
      await updateMutation.mutateAsync({
        bio: bio.trim() || undefined,
        category: category.trim() || undefined,
        location: location.trim() || undefined,
        contact: contact.trim() || undefined,
      });
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
        <Text style={styles.title}>{mode === 'create' ? 'Configura tu perfil' : 'Editar perfil'}</Text>
        <Text style={styles.subtitle}>Completa los datos esenciales para mejorar tu visibilidad.</Text>
      </View>

      <AppInput
        label="Bio"
        value={bio}
        onChangeText={setBio}
        placeholder="Cuéntanos sobre ti"
        multiline
        style={styles.multiline}
      />
      <AppInput
        label="Categoria"
        value={category}
        onChangeText={setCategory}
        placeholder="Ej. Programacion, Marketing"
      />
      <AppInput label="Ubicacion" value={location} onChangeText={setLocation} placeholder="Ciudad o remoto" />
      <AppInput label="Contacto" value={contact} onChangeText={setContact} placeholder="Correo o telefono" />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <AppButton
        label={mode === 'create' ? 'Guardar perfil' : 'Actualizar perfil'}
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
