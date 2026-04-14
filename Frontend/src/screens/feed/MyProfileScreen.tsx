import React, { useState } from 'react';
import { Alert, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppButton } from '@/components/AppButton';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { LoadingState } from '@/components/LoadingState';
import { PostCard } from '@/components/PostCard';
import { ProfileHeader } from '@/components/ProfileHeader';
import { ScreenContainer } from '@/components/ScreenContainer';
import { usePostsByUserQuery } from '@/hooks/usePosts';
import { isProfileNotFoundError, useMyProfileQuery } from '@/hooks/useProfile';
import { AppStackParamList } from '@/navigation/types';
import { useAuthStore } from '@/store/authStore';
import { useI18n, Language } from '@/i18n';
import { theme } from '@/constants/theme';

export function MyProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const user = useAuthStore((state) => state.user);
  const profileQuery = useMyProfileQuery();
  const postsQuery = usePostsByUserQuery(user?.id ?? '');
  const clearSession = useAuthStore((state) => state.clearSession);
  const { t, language, setLanguage } = useI18n();
  const [showLangPicker, setShowLangPicker] = useState(false);

  const onPressLogout = () => {
    Alert.alert(t.profile.logoutTitle, t.profile.logoutConfirm, [
      { text: t.common.cancel, style: 'cancel' },
      { text: t.profile.logout, style: 'destructive', onPress: clearSession },
    ]);
  };

  if (profileQuery.isLoading) {
    return (
      <ScreenContainer>
        <LoadingState />
      </ScreenContainer>
    );
  }

  const hasNoProfile = profileQuery.isError && isProfileNotFoundError(profileQuery.error);

  return (
    <ScreenContainer>
      <FlatList
        data={postsQuery.data ?? []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={profileQuery.isFetching || postsQuery.isFetching}
            onRefresh={() => {
              profileQuery.refetch();
              postsQuery.refetch();
            }}
          />
        }
        ListHeaderComponent={
          <>
            <Text style={styles.title}>{t.profile.myProfile}</Text>
            {profileQuery.data ? <ProfileHeader profile={profileQuery.data} /> : null}

            {hasNoProfile ? (
              <View style={styles.block}>
                <EmptyState
                  title={t.profile.setupProfile}
                  description={t.profile.setupDescription}
                />
                <View style={styles.blockAction}>
                  <AppButton
                    label={t.profile.setupProfile}
                    onPress={() => navigation.navigate('ProfileSetup', { mode: 'create' })}
                  />
                </View>
              </View>
            ) : null}

            {profileQuery.isError && !hasNoProfile ? (
              <ErrorState message={t.errors.couldNotLoadProfile} onRetry={profileQuery.refetch} />
            ) : null}

            {profileQuery.data ? (
              <>
                <View style={styles.settingsSection}>
                  <Text style={styles.settingsTitle}>{t.settings.language}</Text>
                  <Pressable style={styles.langSelector} onPress={() => setShowLangPicker(!showLangPicker)}>
                    <Text style={styles.langSelectorText}>
                      {language === 'en' ? t.settings.english : t.settings.spanish}
                    </Text>
                    <Text style={styles.langArrow}>{showLangPicker ? '▲' : '▼'}</Text>
                  </Pressable>
                  {showLangPicker ? (
                    <View style={styles.langOptions}>
                      <Pressable
                        style={[styles.langOption, language === 'en' && styles.langOptionActive]}
                        onPress={() => {
                          setLanguage('en');
                          setShowLangPicker(false);
                        }}
                      >
                        <Text style={[styles.langOptionText, language === 'en' && styles.langOptionTextActive]}>
                          {t.settings.english}
                        </Text>
                      </Pressable>
                      <Pressable
                        style={[styles.langOption, language === 'es' && styles.langOptionActive]}
                        onPress={() => {
                          setLanguage('es');
                          setShowLangPicker(false);
                        }}
                      >
                        <Text style={[styles.langOptionText, language === 'es' && styles.langOptionTextActive]}>
                          {t.settings.spanish}
                        </Text>
                      </Pressable>
                    </View>
                  ) : null}
                </View>

                <View style={styles.profileActions}>
                  <AppButton
                    label={t.profile.editProfile}
                    variant="secondary"
                    onPress={() => navigation.navigate('ProfileSetup', { mode: 'edit' })}
                    style={styles.actionButton}
                  />
                  <AppButton
                    label={t.profile.logout}
                    variant="ghost"
                    onPress={onPressLogout}
                    style={styles.actionButton}
                  />
                </View>
              </>
            ) : null}

            <Text style={styles.sectionTitle}>{t.posts.myPublications}</Text>
            {postsQuery.isLoading ? <LoadingState /> : null}
            {postsQuery.isError ? (
              <ErrorState message={t.errors.couldNotLoadPosts} onRetry={postsQuery.refetch} />
            ) : null}
            {!postsQuery.isLoading && !postsQuery.isError && (postsQuery.data?.length ?? 0) === 0 ? (
              <EmptyState
                title={t.posts.noPublications}
                description={t.posts.createFirstPost}
              />
            ) : null}
          </>
        }
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onPress={() => navigation.navigate('PostDetail', { postId: item.id })}
            hideInterestButton
          />
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    color: theme.colors.textPrimary,
    fontSize: theme.text.heading,
    fontWeight: '700',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.text.title,
    fontWeight: '700',
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  list: {
    paddingBottom: theme.spacing.xl,
  },
  block: {
    marginBottom: theme.spacing.md,
  },
  blockAction: {
    marginTop: theme.spacing.sm,
  },
  profileActions: {
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  actionButton: {
    marginBottom: theme.spacing.md,
  },
  settingsSection: {
    marginBottom: theme.spacing.md,
  },
  settingsTitle: {
    color: theme.colors.textSecondary,
    fontSize: theme.text.caption,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  langSelector: {
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    minHeight: 48,
  },
  langSelectorText: {
    color: theme.colors.textPrimary,
    fontSize: theme.text.body,
  },
  langArrow: {
    color: theme.colors.textSecondary,
    fontSize: 12,
  },
  langOptions: {
    marginTop: theme.spacing.xs,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  langOption: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  langOptionActive: {
    backgroundColor: theme.colors.accentSoft,
  },
  langOptionText: {
    color: theme.colors.textPrimary,
    fontSize: theme.text.body,
  },
  langOptionTextActive: {
    color: theme.colors.accent,
    fontWeight: '600',
  },
});
