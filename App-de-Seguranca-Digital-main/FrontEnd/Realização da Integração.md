# Realização da Integração — Frontend e Backend

Este guia descreve os pontos de conexão já preparados no frontend. O repositório não informa URL, endpoints, protocolo de autenticação nem contrato de banco de dados do backend; portanto, nenhum deles é presumido aqui. A pessoa responsável pela integração deverá mapear a API real aos contratos TypeScript existentes.

## Limite de responsabilidade

O aplicativo mobile deve consumir uma API segura. Ele não deve conectar diretamente ao banco de dados nem conter credenciais de banco. Autorização, validação, persistência e regras de propriedade dos dados devem ser verificadas pelo backend em cada operação.

## Contratos existentes

Os contratos estão em `services/auth.ts` e `services/learning.ts`. Implemente adaptadores que satisfaçam essas interfaces e chame as funções de configuração antes que as telas dependentes sejam utilizadas.

### Contas e autenticação: `AuthApi`

| Método | Dados de entrada | Resultado esperado | Uso no aplicativo |
|---|---|---|---|
| `signIn(credentials)` | e-mail e senha | `AuthSession` com usuário, access token e refresh token opcional | Login |
| `signUp(payload)` | nome, apelido, e-mail, senha e `acceptedTerms: true` | conclusão da solicitação de cadastro | Cadastro; após sucesso o fluxo abre verificação |
| `requestVerificationCode(email, purpose)` | e-mail e finalidade `signup` ou `recovery` | solicitação concluída | Cadastro/recuperação e reenvio do código |
| `verifyEmailCode(email, code, purpose)` | e-mail, código e finalidade | `EmailVerificationResult`; para recuperação deve incluir `recoveryToken` | Verificação de e-mail |
| `resetPassword(email, recoveryToken, newPassword)` | e-mail, token temporário e nova senha | conclusão da redefinição | Recuperar conta |
| `getCurrentUser(accessToken)` | access token | `AuthenticatedUser` | Restauração da sessão e dados de conta |
| `refreshSession(refreshToken)` | refresh token | nova `AuthSession` | Renovação da sessão expirada |
| `signOut(refreshToken)` | refresh token | conclusão da revogação | Saída da conta (a limpeza local ocorre mesmo se a revogação remota falhar) |
| `updateProfile(userId, changes, accessToken)` | id da conta, alterações e access token | `AuthenticatedUser` atualizado | Perfil |

Tipos completos e assinaturas são a fonte de verdade no código. O adaptador deve converter o formato da API para esses tipos e lançar erros (`Error`) com mensagens apropriadas quando a operação falhar. As telas apresentam esses erros ao usuário.

O cadastro navega para a verificação após `signUp` concluir. O envio do primeiro código deve ser parte do fluxo do backend (por exemplo, disparado ao criar a conta pendente) ou ser solicitado explicitamente pelo adaptador. O botão de reenvio já chama `requestVerificationCode`. Para recuperação, a verificação precisa retornar `recoveryToken`; o frontend entrega esse token a `resetPassword` e não envia o código OTP diretamente como autorização para trocar a senha.

### Forma do usuário e sessão

`AuthenticatedUser` contém os campos obrigatórios `id`, `displayName`, `nickname` e `email`, além dos opcionais:

- `photoUri`: endereço remoto da foto;
- `currentLevel`, `levelProgress` (percentual de 0 a 100) e `levelDescription`;
- `streakDays`, `totalXp` e `weeklyActivity` (valores da atividade semanal).

Os valores de progresso e estatísticas devem vir da fonte real do backend. Quando não estiverem disponíveis, as telas mostram indisponibilidade em vez de fabricar resultados.

`AuthSession` contém `user`, `accessToken` e `refreshToken` opcional. O estado de autenticação mantém o usuário em memória e persiste os tokens com `expo-secure-store`. Na inicialização, a aplicação tenta recuperar o usuário e, quando necessário, renovar a sessão. A saída limpa os tokens locais.

### Foto do perfil

`ProfileChanges.photoUri` pode ser uma URI local do dispositivo. O backend normalmente não consegue acessar essa URI: o adaptador precisa enviar o arquivo usando o mecanismo de upload definido pela API, aguardar a resposta e devolver ao frontend o perfil com uma URI remota utilizável. Não salve a URI local como se fosse URL permanente.

