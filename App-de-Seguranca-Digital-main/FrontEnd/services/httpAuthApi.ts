import type { AuthApi, AuthenticatedUser } from './auth';

// Emulador Android: http://10.0.2.2:8082 | Celular físico: IP do PC na rede
const BASE_URL = 'http://localhost:8082';

type UsuarioResponse = { id: number; nickname: string; email: string; progresso: number };

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message ?? 'Erro ao falar com o servidor.');
  return data as T;
}

const toUser = (u: UsuarioResponse): AuthenticatedUser => ({
  id: String(u.id),
  displayName: u.nickname,
  nickname: u.nickname,
  email: u.email,
  levelProgress: u.progresso,
});

const naoImplementado = (): never => {
  throw new Error('Ainda não implementado no back end.');
};

export const httpAuthApi: AuthApi = {
  async signIn({ email, password }) {
    const u = await post<UsuarioResponse>('/login', { email, senha: password });
    // Provisório: o back end ainda não gera token. Trocar por JWT depois.
    return { user: toUser(u), accessToken: String(u.id) };
  },

  async signUp({ nickname, email, password }) {
    await post('/usuarios', { nickname, email, senha: password });
  },

  // Sem verificação de e-mail no back end: passam direto para o fluxo não travar.
  async requestVerificationCode() {},
  async verifyEmailCode() { return {}; },
  async signOut() {},

  resetPassword: async () => naoImplementado(),
  getCurrentUser: async () => naoImplementado(),
  refreshSession: async () => naoImplementado(),
  updateProfile: async () => naoImplementado(),
};