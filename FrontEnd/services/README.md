# Serviços e integração HTTP

`App.tsx` registra `httpAuthApi` em `configureAuthApi` antes de montar o estado de autenticação. A URL da API vem de `EXPO_PUBLIC_API_URL`; em Expo Go num celular físico, informe o IPv4 do computador na rede local e a porta `8080`. O exemplo está em `.env.example` na raiz do repositório.

## Implementado

- `POST /usuarios`: cadastro com nome de exibição, nickname, e-mail, senha e aceite dos documentos. A senha é enviada por HTTPS em produção e armazenada no backend como BCrypt hash.
- `POST /login`: valida e-mail/senha e devolve os dados públicos do usuário e o token de sessão.
- `GET /usuarios/me`: carrega o usuário associado à sessão.
- `PATCH /usuarios/me`: atualiza nome e nickname da conta autenticada sem aceitar ID do cliente.
- `PUT /usuarios/me/senha`: altera a senha validando a senha atual.
- `POST /logout`: revoga a sessão atual.
- `services/auth.ts`: declara a interface `AuthApi` e os tipos usados pelas telas.
- `services/sessionStore.ts`: persiste o token aleatório de sessão em armazenamento seguro no dispositivo.

## Ainda não implementado no backend

Verificação e envio de código de e-mail, recuperação de senha, renovação de sessão, persistência remota da foto e API de níveis. O adaptador lança erro explícito para as operações ausentes; não há persistência simulada. `learning.ts` contém o contrato futuro, mas nenhum adaptador está registrado.

Não conecte o app mobile diretamente ao MySQL. Todas as operações com dados devem passar pela API, que precisa validar a identidade e autorização do usuário. Consulte [`../../BackEnd/README.md`](../../BackEnd/README.md) para iniciar a API e [`../../BancoDados/README.md`](../../BancoDados/README.md) para criar o schema MySQL.
