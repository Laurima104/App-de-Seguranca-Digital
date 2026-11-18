# Banco de dados local

O backend utiliza **MySQL**. O schema inicial está em [`estrutura.sql`](./estrutura.sql): ele cria o banco `cyberseguranca` e a tabela `usuarios` usada pela entidade JPA.

## Criar o banco

1. Instale e inicie o servidor MySQL (MySQL Server 8.x recomendado para desenvolvimento) e abra o MySQL Workbench ou o cliente `mysql`.
2. Execute todo o arquivo `estrutura.sql`.
3. Configure `DB_USERNAME` e `DB_PASSWORD` no ambiente do processo que iniciará o Spring Boot. A URL padrão é `jdbc:mysql://localhost:3306/cyberseguranca`.
4. Inicie o backend. No perfil de desenvolvimento, `spring.jpa.hibernate.ddl-auto=update` cria/atualiza a tabela conforme as entidades.

No PowerShell, por exemplo, defina as credenciais na mesma janela antes de iniciar o backend:

```powershell
$env:DB_USERNAME = "root"
$env:DB_PASSWORD = "SUA_SENHA_DO_MYSQL"
```

Não coloque a senha real em arquivos versionados. Para produção, configure credenciais restritas, use HTTPS e migrações versionadas; não use `ddl-auto=update`.