### Níveis: `LearningApi`

`listLevels(userId, accessToken)` retorna `LearningLevel[]`. Cada nível contém `id`, `title`, `description`, `progressPercent` (0–100), `locked` e `current`. A tela de níveis já trata carregamento, falha e lista vazia. A futura experiência de conteúdo/aulas pode ser conectada em uma etapa posterior; não existe contrato de aulas neste momento.

## Registro dos adaptadores

O ponto de entrada atual é `FrontEnd/App.tsx`, que monta `AuthProvider` e `PreferencesProvider`. Ao criar a camada HTTP, registre o adaptador uma vez antes de a árvore de telas ser montada. Exemplo estrutural (nomes ilustrativos, não são arquivos ou endpoints existentes):

```ts
// Importado no módulo de inicialização antes de montar AuthProvider
import { configureAuthApi } from './services/auth';
import { configureLearningApi } from './services/learning';
import { authAdapter } from './services/api/authAdapter';
import { learningAdapter } from './services/api/learningAdapter';

configureAuthApi(authAdapter);
configureLearningApi(learningAdapter);
```

Os imports de `authAdapter` e `learningAdapter` acima ilustram a organização possível; esses módulos precisam ser criados pelo trabalho de integração. As funções de configuração devem executar no início do app, antes de qualquer chamada de serviço. A estrutura recomendada é manter transporte HTTP, serialização e mapeamento de DTOs dentro dos adaptadores, deixando telas sem URLs ou detalhes de endpoint.

## Perfil, autorização e propriedade dos dados

O perfil usa o usuário e o token da sessão autenticada; as telas não oferecem seleção de outra conta. Apesar disso, enviar `userId` pelo cliente não é uma fronteira de segurança: o backend deve validar que o token pertence à conta solicitada (ou derivar a conta autenticada do próprio token), autorizar cada campo e impedir leitura ou alteração de dados de terceiros. Não confie em `userId` recebido do aplicativo sem essa checagem.

Mantenha as telas protegidas atrás do estado autenticado. Acessibilidade e consulta institucional permanecem públicas; o acesso a elas não deve criar sessão nem conceder acesso às abas protegidas.

## Preferências locais e recursos ainda sem serviço

`PreferencesContext` persiste em arquivo local as opções de tamanho do texto, alto contraste, tema claro/escuro e preferências de categorias de notificação. Essas preferências não pertencem ao contrato de conta e não são enviadas ao backend. A entrega real de notificações requer integração futura com serviço de notificações. A função de leitor de tela/TTS não foi implementada; o controle presente é apenas um ponto visual previsto nesta etapa. A área de Ajuda também aguarda conteúdo/serviço definido pelo projeto.

## Informações necessárias para concluir a conexão

Antes de implementar chamadas reais, obtenha da equipe do backend:

1. URL por ambiente (desenvolvimento/homologação/produção), política HTTPS e estratégia de configuração sem segredos embutidos no app.
2. Especificação dos endpoints, métodos, payloads, respostas, erros e códigos HTTP para cada método de `AuthApi` e `LearningApi`.
3. Regras de criação de conta pendente, disparo e validade do código, finalidade dos códigos, emissão/expiração do token de recuperação e validações de senha.
4. Formato e validade dos access/refresh tokens, renovação, revogação, expiração e comportamento esperado em falhas de rede.
5. Campos oficiais do perfil e níveis, regras de atualização, upload de foto, limites/tipos aceitos e formato da URL retornada.
6. Regras de autorização e titularidade dos dados, incluindo o registro do aceite dos documentos no cadastro conforme a política do projeto.

Sem essas definições, mantenha os pontos de integração preparados e não use dados de demonstração como se fossem reais.

## Sequência sugerida de integração

1. Validar os contratos do frontend com a especificação oficial da API.
2. Implementar cliente HTTP e adaptadores em `services/`, com tipos de DTO e mapeamento para os tipos públicos existentes.
3. Registrar `AuthApi` e `LearningApi` no início da aplicação.
4. Validar cadastro/verificação, login, restauração/renovação de sessão, edição de perfil, redefinição de senha, saída e níveis em ambiente de teste fornecido pelo backend.
5. Confirmar que erros, indisponibilidade de rede, token expirado, autorização e ausência de campos são tratados sem expor dados de outras contas.

Há um guia breve adicional em [`services/README.md`](./services/README.md).
