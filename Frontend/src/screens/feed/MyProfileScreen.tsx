import React, { useState } from 'react';
import { Alert, FlatList, Image, Platform, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
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
import { isProfileNotFoundError, useMyProfileQuery, useUpdateProfileMutation } from '@/hooks/useProfile';
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
  const updateMutation = useUpdateProfileMutation();
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

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(t.errors.generic, 'Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      try {
        await updateMutation.mutateAsync({
          photoUrl: result.assets[0].uri,
        });
        profileQuery.refetch();
      } catch (error) {
        Alert.alert(t.errors.generic, 'Failed to update photo');
      }
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(t.errors.generic, 'Permission to access camera is required!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      try {
        await updateMutation.mutateAsync({
          photoUrl: result.assets[0].uri,
        });
        profileQuery.refetch();
      } catch (error) {
        Alert.alert(t.errors.generic, 'Failed to update photo');
      }
    }
  };

  const showPhotoOptions = () => {
    Alert.alert(
      t.profile.uploadPhoto,
      t.profile.choosePhotoOption,
      [
        { text: t.profile.takePhoto, onPress: takePhoto },
        { text: t.profile.chooseFromGallery, onPress: pickImage },
        { text: t.common.cancel, style: 'cancel' },
      ]
    );
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

  const getLanguageLabel = (lang: Language) => {
    switch (lang) {
      case 'en':
        return t.settings.english;
      case 'es':
        return t.settings.spanish;
      case 'fr':
        return t.settings.french;
      case 'de':
        return t.settings.german;
      case 'pt':
        return t.settings.portuguese;
      case 'it':
        return t.settings.italian;
    }
  };

  const languages: Language[] = ['en', 'es', 'fr', 'de', 'pt', 'it'];

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
            
            {profileQuery.data ? (
              <View style={styles.profileSection}>
                <View style={styles.avatarContainer}>
                  {profileQuery.data.photoUrl ? (
                    <Image source={{ uri: profileQuery.data.photoUrl }} style={[styles.avatarImage, { borderRadius: 48 }]} />
                  ) : (
                    <View style={[styles.avatarPlaceholder, { backgroundColor: colors.border, borderRadius: 48 }]}>
                      <Text style={[styles.avatarInitial, { color: colors.textPrimary }]}>
                        {user?.name?.charAt(0).toUpperCase() ?? 'U'}
                      </Text>
                    </View>
                  )}
                  <Pressable
                    onPress={showPhotoOptions}
                    style={[styles.editPhotoButton, { backgroundColor: colors.accent }]}
                  >
                    <Text style={styles.editPhotoIcon}>+</Text>
                  </Pressable>
                </View>
                <Text style={[styles.profileName, { color: colors.textPrimary }]}>{user?.name}</Text>
                <Text style={[styles.profileRole, { color: colors.textSecondary }]}>
                  {user?.role === 'WORKER' ? t.register.worker : t.register.client}
                </Text>
              </View>
            ) : null}

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
                      {getLanguageLabel(language)}
                    </Text>
                    <Text style={[styles.selectorArrow, { color: colors.textSecondary }]}>
                      {showLangPicker ? '▲' : '▼'}
                    </Text>
                  </Pressable>
                  {showLangPicker ? (
                    <View style={[styles.options, { backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, marginTop: spacing.xs }]}>
                      {languages.map((lang) => (
                        <Pressable
                          key={lang}
                          style={[styles.option, lang === language && { backgroundColor: colors.accentSoft }, { paddingHorizontal: spacing.md, paddingVertical: spacing.sm }]}
                          onPress={() => {
                            setLanguage(lang);
                            setShowLangPicker(false);
                          }}
                        >
                          <Text style={[styles.optionText, { color: lang === language ? colors.accent : colors.textPrimary, fontSize: text.body, fontWeight: lang === language ? '600' : '400' }]}>
                            {getLanguageLabel(lang)}
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
  sectionTitle: {},
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatarImage: {
    width: 96,
    height: 96,
  },
  avatarPlaceholder: {
    width: 96,
    height: 96,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: 40,
    fontWeight: '700',
  },
  editPhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editPhotoIcon: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginTop: -2,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
  },
  profileRole: {
    fontSize: 15,
    marginTop: 2,
  },
});
