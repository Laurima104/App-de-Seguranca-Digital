# Frontend — Aplicativo Educacional de Segurança Digital

Este diretório contém a aplicação mobile em React Native. As telas fazem parte do mesmo fluxo de navegação: abertura, autenticação e, após login, áreas protegidas do aplicativo. A camada de serviços já define contratos para conexão futura com a API; sem os adaptadores, operações que dependem de backend informam que o serviço ainda não está conectado.

## Telas e funções

### Entrada e conta

- **Splash (`SplashScreen`)**: apresenta a abertura por alguns segundos, restaura a sessão e encaminha para a área autenticada ou para o login.
- **Login (`Login`)**: valida os campos e oferece acesso a cadastro, recuperação de senha, acessibilidade, ajuda e informações institucionais. O login real depende da API.
- **Cadastro (`SignUpScreen`)**: coleta nome, apelido, e-mail, senha e aceite dos documentos; o fluxo segue para verificação do e-mail quando o serviço estiver integrado.
- **Esqueci a senha (`ForgotPasswordScreen`)**: solicita o envio de código para recuperação.
- **Verificação do e-mail (`EmailVerificationScreen`)**: recebe e valida o código de seis dígitos e permite solicitar reenvio.
- **Recuperar conta (`RecoverAccountScreen`)**: define uma nova senha usando o token de recuperação retornado pela verificação.
- **Cadastro concluído (`RegistrationCompleteScreen`)**: informa a conclusão do fluxo e retorna ao login.

### Área autenticada

A barra inferior só é exibida dentro da navegação protegida, depois que existe usuário autenticado.

- **Página inicial (`HomeScren`)**: usa os dados da conta para boas-vindas e progresso; permite continuar o nível atual ou abrir os níveis. Dados ausentes da API não são substituídos por dados fictícios.
- **Perfil (`ProfileScreen`)**: apresenta os dados da conta autenticada e permite editar nome, apelido e foto. A atualização passa pelo serviço associado à sessão atual.
- **Configurações (`SettingsScreen`)**: oferece preferências de notificações locais, acessibilidade, ajuda, sobre, alteração de senha e saída da conta. Notificações são preferências armazenadas; a entrega de notificações depende de integração futura.
- **Níveis (`LevelsScreen`)**: carrega a lista da API, com estados de carregamento, erro e lista vazia. A tela não inventa conteúdo de níveis ou aulas.

### Recursos públicos e institucionais

- **Acessibilidade (`AccessibilityScreen`)**: pode ser aberta sem login. Ajusta tamanho do texto, alto contraste e tema claro/escuro; as preferências são compartilhadas pelas telas e salvas localmente. O controle de leitor de tela está presente, mas sua função de leitura automática/TTS não está implementada nesta etapa.
- **Sobre (`AboutScreen`)**: disponibiliza os documentos institucionais.
- **Termo de Responsabilidade e Política de Privacidade (`LegalDocumentScreen`)**: apresenta o conteúdo fornecido nos documentos de referência em páginas adaptadas para leitura no celular.
- **Ajuda (`HelpScreen`)**: ponto de entrada visual previsto; o conteúdo/serviço de ajuda ainda não foi fornecido.

O acesso público à acessibilidade preserva o fluxo de autenticação: voltar à navegação protegida sem sessão leva ao login, sem expor as abas autenticadas. Os documentos institucionais também são acessíveis sem login.

## Tecnologias e ferramentas

- **React Native** para interface nativa multiplataforma e **React** para composição e estado dos componentes.
- **TypeScript** para telas (`.tsx`), rotas, contratos e estado (`.ts`).
- **Expo SDK 57** para execução e recursos do aplicativo; **Expo Go** pode ser usado para validação em dispositivo compatível.
- **Node.js e npm** para instalar dependências e executar scripts.
- **React Navigation 7** (`native-stack` e `bottom-tabs`) para navegação.
- **Expo SecureStore** para tokens de sessão; **Expo FileSystem** para preferências locais; **Expo ImagePicker** para escolher foto de perfil.
- **Expo Vector Icons / Ionicons** para ícones.
- **VS Code** como ambiente de desenvolvimento recomendado.

O padrão visual reutilizável está em `components/ui.tsx`: paleta roxo-escura, tema claro, alto contraste, tipografia, cartões, botões e estruturas comuns. As telas estão em `screens/`, rotas em `routes/`, estado compartilhado em `state/` e contratos de serviços em `services/`.

## Executar com Expo

Na pasta raiz do repositório (a que contém `package.json`):

```bash
npm install
npm run start
```

Leia o QR code com o Expo Go. Também estão disponíveis os scripts `npm run android`, `npm run ios`, `npm run web` e `npm run lint`, conforme o ambiente instalado.

## Limites atuais

Autenticação, cadastro, verificação, recuperação de senha, atualização remota de perfil e níveis já possuem contratos de integração, mas precisam de adaptadores conectados a um backend real. Não há conta de demonstração nem persistência remota simulada. O controle de leitor de tela e a área de ajuda são pontos preparados visualmente, ainda sem comportamento de leitura/serviço de conteúdo.

Consulte [`Realização da Integração.md`](./Realização%20da%20Integração.md) e [`services/README.md`](./services/README.md) para instruções de integração.
