import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { en } from './en';
import { es } from './es';
import { fr } from './fr';
import { de } from './de';
import { pt } from './pt';
import { it } from './it';

export type Language = 'en' | 'es' | 'fr' | 'de' | 'pt' | 'it';
export type ThemeMode = 'light' | 'dark' | 'system';
export type Translations = typeof en;

const translations: Record<Language, Translations> = { en, es, fr, de, pt, it };

type I18nState = {
  language: Language;
  themeMode: ThemeMode;
  hasHydrated: boolean;
  setLanguage: (lang: Language) => void;
  setThemeMode: (mode: ThemeMode) => void;
  t: Translations;
  setHasHydrated: (value: boolean) => void;
};

export const useI18n = create<I18nState>()(
  persist(
    (set) => ({
      language: 'en',
      themeMode: 'light',
      hasHydrated: false,
      setLanguage: (language) =>
        set({
          language,
          t: translations[language],
        }),
      setThemeMode: (themeMode) => set({ themeMode }),
      t: translations.en,
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: 'fivalia-i18n',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ language: state.language, themeMode: state.themeMode }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.t = translations[state.language];
          state.setHasHydrated(true);
        }
      },
    },
  ),
);
