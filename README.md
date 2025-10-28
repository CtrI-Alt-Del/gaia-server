# Gaia Server

## 🧭 Índice

* ⚙️ [Visão Geral](#visao-geral)
* 🚀 [Principais Recursos](#principais-recursos)
* 🛠️ [Principais Tecnologias](#principais-tecnologias)
* 🧩 [Arquitetura em Alto Nível](#arquitetura-em-alto-nível)
* 🧱 [Requisitos](#requisitos)
* 🧾 [Configuração do Ambiente](#configuração-do-ambiente)
* 💻 [Execução Local](#execução-local)
* 🗄️ [Banco de Dados e Seeds](#banco-de-dados-e-seeds)
* 🧪 [Testes e Qualidade](#testes-e-qualidade)
* 🤖 [Pipelines CI/Deployment](#pipelines-cideployment)
* 📘 [Documentação da API](#documentação-da-api)
* 🗂️ [Estrutura de Pastas](#estrutura-de-pastas-resumo)
* 🔜 [Próximos Passos Sugeridos](#próximos-passos-sugeridos)

---

## ⚙️ Visao geral

Gaia Server é uma API NestJS que centraliza os domínios de telemetria, alertas e membership da plataforma Gaia.
O projeto expõe endpoints REST, filas de processamento assíncrono (Bull + Redis) e integra tanto com um banco relacional (PostgreSQL via Prisma) quanto com MongoDB para leituras brutas de telemetria.

## 🚀 Principais recursos

* **Telemetria**: cadastro e gestão de estações, parâmetros e leituras de sensores.
* **Alerting**: regras, alarmes e contagem de alertas com níveis de severidade configuráveis.
* **Membership**: controle de usuários, papéis e autenticação via Clerk.
* **Filas de processamento**: pipelines assíncronos para importação de leituras e verificação de alertas usando Bull/Redis.
* **Documentação integrada**: Swagger UI em `/swagger` e referência interativa via Scalar em `/docs`.

## 🛠️ Principais tecnologias

* **NestJS 11** como framework principal da API.
* **Node.js 20** e **TypeScript 5.7** como base do runtime e linguagem.
* **Prisma ORM** com **PostgreSQL** para persistência relacional.
* **MongoDB + Mongoose** para armazenamento das leituras brutas de telemetria.
* **Bull + Redis** para gerenciamento das filas e processamento assíncrono.
* **Clerk (Passport Strategy)** para autenticação e autorização.
* **Vitest** e **Biome** para testes e qualidade do código.

## 🧩 Arquitetura em alto nível

* Domínio orientado a DDD com camadas `core/*` (regras de negócio e casos de uso) e `infra/*` (adapters HTTP, filas, bancos, autenticação).
* Padrões adotados: Clean Architecture, Use Case Pattern, Repository Pattern e Value Objects.
* O documento `documentation/core-layer.md` detalha responsabilidades de cada domínio (global, telemetry, membership e alerting) e contém um diagrama de dados em `documentation/modelo de dados.png`.

## 🧱 Requisitos

* Node.js 20+ e npm 10+
* Docker e Docker Compose (opcional, recomendado para provisionar Postgres/Redis)
* PostgreSQL 16+ e Redis 7+ (locais ou via Docker)
* MongoDB 6+ para armazenamento das leituras brutas

## 🧾 Configuração do ambiente

1. Instale dependências:

   ```bash
   npm install
   ```
2. Duplique o arquivo de variáveis:

   ```bash
   cp .env.example .env
   ```
3. Ajuste os valores conforme a tabela abaixo:

| Variável                | Descrição                                                                       |
| ----------------------- | ------------------------------------------------------------------------------- |
| `PORT`                  | Porta HTTP usada pela API (padrão `3333`).                                      |
| `MODE`                  | Ambiente de execução (`dev`, `prod` ou `staging`).                              |
| `GAIA_PANEL_URL`        | URL pública do painel Gaia que consome esta API.                                |
| `POSTGRES_URL`          | String de conexão PostgreSQL (ex.: `postgres://user:pass@localhost:5433/gaia`). |
| `POSTGRES_DATABASE`     | Nome do banco usado para gerar containers via compose.                          |
| `POSTGRES_USER`         | Usuário PostgreSQL.                                                             |
| `POSTGRES_PASSWORD`     | Senha do usuário PostgreSQL.                                                    |
| `LOG_LEVEL`             | Nível de log (`debug` ou `info`).                                               |
| `REDIS_HOST`            | Host do Redis (padrão `localhost`).                                             |
| `REDIS_PORT`            | Porta do Redis (padrão `6379`).                                                 |
| `CLERK_PUBLISHABLE_KEY` | Chave pública do Clerk.                                                         |
| `CLERK_SECRET_KEY`      | Chave privada do Clerk usada pelo backend.                                      |
| `MONGO_URI`             | URI de conexão MongoDB com credenciais.                                         |

> 💡 **Observação:** o arquivo `.env.example` serve como base, mas a validação definitiva está em `src/infra/provision/env/env.ts`.

## 💻 Execução local

### Subindo dependências com Docker Compose

```bash
docker compose up -d
```

Isso disponibiliza PostgreSQL (porta 5433) e Redis (porta 6379).
Certifique-se de que o MongoDB esteja rodando separadamente ou ajuste a URI para o servidor que você utiliza.

### Rodando a API em modo desenvolvimento

```bash
npm run dev
```

A API ficará acessível em `http://localhost:3333`. O endpoint `GET /` retorna um health-check simples.

Para executar em modo produção:

```bash
npm run build
npm run prod
```

## 🗄️ Banco de dados e seeds

* `npm run db:generate` — gera o cliente Prisma a partir do schema.
* `npm run db:migrate` — aplica migrações locais (usa `src/infra/database/prisma/schema.prisma`).
* `npm run db:seed` — popula dados de exemplo (usuários, estações, parâmetros, medidas e alertas).
* `npm run db:reset` — recria o banco a partir das migrações.
* `npm run db:studio` — abre o Prisma Studio.

Quando `MODE=staging`, o seed é executado automaticamente durante o bootstrap da aplicação.

## 🧪 Testes e qualidade

* `npm run test` — executa a suíte unit/integration com Vitest.
* `npm run test:watch` — roda os testes em modo observação.
* `npm run test:cov` — gera relatório de cobertura.
* `npm run typecheck` — valida os tipos TypeScript.
* O projeto usa Biome para formatação/lint:

  ```bash
  npx biome check
  ```

## 🤖 Pipelines CI/Deployment

* **Continuous Integration (`ci.yaml`)** — dispara em pushes/PRs para `main` ou `production`. Valida regras de branch, executa build com geração do cliente Prisma, rodando `npm run build`, seguido por `npm run typecheck` e `npm run test`.
* **Staging Deployment (`staging-deployment.yaml`)** — a cada push na branch `main`, chama o workflow reutilizável `deployment.yaml` com `environment=dev`, gerando imagem Docker, publicando no ECR e atualizando o serviço ECS correspondente.
* **Production Deployment (`production-deployment.yaml`)** — similar ao de staging, mas disparado na branch `production` e com `environment=prod`, reutilizando o mesmo fluxo de build/publish/deploy.
* **deployment.yaml** — workflow reutilizável que: builda a imagem Docker, envia para o ECR com tags `sha` e `latest`, registra nova task definition no ECS e atualiza o serviço apontando para a revisão recém-criada.

## 📘 Documentação da API

* Swagger UI disponível em [`http://localhost:3333/swagger`](http://localhost:3333/swagger).
* Scalar API Reference em [`http://localhost:3333/docs`](http://localhost:3333/docs).
* Há coleções de requisições REST adicionais em `rest-client/` (VS Code REST Client).

## 🗂️ Estrutura de pastas (resumo)

```
src/
  core/           # domínios e casos de uso (negócio)
  infra/
    auth/         # integração com Clerk (Passport guards, decorators)
    database/     # Prisma (Postgres) e Mongoose (Mongo) + mappers
    queue/        # configuração Bull, jobs e schedulers
    rest/         # controllers HTTP e filtros
    provision/    # providers de ambiente e configurações
```

Os padrões de nomenclatura adotados estão descritos em `documentation/naming-guidelines.md`.

## 🔜 Próximos passos sugeridos

* Configure seus secrets do Clerk e da infraestrutura antes de subir em ambientes externos.
* Consulte os testes em `src/core/**/tests` como exemplos de uso das camadas de domínio.

---
