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
import { useI18n } from '@/i18n';

export function CreatePostScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<AppTabParamList>>();
  const createPostMutation = useCreatePostMutation();
  const { t } = useI18n();
  const [type, setType] = useState<PostType>('NEED');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    setError(null);
    if (!title.trim() || !description.trim() || !category.trim()) {
      setError(t.posts.completeFields);
      return;
    }
    if (!hasLengthBetween(title, backendLimits.post.titleMin, backendLimits.post.titleMax)) {
      setError(
        t.posts.titleLength
          .replace('{{min}}', String(backendLimits.post.titleMin))
          .replace('{{max}}', String(backendLimits.post.titleMax)),
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
        t.posts.descriptionLength
          .replace('{{min}}', String(backendLimits.post.descriptionMin))
          .replace('{{max}}', String(backendLimits.post.descriptionMax)),
      );
      return;
    }
    if (category.trim().length > backendLimits.post.categoryMax) {
      setError(t.posts.categoryMax.replace('{{max}}', String(backendLimits.post.categoryMax)));
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
        <Text style={styles.title}>{t.posts.createPost}</Text>
        <Text style={styles.subtitle}>{t.posts.createPostSubtitle}</Text>
      </View>

      <Text style={styles.label}>{t.posts.type}</Text>
      <View style={styles.typeRow}>
        <AppButton
          label={t.posts.need}
          onPress={() => setType('NEED')}
          variant={type === 'NEED' ? 'primary' : 'secondary'}
          style={styles.typeButton}
        />
        <AppButton
          label={t.posts.offer}
          onPress={() => setType('OFFER')}
          variant={type === 'OFFER' ? 'primary' : 'secondary'}
          style={styles.typeButton}
        />
      </View>

      <AppInput
        label={t.posts.title}
        value={title}
        onChangeText={setTitle}
        placeholder={t.posts.titlePlaceholder}
      />
      <AppInput
        label={t.posts.description}
        value={description}
        onChangeText={setDescription}
        placeholder={t.posts.descriptionPlaceholder}
        multiline
        style={styles.multiline}
      />
      <AppInput
        label={t.profile.category}
        value={category}
        onChangeText={setCategory}
        placeholder={t.profile.categoryPlaceholder}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <AppButton label={t.posts.publish} onPress={onSubmit} loading={createPostMutation.isPending} />
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
