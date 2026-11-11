export type SignInCredentials = { email: string; password: string };
export type SignUpPayload = { displayName: string; nickname: string; email: string; password: string; acceptedTerms: true };
export type ProfileChanges = Pick<AuthenticatedUser, 'displayName' | 'nickname'> & { photoUri?: string | null };
export type AuthenticatedUser = {
  id: string;
  displayName: string;
  nickname: string;
  email: string;
  photoUri?: string;
  currentLevel?: string;
  levelProgress?: number;
  levelDescription?: string;
  streakDays?: number;
  totalXp?: number;
  weeklyActivity?: number[];
};
export type AuthSession = { user: AuthenticatedUser; accessToken: string; refreshToken?: string };
export type VerificationPurpose = 'signup' | 'recovery';
export type EmailVerificationResult = { recoveryToken?: string };

/** Adapter contract for the future backend. Endpoint paths are intentionally owned by the API integration. */
export interface AuthApi {
  signIn(credentials: SignInCredentials): Promise<AuthSession>;
  signUp(payload: SignUpPayload): Promise<void>;
  requestVerificationCode(email: string, purpose: VerificationPurpose): Promise<void>;
  verifyEmailCode(email: string, code: string, purpose: VerificationPurpose): Promise<EmailVerificationResult>;
  resetPassword(email: string, recoveryToken: string, newPassword: string): Promise<void>;
  getCurrentUser(accessToken: string): Promise<AuthenticatedUser>;
  refreshSession(refreshToken: string): Promise<AuthSession>;
  signOut(refreshToken: string): Promise<void>;
  updateProfile(userId: string, changes: ProfileChanges, accessToken: string): Promise<AuthenticatedUser>;
}

let authApi: AuthApi | null = null;

/** Call once from the API integration layer when that layer is added to the project. */
export function configureAuthApi(adapter: AuthApi) { authApi = adapter; }
export function hasAuthApi() { return authApi !== null; }
function api(): AuthApi {
  if (!authApi) throw new Error('O serviço de contas ainda não está conectado ao frontend.');
  return authApi;
}

export const signIn = (credentials: SignInCredentials) => api().signIn(credentials);
export const signUp = (payload: SignUpPayload) => api().signUp(payload);
export const requestVerificationCode = (email: string, purpose: VerificationPurpose) => api().requestVerificationCode(email, purpose);
export const verifyEmailCode = (email: string, code: string, purpose: VerificationPurpose) => api().verifyEmailCode(email, code, purpose);
export const resetPassword = (email: string, recoveryToken: string, newPassword: string) => api().resetPassword(email, recoveryToken, newPassword);
export const getCurrentUser = (accessToken: string) => api().getCurrentUser(accessToken);
export const refreshSession = (refreshToken: string) => api().refreshSession(refreshToken);
export const revokeSession = (refreshToken: string) => api().signOut(refreshToken);
export const updateProfile = (userId: string, changes: ProfileChanges, accessToken: string) => api().updateProfile(userId, changes, accessToken);
