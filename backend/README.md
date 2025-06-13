# TrackFleet Backend

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![Vitest](https://img.shields.io/badge/vitest-%2338BDF8.svg?style=for-the-badge&logo=vitest&logoColor=white)
![i18n](https://img.shields.io/badge/i18n-multilanguage-blue?style=for-the-badge)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

## Sobre o Projeto

O backend do **TrackFleet** é uma API robusta para gestão de frotas, desenvolvida com **NestJS** e **TypeScript**, seguindo os princípios de **DDD (Domain-Driven Design)** e **Clean Architecture**.  
O projeto possui testes unitários e E2E, internacionalização (i18n) para português, espanhol e inglês, autenticação JWT, logging avançado, envio de e-mails, documentação automática via Swagger e integração com banco de dados PostgreSQL via Prisma.

## Principais Comandos

| Comando                | Descrição                                                      |
|------------------------|----------------------------------------------------------------|
| `npm run build`        | Compila o projeto para produção (`dist/`)                      |
| `npm run format`       | Formata o código com Prettier                                  |
| `npm run seed`         | Executa o seed do banco de dados                               |
| `npm run start`        | Inicia a aplicação                                             |
| `npm run start:dev`    | Inicia em modo desenvolvimento (hot reload)                    |
| `npm run start:debug`  | Inicia em modo debug                                           |
| `npm run start:prod`   | Inicia a aplicação já compilada                                |
| `npm run lint`         | Executa o ESLint para análise de código                        |
| `npm run test`         | Executa testes unitários com Vitest                            |
| `npm run test:watch`   | Executa testes unitários em modo watch                         |
| `npm run test:cov`     | Executa testes unitários com relatório de cobertura            |
| `npm run test:ui`      | Interface visual dos testes                                    |
| `npm run test:ui:coverage` | Interface visual dos testes com cobertura                  |
| `npm run test:e2e`     | Executa testes end-to-end                                      |
| `npm run test:debug`   | Executa testes em modo debug                                   |

## Funcionalidades

- **Gestão de gestores, motoristas, veículos e eventos**
- **Autenticação JWT**
- **Recuperação de senha por e-mail**
- **Internacionalização (i18n):** pt, es, en
- **Documentação automática (Swagger)**
- **Logs detalhados**
- **Testes unitários e E2E**
- **Arquitetura escalável e desacoplada**

## Como rodar

1. Instale as dependências:
   ```bash
   npm install
2. Configure o arquivo .env baseado no .env.example.
3. Suba os serviços necessários (Postgres) com Docker:
   ```bash
   docker-compose up -d
4. Rode as migrations do banco:
   ```bash
   npx prisma migrate dev
5. Popule o banco com dados iniciais:
   ```bash
   npm run seed
6. Inicie a aplicação:
   ```bash
   npm run start:dev

## Como rodar

1. Instale as dependências:
   ```bash
   npm install
2. Configure o arquivo .env baseado no .env.example.
3. Suba os serviços necessários (Postgres) com Docker:
   ```bash
   docker-compose up -d
4. Rode as migrations do banco:
   ```bash
   npx prisma migrate dev
5. Popule o banco com dados iniciais:
   ```bash
   npm run seed
6. Inicie a aplicação:
   ```bash
   npm run start:dev

## 📄 Documentação

A documentação da API é gerada automaticamente com **Swagger**.

Após iniciar o backend em ambiente de desenvolvimento, acesse:

http://seuip:porta/docs

> ℹ️ **Observação:** A rota de documentação (`/docs`) está disponível **apenas no ambiente de desenvolvimento**.

## 📚 Conteúdo da Documentação

A documentação inclui:

- ✅ Endpoints disponíveis
- 🧾 Parâmetros e exemplos de requisição/resposta
- 🌐 Mensagens de erro internacionalizadas (`pt`, `es`, `en`)
- 🔐 Autenticação via JWT
  
## 🧪 Testes

A aplicação conta com dois tipos de testes: **unitários** e **end-to-end (E2E)**.

✅ Testes Unitários

Executa os testes de unidades isoladas da aplicação.

```bash
npm run test
```

🚀 Testes End-to-End (E2E)

Executa os testes de ponta a ponta, simulando o fluxo completo da aplicação.

```bash
npm run test:e2e
