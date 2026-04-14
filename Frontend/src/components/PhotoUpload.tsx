import React, { useState } from 'react';
import { Alert, Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '@/context/ThemeContext';
import { useI18n } from '@/i18n';

type Props = {
  value?: string | null;
  onChange: (uri: string | null) => void;
};

export function PhotoUpload({ value, onChange }: Props) {
  const { colors, radius } = useTheme();
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(t.errors.generic, 'Permission to access camera roll is required!');
      return;
    }

    setLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        onChange(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    } finally {
      setLoading(false);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(t.errors.generic, 'Permission to access camera is required!');
      return;
    }

    setLoading(true);
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        onChange(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
    } finally {
      setLoading(false);
    }
  };

  const showOptions = () => {
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

  return (
    <View style={styles.container}>
      <Pressable
        onPress={showOptions}
        style={[
          styles.placeholder,
          {
            backgroundColor: colors.surfaceAlt,
            borderColor: colors.border,
            borderRadius: radius.lg,
            borderWidth: 2,
            borderStyle: value ? 'solid' : 'dashed',
          },
        ]}
      >
        {value ? (
          <Image source={{ uri: value }} style={[styles.image, { borderRadius: radius.lg }]} />
        ) : (
          <View style={styles.placeholderContent}>
            <Text style={[styles.plusIcon, { color: colors.accent }]}>+</Text>
            <Text style={[styles.placeholderText, { color: colors.textSecondary }]}>
              {t.profile.uploadPhoto}
            </Text>
          </View>
        )}
      </Pressable>
      {value && (
        <Pressable
          onPress={() => onChange(null)}
          style={[styles.removeButton, { backgroundColor: colors.danger }]}
        >
          <Text style={styles.removeText}>X</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 16,
  },
  placeholder: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderContent: {
    alignItems: 'center',
    gap: 8,
  },
  plusIcon: {
    fontSize: 32,
    fontWeight: '600',
  },
  placeholderText: {
    fontSize: 12,
    textAlign: 'center',
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: Platform.OS === 'ios' ? 100 : 120,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
