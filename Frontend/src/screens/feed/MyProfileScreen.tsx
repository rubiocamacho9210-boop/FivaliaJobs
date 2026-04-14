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
import { useI18n, Language, ThemeMode } from '@/i18n';
import { useTheme } from '@/context/ThemeContext';

export function MyProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const user = useAuthStore((state) => state.user);
  const profileQuery = useMyProfileQuery();
  const postsQuery = usePostsByUserQuery(user?.id ?? '');
  const clearSession = useAuthStore((state) => state.clearSession);
  const { t, language, themeMode, setLanguage, setThemeMode } = useI18n();
  const { spacing, radius, colors, text } = useTheme();
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);

  const onPressLogout = () => {
    Alert.alert(t.profile.logoutTitle, t.profile.logoutConfirm, [
      { text: t.common.cancel, style: 'cancel' },
      { text: t.profile.logout, style: 'destructive', onPress: clearSession },
    ]);
  };

  const getThemeLabel = (mode: ThemeMode) => {
    switch (mode) {
      case 'light':
        return t.settings.light;
      case 'dark':
        return t.settings.dark;
      case 'system':
        return t.settings.system;
    }
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
        contentContainerStyle={[styles.list, { paddingBottom: spacing.xl }]}
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
            <Text style={[styles.title, { color: colors.textPrimary, fontSize: text.heading, fontWeight: '700', marginBottom: spacing.md }]}>
              {t.profile.myProfile}
            </Text>
            {profileQuery.data ? <ProfileHeader profile={profileQuery.data} /> : null}

            {hasNoProfile ? (
              <View style={[styles.block, { marginBottom: spacing.md }]}>
                <EmptyState
                  title={t.profile.setupProfile}
                  description={t.profile.setupDescription}
                />
                <View style={[styles.blockAction, { marginTop: spacing.sm }]}>
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
                <View style={[styles.settingsSection, { marginBottom: spacing.md }]}>
                  <Text style={[styles.settingsTitle, { color: colors.textSecondary, fontSize: text.caption, fontWeight: '600', marginBottom: spacing.xs }]}>
                    {t.settings.theme}
                  </Text>
                  <Pressable
                    style={[styles.selector, { backgroundColor: colors.surfaceAlt, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.md, minHeight: 48 }]}
                    onPress={() => setShowThemePicker(!showThemePicker)}
                  >
                    <Text style={[styles.selectorText, { color: colors.textPrimary, fontSize: text.body }]}>
                      {getThemeLabel(themeMode)}
                    </Text>
                    <Text style={[styles.selectorArrow, { color: colors.textSecondary }]}>
                      {showThemePicker ? '▲' : '▼'}
                    </Text>
                  </Pressable>
                  {showThemePicker ? (
                    <View style={[styles.options, { backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, marginTop: spacing.xs }]}>
                      {(['light', 'dark', 'system'] as ThemeMode[]).map((mode) => (
                        <Pressable
                          key={mode}
                          style={[styles.option, themeMode === mode && { backgroundColor: colors.accentSoft }, { paddingHorizontal: spacing.md, paddingVertical: spacing.sm }]}
                          onPress={() => {
                            setThemeMode(mode);
                            setShowThemePicker(false);
                          }}
                        >
                          <Text style={[styles.optionText, { color: themeMode === mode ? colors.accent : colors.textPrimary, fontSize: text.body, fontWeight: themeMode === mode ? '600' : '400' }]}>
                            {getThemeLabel(mode)}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  ) : null}
                </View>

                <View style={[styles.settingsSection, { marginBottom: spacing.md }]}>
                  <Text style={[styles.settingsTitle, { color: colors.textSecondary, fontSize: text.caption, fontWeight: '600', marginBottom: spacing.xs }]}>
                    {t.settings.language}
                  </Text>
                  <Pressable
                    style={[styles.selector, { backgroundColor: colors.surfaceAlt, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.md, minHeight: 48 }]}
                    onPress={() => setShowLangPicker(!showLangPicker)}
                  >
                    <Text style={[styles.selectorText, { color: colors.textPrimary, fontSize: text.body }]}>
                      {language === 'en' ? t.settings.english : t.settings.spanish}
                    </Text>
                    <Text style={[styles.selectorArrow, { color: colors.textSecondary }]}>
                      {showLangPicker ? '▲' : '▼'}
                    </Text>
                  </Pressable>
                  {showLangPicker ? (
                    <View style={[styles.options, { backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, marginTop: spacing.xs }]}>
                      {(['en', 'es'] as Language[]).map((lang) => (
                        <Pressable
                          key={lang}
                          style={[styles.option, lang === language && { backgroundColor: colors.accentSoft }, { paddingHorizontal: spacing.md, paddingVertical: spacing.sm }]}
                          onPress={() => {
                            setLanguage(lang);
                            setShowLangPicker(false);
                          }}
                        >
                          <Text style={[styles.optionText, { color: lang === language ? colors.accent : colors.textPrimary, fontSize: text.body, fontWeight: lang === language ? '600' : '400' }]}>
                            {lang === 'en' ? t.settings.english : t.settings.spanish}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  ) : null}
                </View>

                <View style={[styles.profileActions, { gap: spacing.sm, marginBottom: spacing.md }]}>
                  <AppButton
                    label={t.profile.editProfile}
                    variant="secondary"
                    onPress={() => navigation.navigate('ProfileSetup', { mode: 'edit' })}
                  />
                  <AppButton
                    label={t.profile.logout}
                    variant="ghost"
                    onPress={onPressLogout}
                  />
                </View>
              </>
            ) : null}

            <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontSize: text.title, fontWeight: '700', marginBottom: spacing.sm, marginTop: spacing.sm }]}>
              {t.posts.myPublications}
            </Text>
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
  title: {},
  sectionTitle: {},
  list: {},
  block: {},
  blockAction: {},
  profileActions: {},
  settingsSection: {},
  settingsTitle: {},
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectorText: {},
  selectorArrow: {
    fontSize: 12,
  },
  options: {
    overflow: 'hidden',
  },
  option: {},
  optionText: {},
});
