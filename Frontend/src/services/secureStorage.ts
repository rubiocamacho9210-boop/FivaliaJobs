import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'fivalia-auth-token';
const USER_KEY = 'fivalia-auth-user';
const NEEDS_PROFILE_KEY = 'fivalia-auth-needs-profile';

export const secureStorage = {
  async setToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token, {
        keychainService: 'fivalia-jwt',
      });
    } catch (error) {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    }
  },

  async getToken(): Promise<string | null> {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (token) return token;
    } catch (error) {
      // Fallback to AsyncStorage
    }
    return AsyncStorage.getItem(TOKEN_KEY);
  },

  async removeToken(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    } catch (error) {
      // Continue with AsyncStorage cleanup
    }
    await AsyncStorage.removeItem(TOKEN_KEY);
  },

  async setUser(userJson: string): Promise<void> {
    await AsyncStorage.setItem(USER_KEY, userJson);
  },

  async getUser(): Promise<string | null> {
    return AsyncStorage.getItem(USER_KEY);
  },

  async removeUser(): Promise<void> {
    await AsyncStorage.removeItem(USER_KEY);
  },

  async setNeedsProfileSetup(value: boolean): Promise<void> {
    await AsyncStorage.setItem(NEEDS_PROFILE_KEY, JSON.stringify(value));
  },

  async getNeedsProfileSetup(): Promise<boolean> {
    const value = await AsyncStorage.getItem(NEEDS_PROFILE_KEY);
    return value ? JSON.parse(value) : false;
  },

  async clearAll(): Promise<void> {
    await this.removeToken();
    await this.removeUser();
    await AsyncStorage.removeItem(NEEDS_PROFILE_KEY);
  },
};
