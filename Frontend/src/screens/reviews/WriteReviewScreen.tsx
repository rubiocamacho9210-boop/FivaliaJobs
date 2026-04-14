import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppButton } from '@/components/AppButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { theme } from '@/constants/theme';
import { useCreateReviewMutation } from '@/hooks/useReviews';
import { AppStackParamList } from '@/navigation/types';
import { getApiErrorMessage } from '@/utils/error';
import { useI18n } from '@/i18n';
import { useTheme } from '@/context/ThemeContext';
import { Pressable } from 'react-native';

type Props = NativeStackScreenProps<AppStackParamList, 'WriteReview'>;

export function WriteReviewScreen({ route, navigation }: Props) {
  const { postId, toUserId, toUserName, toUserRole } = route.params;
  const { t } = useI18n();
  const { colors, spacing, radius, text } = useTheme();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string | null>(null);
  const createReviewMutation = useCreateReviewMutation();

  const reviewType = toUserRole === 'WORKER' ? 'WORKER_REVIEW' : 'CLIENT_REVIEW';

  const onSubmit = async () => {
    if (rating === 0) {
      setError(t.reviews.ratingRequired);
      return;
    }
    setError(null);
    try {
      await createReviewMutation.mutateAsync({
        postId,
        toUserId,
        rating,
        comment: comment.trim() || undefined,
        type: reviewType,
      });
      Alert.alert(t.reviews.reviewSubmitted, '', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  return (
    <ScreenContainer scrollable>
      <Text style={[styles.title, { color: colors.textPrimary }]}>
        {t.reviews.writeReview}
      </Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary, marginBottom: spacing.lg }]}>
        {toUserName}
      </Text>

      <Text style={[styles.label, { color: colors.textPrimary, marginBottom: spacing.sm }]}>
        {t.profile.rating}
      </Text>
      <View style={[styles.stars, { marginBottom: spacing.lg }]}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Pressable key={star} onPress={() => setRating(star)} style={styles.star}>
            <Text style={[styles.starText, { color: star <= rating ? '#F59E0B' : colors.border }]}>
              ★
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={[styles.label, { color: colors.textPrimary, marginBottom: spacing.sm }]}>
        {t.reviews.yourReview}
      </Text>
      <TextInput
        value={comment}
        onChangeText={setComment}
        placeholder={t.reviews.commentPlaceholder}
        placeholderTextColor={colors.textSecondary}
        multiline
        numberOfLines={4}
        style={[
          styles.input,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: radius.md,
            color: colors.textPrimary,
            fontSize: text.body,
            padding: spacing.md,
            marginBottom: spacing.md,
          },
        ]}
      />

      {error ? (
        <Text style={[styles.error, { color: colors.danger, marginBottom: spacing.md }]}>
          {error}
        </Text>
      ) : null}

      <AppButton
        label={t.reviews.submitReview}
        onPress={onSubmit}
        loading={createReviewMutation.isPending}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: theme.text.title,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  stars: {
    flexDirection: 'row',
    gap: 8,
  },
  star: {
    padding: 4,
  },
  starText: {
    fontSize: 36,
  },
  input: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  error: {
    fontSize: 14,
  },
});
