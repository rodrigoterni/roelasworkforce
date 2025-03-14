# RoelasWorkForce

Sistema de gestão de funcionários e folha de pagamento desenvolvido para atender às necessidades de empresas brasileiras.

## Funcionalidades

- Cadastro completo de funcionários com dados pessoais e bancários
- Gerenciamento de benefícios (seguro saúde, vale transporte, vale alimentação)
- Controle de turnos e horas trabalhadas
- Cálculo automático de adicionais para fins de semana e feriados
- Geração de folha de pagamento
- Relatórios e dashboards

## Tecnologias

- Next.js 14 com App Router
- TypeScript
- Prisma ORM
- PostgreSQL
- TailwindCSS

## Pré-requisitos

- Node.js 18+
- PostgreSQL

## Configuração Inicial

1. Clone o repositório
   ```bash
   git clone https://github.com/seu-usuario/roelas-workforce.git
   cd roelas-workforce
   ```

2. Instale as dependências
   ```bash
   npm install
   ```

3. Configure o banco de dados no arquivo `.env`
   ```
   DATABASE_URL="postgresql://usuario:senha@localhost:5432/roelasworkforce"
   ```

4. Execute as migrações do banco de dados
   ```bash
   npm run db:push
   ```

5. Inicie o servidor de desenvolvimento
   ```bash
   npm run dev
   ```

6. Acesse o sistema em `http://localhost:3000`

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Constrói a aplicação para produção
- `npm run start` - Inicia a aplicação em modo de produção
- `npm run lint` - Executa a verificação de linting
- `npm run db:push` - Aplica as alterações do esquema Prisma ao banco de dados
- `npm run db:studio` - Abre o Prisma Studio para visualizar e editar dados
- `npm run generate` - Gera o cliente Prisma

## Estrutura do Projeto

```
roelas-workforce/
├── app/                 # Diretório principal do App Router
│   ├── api/             # Rotas de API
│   ├── employees/       # Páginas de funcionários
│   ├── shifts/          # Páginas de turnos
│   └── payroll/         # Páginas de folha de pagamento
├── components/          # Componentes React reutilizáveis
├── lib/                 # Utilitários e configurações
├── prisma/              # Esquema e migrações do Prisma
│   └── schema.prisma    # Definição do esquema do banco de dados
├── public/              # Arquivos estáticos
└── styles/              # Estilos globais
```

## Licença

Este projeto está sob a licença [MIT](LICENSE).

---

Desenvolvido com ❤️ por Rodrigo Terni