import React from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
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
import { theme } from '@/constants/theme';

export function MyProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const user = useAuthStore((state) => state.user);
  const profileQuery = useMyProfileQuery();
  const postsQuery = usePostsByUserQuery(user?.id ?? '');
  const clearSession = useAuthStore((state) => state.clearSession);

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
            <Text style={styles.title}>Mi perfil</Text>
            {profileQuery.data ? <ProfileHeader profile={profileQuery.data} /> : null}

            {hasNoProfile ? (
              <View style={styles.block}>
                <EmptyState
                  title="Completa tu perfil"
                  description="Agrega bio, categoria y contacto para generar confianza."
                />
                <View style={styles.blockAction}>
                  <AppButton
                    label="Configurar perfil"
                    onPress={() => navigation.navigate('ProfileSetup', { mode: 'create' })}
                  />
                </View>
              </View>
            ) : null}

            {profileQuery.isError && !hasNoProfile ? (
              <ErrorState message="No pudimos cargar tu perfil." onRetry={profileQuery.refetch} />
            ) : null}

            {profileQuery.data ? (
              <AppButton
                label="Editar perfil"
                variant="secondary"
                onPress={() => navigation.navigate('ProfileSetup', { mode: 'edit' })}
                style={styles.editButton}
              />
            ) : null}

            <Text style={styles.sectionTitle}>Mis publicaciones</Text>
            {postsQuery.isLoading ? <LoadingState /> : null}
            {postsQuery.isError ? (
              <ErrorState message="No pudimos cargar tus publicaciones." onRetry={postsQuery.refetch} />
            ) : null}
            {!postsQuery.isLoading && !postsQuery.isError && (postsQuery.data?.length ?? 0) === 0 ? (
              <EmptyState
                title="Sin publicaciones"
                description='Crea tu primer post desde la pestaña "Publicar".'
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
        ListFooterComponent={
          <View style={styles.logoutWrap}>
            <AppButton label="Cerrar sesion" variant="ghost" onPress={clearSession} />
          </View>
        }
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
  editButton: {
    marginBottom: theme.spacing.md,
  },
  logoutWrap: {
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
  },
});
