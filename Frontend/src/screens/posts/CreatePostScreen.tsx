import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { AppButton } from '@/components/AppButton';
import { AppInput } from '@/components/AppInput';
import { ScreenContainer } from '@/components/ScreenContainer';
import { theme } from '@/constants/theme';
import { useCreatePostMutation } from '@/hooks/usePosts';
import { AppTabParamList } from '@/navigation/types';
import { PostType } from '@/types/post';
import { getApiErrorMessage } from '@/utils/error';
import { backendLimits, hasLengthBetween } from '@/utils/validation';

export function CreatePostScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<AppTabParamList>>();
  const createPostMutation = useCreatePostMutation();
  const [type, setType] = useState<PostType>('NEED');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    setError(null);
    if (!title.trim() || !description.trim() || !category.trim()) {
      setError('Completa tipo, titulo, descripcion y categoria.');
      return;
    }
    if (!hasLengthBetween(title, backendLimits.post.titleMin, backendLimits.post.titleMax)) {
      setError(
        `El titulo debe tener entre ${backendLimits.post.titleMin} y ${backendLimits.post.titleMax} caracteres.`,
      );
      return;
    }
    if (
      !hasLengthBetween(
        description,
        backendLimits.post.descriptionMin,
        backendLimits.post.descriptionMax,
      )
    ) {
      setError(
        `La descripcion debe tener entre ${backendLimits.post.descriptionMin} y ${backendLimits.post.descriptionMax} caracteres.`,
      );
      return;
    }
    if (category.trim().length > backendLimits.post.categoryMax) {
      setError(`La categoria permite maximo ${backendLimits.post.categoryMax} caracteres.`);
      return;
    }

    try {
      await createPostMutation.mutateAsync({
        type,
        title: title.trim(),
        description: description.trim(),
        category: category.trim(),
      });
      setTitle('');
      setDescription('');
      setCategory('');
      navigation.navigate('Feed');
    } catch (mutationError) {
      setError(getApiErrorMessage(mutationError));
    }
  };

  return (
    <ScreenContainer scrollable>
      <View style={styles.header}>
        <Text style={styles.title}>Crear publicacion</Text>
        <Text style={styles.subtitle}>Comparte una necesidad o un servicio.</Text>
      </View>

      <Text style={styles.label}>Tipo</Text>
      <View style={styles.typeRow}>
        <AppButton
          label="Necesito"
          onPress={() => setType('NEED')}
          variant={type === 'NEED' ? 'primary' : 'secondary'}
          style={styles.typeButton}
        />
        <AppButton
          label="Ofrezco"
          onPress={() => setType('OFFER')}
          variant={type === 'OFFER' ? 'primary' : 'secondary'}
          style={styles.typeButton}
        />
      </View>

      <AppInput label="Titulo" value={title} onChangeText={setTitle} placeholder="Ej. Necesito logo" />
      <AppInput
        label="Descripcion"
        value={description}
        onChangeText={setDescription}
        placeholder="Describe lo que necesitas u ofreces"
        multiline
        style={styles.multiline}
      />
      <AppInput label="Categoria" value={category} onChangeText={setCategory} placeholder="Ej. Diseno" />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <AppButton label="Publicar" onPress={onSubmit} loading={createPostMutation.isPending} />
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
  label: {
    color: theme.colors.textSecondary,
    fontSize: theme.text.caption,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
  },
  typeRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  typeButton: {
    flex: 1,
  },
  multiline: {
    minHeight: 120,
    textAlignVertical: 'top',
    paddingTop: theme.spacing.sm,
  },
  error: {
    color: theme.colors.danger,
    marginBottom: theme.spacing.md,
  },
});
