import type { AuthApi, AuthenticatedUser } from './auth';

// Expo Go em aparelho físico: defina EXPO_PUBLIC_API_URL com o IPv4 do computador.
// Ex.: http://192.168.0.25:8080. No navegador local, localhost funciona.
const BASE_URL = (process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080').replace(/\/+$/, '');

type UsuarioResponse = { id: number; displayName: string; nickname: string; email: string; progresso: number };
type LoginResponse = { user: UsuarioResponse; accessToken: string };

async function request<T>(path: string, options: { method?: string; body?: unknown; accessToken?: string } = {}): Promise<T> {
  const headers: Record<string, string> = {};
  if (options.body !== undefined) headers['Content-Type'] = 'application/json';
  if (options.accessToken) headers.Authorization = `Bearer ${options.accessToken}`;
  const res = await fetch(`${BASE_URL}${path}`, {
    method: options.method ?? 'GET',
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message ?? data?.detail ?? data?.title ?? 'Erro ao falar com o servidor.');
  return data as T;
}

const post = <T>(path: string, body: unknown) => request<T>(path, { method: 'POST', body });

const toUser = (u: UsuarioResponse): AuthenticatedUser => ({
  id: String(u.id),
  displayName: u.displayName,
  nickname: u.nickname,
  email: u.email,
  levelProgress: u.progresso,
});

const indisponivel = (feature: string): never => {
  throw new Error(`${feature} ainda não foi implementado no back end.`);
};

export const httpAuthApi: AuthApi = {
  async signIn({ email, password }) {
    const result = await post<LoginResponse>('/login', { email, senha: password });
    return { user: toUser(result.user), accessToken: result.accessToken };
  },

  async signUp({ displayName, nickname, email, password, acceptedTerms }) {
    await post('/usuarios', { displayName, nickname, email, senha: password, acceptedTerms });
  },

  async requestVerificationCode() { return indisponivel('Envio de código de verificação por e-mail'); },
  async verifyEmailCode() { return indisponivel('Verificação de e-mail'); },
  async signOut(accessToken) {
    await request<void>('/logout', { method: 'POST', accessToken });
  },

  resetPassword: async () => indisponivel('Recuperação de senha'),
  async getCurrentUser(accessToken) {
    const user = await request<UsuarioResponse>('/usuarios/me', { accessToken });
    return toUser(user);
  },
  refreshSession: async () => indisponivel('Renovação de sessão'),
  async updateProfile(changes, accessToken) {
    const user = await request<UsuarioResponse>('/usuarios/me', {
      method: 'PATCH',
      body: { displayName: changes.displayName, nickname: changes.nickname },
      accessToken,
    });
    return toUser(user);
  },
  async changePassword(currentPassword, newPassword, accessToken) {
    await request<void>('/usuarios/me/senha', {
      method: 'PUT',
      body: { senhaAtual: currentPassword, novaSenha: newPassword },
      accessToken,
    });
  },
};
