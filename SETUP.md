# Guia de Configuração do RoelasWorkForce

Este guia fornece instruções detalhadas para configurar e iniciar o sistema RoelasWorkForce.

## Requisitos do Sistema

- Node.js 18+ (recomendado: Node.js 20)
- PostgreSQL 15+
- npm 10+

## Configuração do Banco de Dados

1. Instale o PostgreSQL se ainda não estiver instalado

2. Crie um banco de dados para o projeto:
   ```sql
   CREATE DATABASE roelasworkforce;
   ```

3. Crie um usuário e conceda permissões:
   ```sql
   CREATE USER roelas WITH ENCRYPTED PASSWORD 'sua_senha';
   GRANT ALL PRIVILEGES ON DATABASE roelasworkforce TO roelas;
   ```

4. Atualize o arquivo `.env` com as informações de conexão:
   ```
   DATABASE_URL="postgresql://roelas:sua_senha@localhost:5432/roelasworkforce"
   ```

## Configuração da Aplicação

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Gere o cliente Prisma:
   ```bash
   npm run generate
   ```

3. Sincronize o esquema do banco de dados:
   ```bash
   npm run db:push
   ```

## Desenvolvimento

1. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

2. Acesse a aplicação em:
   ```
   http://localhost:3000
   ```

3. Para acessar o Prisma Studio (interface visual para o banco de dados):
   ```bash
   npm run db:studio
   ```
   Acesse em `http://localhost:5555`

## Implantação em Produção

1. Compile a aplicação:
   ```bash
   npm run build
   ```

2. Inicie o servidor em modo de produção:
   ```bash
   npm run start
   ```

## Solução de Problemas

- **Erro de conexão com o banco de dados**: Verifique se as credenciais no arquivo `.env` estão corretas e se o PostgreSQL está em execução.

- **Erro ao executar migrações**: Certifique-se de que o usuário do banco de dados tem permissões suficientes.

- **Problemas com o Prisma**: Tente executar `npm run generate` para regenerar o cliente Prisma.

## Recursos Adicionais

- [Documentação do Next.js](https://nextjs.org/docs)
- [Documentação do Prisma](https://www.prisma.io/docs)
- [Documentação do TailwindCSS](https://tailwindcss.com/docs)