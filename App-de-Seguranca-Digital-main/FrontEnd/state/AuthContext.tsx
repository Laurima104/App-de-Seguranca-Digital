import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AuthenticatedUser, ProfileChanges, SignInCredentials, getCurrentUser, hasAuthApi, refreshSession, revokeSession, signIn as authenticate, updateProfile as patchProfile } from '../services/auth';
import { clearSession, readSessionTokens, saveSession } from '../services/sessionStore';

type AuthContextValue = {
  user: AuthenticatedUser | null;
  isRestoring: boolean;
  signIn: (credentials: SignInCredentials) => Promise<AuthenticatedUser>;
  signOut: () => Promise<void>;
  updateUser: (user: AuthenticatedUser) => void;
  saveProfile: (changes: ProfileChanges) => Promise<AuthenticatedUser>;
};
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: React.PropsWithChildren) {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [isRestoring, setIsRestoring] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { accessToken, refreshToken } = await readSessionTokens();
        if (hasAuthApi() && (accessToken || refreshToken)) {
          try {
            if (!accessToken) throw new Error('Access token ausente.');
            const currentUser = await getCurrentUser(accessToken);
            if (active) setUser(currentUser);
          } catch {
            if (!refreshToken) throw new Error('A sessão não pode ser renovada.');
            const session = await refreshSession(refreshToken);
            await saveSession(session);
            if (active) setUser(session.user);
          }
        }
      } catch {
        await clearSession().catch(() => undefined);
      } finally {
        if (active) setIsRestoring(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const signIn = useCallback(async (credentials: SignInCredentials) => {
    const session = await authenticate(credentials);
    await saveSession(session);
    setUser(session.user);
    return session.user;
  }, []);

  const signOut = useCallback(async () => {
    const { refreshToken } = await readSessionTokens().catch(() => ({ accessToken: null, refreshToken: null }));
    try {
      if (refreshToken && hasAuthApi()) await revokeSession(refreshToken);
    } catch {
      // The local session is still removed if the backend cannot revoke the refresh token.
    } finally {
      setUser(null);
      await clearSession();
    }
  }, []);

  const saveProfile = useCallback(async (changes: ProfileChanges) => {
    if (!user) throw new Error('Entre na sua conta para editar o perfil.');
    const { accessToken } = await readSessionTokens();
    if (!accessToken) throw new Error('A sessão expirou. Entre novamente para editar o perfil.');
    const updatedUser = await patchProfile(user.id, changes, accessToken);
    setUser(updatedUser);
    return updatedUser;
  }, [user]);

  const value = useMemo(() => ({ user, isRestoring, signIn, signOut, updateUser: setUser, saveProfile }), [user, isRestoring, signIn, signOut, saveProfile]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  return context;
}
