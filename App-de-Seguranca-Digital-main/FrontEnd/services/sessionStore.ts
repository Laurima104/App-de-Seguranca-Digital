import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import type { AuthSession } from './auth';

const ACCESS_KEY = 'auth.accessToken';
const REFRESH_KEY = 'auth.refreshToken';

async function setItem(key: string, value: string) {
  if (Platform.OS === 'web') {
    window.localStorage.setItem(key, value);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
}

async function getItem(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    return window.localStorage.getItem(key);
  }
  return SecureStore.getItemAsync(key);
}

async function removeItem(key: string) {
  if (Platform.OS === 'web') {
    window.localStorage.removeItem(key);
  } else {
    await SecureStore.deleteItemAsync(key);
  }
}

export async function saveSession(session: AuthSession) {
  await setItem(ACCESS_KEY, session.accessToken);
  if (session.refreshToken) await setItem(REFRESH_KEY, session.refreshToken);
  else await removeItem(REFRESH_KEY);
}

export async function readSessionTokens(): Promise<{ accessToken: string | null; refreshToken: string | null }> {
  return {
    accessToken: await getItem(ACCESS_KEY),
    refreshToken: await getItem(REFRESH_KEY),
  };
}

export async function clearSession() {
  await removeItem(ACCESS_KEY);
  await removeItem(REFRESH_KEY);
}