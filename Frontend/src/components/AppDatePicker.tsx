import React, { useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { theme } from '@/constants/theme';

type Props = {
  label: string;
  value: Date | null;
  onChange: (date: Date) => void;
  error?: string;
  maximumDate?: Date;
};

export function AppDatePicker({ label, value, onChange, error, maximumDate }: Props) {
  const [show, setShow] = useState(false);

  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShow(false);
    }
    if (event.type === 'set' && selectedDate) {
      onChange(selectedDate);
      if (Platform.OS === 'ios') {
        setShow(false);
      }
    } else if (event.type === 'dismissed') {
      setShow(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Pressable onPress={() => setShow(true)} style={styles.touchable}>
        <View style={styles.display}>
          <Text style={value ? styles.text : styles.placeholder}>
            {value ? formatDate(value) : 'Selecciona una fecha'}
          </Text>
        </View>
      </Pressable>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {Platform.OS === 'ios' ? (
        <Modal visible={show} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Pressable onPress={() => setShow(false)}>
                  <Text style={styles.modalCancel}>Cancelar</Text>
                </Pressable>
                <Pressable onPress={() => setShow(false)}>
                  <Text style={styles.modalDone}>Hecho</Text>
                </Pressable>
              </View>
              <DateTimePicker
                value={value || new Date()}
                mode="date"
                display="spinner"
                onChange={handleChange}
                maximumDate={maximumDate}
              />
            </View>
          </View>
        </Modal>
      ) : (
        show && (
          <DateTimePicker
            value={value || new Date()}
            mode="date"
            display="default"
            onChange={handleChange}
            maximumDate={maximumDate}
          />
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  label: {
    color: theme.colors.textSecondary,
    fontSize: theme.text.caption,
    fontWeight: Platform.select({ ios: '600', android: '500', default: '500' }),
    marginBottom: theme.spacing.xs,
  },
  touchable: {
    borderRadius: theme.radius.md,
    overflow: 'hidden',
  },
  display: {
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: theme.radius.md,
    borderWidth: Platform.OS === 'ios' ? 1 : 0,
    borderColor: theme.colors.border,
    minHeight: Platform.select({ ios: 50, android: 56, default: 56 }),
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.md,
  },
  text: {
    color: theme.colors.textPrimary,
    fontSize: theme.text.body,
  },
  placeholder: {
    color: theme.colors.textSecondary,
    fontSize: theme.text.body,
  },
  error: {
    color: theme.colors.danger,
    fontSize: 12,
    marginTop: 6,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radius.lg,
    borderTopRightRadius: theme.radius.lg,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalCancel: {
    color: theme.colors.textSecondary,
    fontSize: theme.text.body,
  },
  modalDone: {
    color: theme.colors.accent,
    fontSize: theme.text.body,
    fontWeight: '600',
  },
});
