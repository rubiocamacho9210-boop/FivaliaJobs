import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useI18n } from '@/i18n';
import { PostType } from '@/types/post';

type Props = {
  selectedType: PostType | null;
  onSelectType: (type: PostType | null) => void;
};

export function FilterChips({ selectedType, onSelectType }: Props) {
  const { colors, radius } = useTheme();
  const { t } = useI18n();

  const chips: Array<{ label: string; value: PostType | null }> = [
    { label: t.posts.allPosts || 'All', value: null },
    { label: t.posts.need, value: 'NEED' },
    { label: t.posts.offer, value: 'OFFER' },
  ];

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
      {chips.map((chip) => {
        const isSelected = selectedType === chip.value;
        return (
          <Pressable
            key={chip.label}
            onPress={() => onSelectType(chip.value)}
            style={[
              styles.chip,
              {
                backgroundColor: isSelected ? colors.accent : colors.surfaceAlt,
                borderRadius: radius.md,
              },
            ]}
          >
            <Text
              style={[
                styles.chipText,
                { color: isSelected ? '#FFFFFF' : colors.textPrimary },
              ]}
            >
              {chip.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
