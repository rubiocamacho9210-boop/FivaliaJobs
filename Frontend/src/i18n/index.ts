import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { en } from './en';
import { es } from './es';

export type Language = 'en' | 'es';
export type Translations = typeof en;

const translations: Record<Language, Translations> = { en, es };

type I18nState = {
  language: Language;
  hasHydrated: boolean;
  setLanguage: (lang: Language) => void;
  t: Translations;
  setHasHydrated: (value: boolean) => void;
};

export const useI18n = create<I18nState>()(
  persist(
    (set) => ({
      language: 'en',
      hasHydrated: false,
      setLanguage: (language) =>
        set({
          language,
          t: translations[language],
        }),
      t: translations.en,
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: 'fivalia-i18n',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ language: state.language }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.t = translations[state.language];
          state.setHasHydrated(true);
        }
      },
    },
  ),
);
