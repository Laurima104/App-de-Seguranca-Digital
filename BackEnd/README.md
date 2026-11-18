# Backend e MySQL

Backend REST em Java 21 com Spring Boot 3.3.5, Spring Data JPA e MySQL Connector/J. A API fornece cadastro (`POST /usuarios`), login (`POST /login`), consulta e edição do perfil autenticado (`GET/PATCH /usuarios/me`), alteração de senha (`PUT /usuarios/me/senha`) e logout (`POST /logout`). O frontend chama os endpoints por `FrontEnd/services/httpAuthApi.ts`.

## Requisitos

- JDK 21;
- Apache Maven 3.8+;
- MySQL Server em execução;
- VS Code (opcional, para editar) ou outro editor Java.

## Preparar o MySQL

1. Abra MySQL Workbench ou o cliente `mysql` e execute [`../BancoDados/estrutura.sql`](../BancoDados/estrutura.sql).
2. No PowerShell que será usado para iniciar o backend, defina as credenciais:

   ```powershell
   $env:DB_USERNAME = "root"
   $env:DB_PASSWORD = "SUA_SENHA_DO_MYSQL"
   ```

   A URL padrão usa `localhost:3306/cyberseguranca`. Para alterar, defina `DB_URL`. Não salve a senha real em arquivo versionado.

O perfil atual usa `spring.jpa.hibernate.ddl-auto=update` para criar/ajustar as tabelas a partir das entidades em desenvolvimento. O banco vazio é o caminho recomendado. A senha gravada pelo cadastro é um hash BCrypt. Contas criadas antes dessa mudança com senha em texto puro não autenticarão; para dados de desenvolvimento, recrie as contas usando o cadastro. Não faça isso em banco com dados que precisa preservar sem preparar uma migração.

## Iniciar a API

Na raiz do repositório:

```powershell
cd .\BackEnd
mvn spring-boot:run
```

A API escuta em `http://localhost:8080` por padrão. `SERVER_PORT` pode alterar a porta.

## Conectar o Expo Go

Copie `.env.example` para `.env` na raiz do repositório e substitua o IP de exemplo pelo IPv4 local do computador:

```dotenv
EXPO_PUBLIC_API_URL=http://192.168.0.25:8080
```

O celular e o computador precisam estar na mesma rede. No firewall do Windows, permita conexões locais para a porta 8080. Depois, na raiz, rode `npm run start` e abra o QR code no Expo Go. Se o endereço mudar, atualize `.env` e reinicie o Metro.

## Sessões e endpoints autenticados

O login retorna `user` e um token aleatório de sessão. O backend armazena somente o hash SHA-256 do token na tabela `sessoes_usuario`, criada/atualizada pelo JPA em desenvolvimento. Envie o token em `Authorization: Bearer <accessToken>`. Perfil, alteração de senha e logout identificam a conta pela sessão autenticada e não aceitam um ID escolhido pelo cliente. A sessão expira em 30 dias. A edição de perfil persiste nome de exibição e nickname; a foto ainda não é persistida.

## Limites atuais da API

Verificação de e-mail, envio de código, recuperação de senha, renovação por refresh token, persistência remota de foto e API de níveis ainda não existem neste backend. O token atual é opaco, aleatório e armazenado somente como hash, mas não implementa renovação ou limitação de tentativas; avalie requisitos adicionais antes de produção.
