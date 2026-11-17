# Integração da API de contas

As telas usam o contrato `AuthApi` definido em `auth.ts`. A implementação do backend deve fornecer um adaptador para:

- login e cadastro;
- envio e validação de códigos de e-mail;
- recuperação de senha;
- consulta do usuário autenticado e renovação/revogação de sessão;
- atualização de perfil.

O contrato de atualização aceita `displayName`, `nickname` e `photoUri`. Para a foto, o adaptador deve enviar o arquivo local ao backend e substituir a URI local pela URI remota retornada antes de concluir a atualização.

Depois de criar o adaptador, importe `configureAuthApi` e chame-o antes de montar `AuthProvider` em `App.tsx`. O adaptador é responsável por mapear os contratos da API real para os tipos do frontend. Nenhum endpoint foi presumido neste projeto.

O estado mantém o usuário autenticado em memória e persiste somente access/refresh tokens com `expo-secure-store`. O progresso, o perfil e os demais dados são sempre obtidos da API; não há conta ou progresso de demonstração.

`AuthenticatedUser` contém os campos opcionais de nível e estatísticas usados na página inicial e no perfil. Se o backend ainda não retornar esses campos, as telas exibem o estado de dados indisponíveis em vez de valores fictícios.

## Integração de níveis

`learning.ts` define `LearningApi.listLevels` para preencher a navegação de níveis a partir dos dados da conta. Chame `configureLearningApi` com o adaptador correspondente antes de abrir `LevelsScreen`. A tela apresenta estados de carregamento, erro e lista vazia sem fabricar níveis. O visualizador das aulas pertence à futura área de aprendizagem e poderá ser ligado ao selecionar um nível.
