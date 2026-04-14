import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

type Props = {
  rating: number;
  ratingCount: number;
  size?: 'small' | 'medium' | 'large';
  editable?: boolean;
  onRate?: (rating: number) => void;
};

export function StarRating({ rating, ratingCount, size = 'medium', editable = false, onRate }: Props) {
  const { colors } = useTheme();

  const starSize = size === 'small' ? 14 : size === 'large' ? 24 : 18;
  const fontSize = size === 'small' ? 11 : size === 'large' ? 14 : 13;

  const renderStar = (index: number) => {
    const filled = index < Math.floor(rating);
    const halfFilled = !filled && index < rating;

    const starChar = filled ? '★' : halfFilled ? '★' : '☆';
    const starColor = filled || halfFilled ? '#FFB800' : colors.textSecondary;

    if (editable && onRate) {
      return (
        <Pressable key={index} onPress={() => onRate(index + 1)}>
          <Text style={[styles.star, { fontSize: starSize, color: starColor }]}>{starChar}</Text>
        </Pressable>
      );
    }

    return (
      <Text key={index} style={[styles.star, { fontSize: starSize, color: starColor }]}>
        {starChar}
      </Text>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.stars}>
        {[0, 1, 2, 3, 4].map(renderStar)}
      </View>
      <Text style={[styles.count, { color: colors.textSecondary, fontSize }]}>
        ({ratingCount})
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
  star: {
    fontWeight: '600',
  },
  count: {},
});
