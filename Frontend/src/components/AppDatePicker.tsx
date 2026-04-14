import React, { useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useTheme } from '@/context/ThemeContext';
import { useI18n } from '@/i18n';

type Props = {
  label: string;
  value: Date | null;
  onChange: (date: Date) => void;
  error?: string;
  maximumDate?: Date;
};

export function AppDatePicker({ label, value, onChange, error, maximumDate }: Props) {
  const { colors, radius, spacing, text } = useTheme();
  const { t } = useI18n();
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
    <View style={[styles.container, { marginBottom: spacing.md }]}>
      <Text style={[styles.label, { color: colors.textSecondary, fontSize: text.caption, marginBottom: spacing.xs }]}>
        {label}
      </Text>
      <Pressable onPress={() => setShow(true)} style={styles.touchable}>
        <View style={[styles.display, { backgroundColor: colors.surfaceAlt, borderRadius: radius.md, borderWidth: Platform.OS === 'ios' ? 1 : 0, borderColor: colors.border, minHeight: Platform.select({ ios: 50, android: 56, default: 56 }), paddingHorizontal: spacing.md }]}>
          <Text style={value ? [styles.text, { color: colors.textPrimary, fontSize: text.body }] : [styles.placeholder, { color: colors.textSecondary, fontSize: text.body }]}>
            {value ? formatDate(value) : t.register.selectBirthDate}
          </Text>
        </View>
      </Pressable>
      {error ? <Text style={[styles.error, { color: colors.danger }]}>{error}</Text> : null}

      {Platform.OS === 'ios' ? (
        <Modal visible={show} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: colors.surface, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg }]}>
              <View style={[styles.modalHeader, { borderBottomColor: colors.border, paddingHorizontal: spacing.md, paddingVertical: spacing.md }]}>
                <Pressable onPress={() => setShow(false)}>
                  <Text style={[styles.modalCancel, { color: colors.textSecondary, fontSize: text.body }]}>{t.common.cancel}</Text>
                </Pressable>
                <Pressable onPress={() => setShow(false)}>
                  <Text style={[styles.modalDone, { color: colors.accent, fontSize: text.body }]}>Done</Text>
                </Pressable>
              </View>
              <DateTimePicker
                value={value || new Date()}
                mode="date"
                display="spinner"
                onChange={handleChange}
                maximumDate={maximumDate}
                textColor={colors.textPrimary}
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
  container: {},
  label: {
    fontWeight: Platform.select({ ios: '600', android: '500', default: '500' }),
  },
  touchable: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  display: {
    justifyContent: 'center',
  },
  text: {},
  placeholder: {},
  error: {
    fontSize: 12,
    marginTop: 6,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  modalCancel: {},
  modalDone: {
    fontWeight: '600',
  },
});
