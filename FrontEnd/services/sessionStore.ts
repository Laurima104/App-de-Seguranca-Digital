import * as SecureStore from 'expo-secure-store';
import { AuthSession } from './auth';

const accessTokenKey = 'app.auth.access-token';
const refreshTokenKey = 'app.auth.refresh-token';

export async function saveSession(session: AuthSession) {
  await SecureStore.setItemAsync(accessTokenKey, session.accessToken);
  if (session.refreshToken) await SecureStore.setItemAsync(refreshTokenKey, session.refreshToken);
  else await SecureStore.deleteItemAsync(refreshTokenKey);
}

export async function readSessionTokens() {
  const [accessToken, refreshToken] = await Promise.all([
    SecureStore.getItemAsync(accessTokenKey),
    SecureStore.getItemAsync(refreshTokenKey),
  ]);
  return { accessToken, refreshToken };
}

export async function clearSession() {
  await Promise.all([SecureStore.deleteItemAsync(accessTokenKey), SecureStore.deleteItemAsync(refreshTokenKey)]);
}
