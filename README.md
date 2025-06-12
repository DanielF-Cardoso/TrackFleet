# TrackFleet

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

Sistema completo para gestão de frotas

---

## 🖥️ Backend

- **Tecnologias:** NestJS, Prisma, PostgreSQL, Docker
- **Arquitetura:** DDD (Domain-Driven Design), Clean Architecture
- **Testes:** Unitários e E2E com Vitest
- **Internacionalização (i18n):** Português, Espanhol e Inglês
- **Principais recursos:**
  - Autenticação JWT
  - Gerenciamento de gestores, motoristas, veículos e eventos
  - Recuperação de senha por e-mail
  - Logs e tratamento global de erros
  - Documentação automática com Swagger (em dev)
- **Pastas principais:**
  - `src/domain/` — Entidades e regras de negócio (DDD)
  - `src/application/` — Casos de uso e serviços de aplicação
  - `src/infra/` — Controllers, repositórios, providers, módulos de infraestrutura
  - `prisma/` — Migrations e schema do banco de dados
  - `test/` — Testes unitários e E2E

---

## 🌐 Frontend

- **Tecnologias:** React, Vite, Bootstrap, FontAwesome
- **Funcionalidades:**
  - Login e autenticação protegida
  - Dashboard com gráficos e tabelas
  - Gestão de gestores, motoristas, veículos e eventos
  - Recuperação de senha
  - Experiência responsiva e moderna
- **Pastas principais:**
  - `src/components/` — Componentes reutilizáveis
  - `src/features/` — Funcionalidades principais (Dashboard, Manager, Driver, etc)
  - `src/context/` — Contextos globais (ex: autenticação)
  - `src/services/` — Comunicação com a API
  - `src/styles/` — Estilos globais
