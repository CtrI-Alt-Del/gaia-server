# Domínios da Aplicação Gaia Server

## Visão Geral

A aplicação Gaia Server é organizada em quatro domínios principais, seguindo os
princípios de Domain-Driven Design (DDD). Cada domínio possui suas próprias
entidades, casos de uso, estruturas de valor e regras de negócio específicas.

## 1. Domínio Global (`core/global`)

**Responsabilidade**: Fornece estruturas e abstrações compartilhadas entre todos
os domínios.

### Componentes Principais:

- **Estruturas de Valor**: `Id`, `Text`, `Logical`, `Timestamp`, `Numeric`,
  `BigInteger`, `Collection`
- **Abstrações**: `Entity`, `Aggregate`, `UseCase`
- **Paginação**: `CursorPagination` para listagens eficientes
- **Tratamento de Erros**: Classes de exceção padronizadas
- **Interfaces**: Contratos para repositórios e casos de uso

### Características:

- Define o vocabulário comum da aplicação
- Implementa padrões arquiteturais reutilizáveis
- Fornece tipos de dados seguros e validados

## 2. Domínio de Telemetria (`core/telemetry`)

**Responsabilidade**: Gerencia estações meteorológicas, parâmetros de medição e
dados coletados.

### Entidades Principais:

- **Station**: Estações meteorológicas com localização geográfica
- **Parameter**: Parâmetros de medição (temperatura, umidade, pressão, etc.)
- **Measurement**: Medições realizadas pelas estações

### Casos de Uso:

- Criação e gerenciamento de estações
- Configuração de parâmetros de medição
- Ativação/desativação de estações e parâmetros
- Listagem paginada de estações e parâmetros
- Atualização de dados de estações

### Características:

- Gerencia dados geográficos (coordenadas, endereços)
- Controla quais parâmetros cada estação pode medir
- Implementa validações de integridade dos dados

## 3. Domínio de Membership (`core/membership`)

**Responsabilidade**: Gerencia usuários, perfis e controle de acesso do sistema.

### Entidades Principais:

- **User**: Usuários do sistema com diferentes níveis de acesso
- **Role**: Papéis de usuário (owner, member)

### Casos de Uso:

- Criação de usuários
- Ativação/desativação de contas
- Atualização de dados de usuários
- Listagem paginada de usuários
- Controle de permissões

### Características:

- Sistema de roles para controle de acesso
- Validação de unicidade de email
- Prevenção de criação de usuários owner
- Gerenciamento de estado ativo/inativo

## 4. Domínio de Alerting (`core/alerting`)

**Responsabilidade**: Sistema de alertas e notificações baseado em regras e
medições.

### Entidades Principais:

- **Alarm**: Alertas gerados pelo sistema
- **AlertRule**: Regras que definem quando um alerta deve ser disparado
- **MeasurementAggregate**: Agregação de dados de medição para análise

### Estruturas de Valor:

- **AlarmLevel**: Níveis de severidade (WARNING, CRITICAL)
- **Operation**: Operadores de comparação (BIGGER, LESS, EQUAL, etc.)

### Características:

- Sistema de regras configuráveis
- Diferentes níveis de severidade
- Agregação de dados para análise
- Controle de estado ativo/inativo dos alertas

## Arquitetura e Padrões

### Princípios Aplicados:

- **Separation of Concerns**: Cada domínio tem responsabilidades bem definidas
- **Domain-Driven Design**: Estrutura baseada no modelo de negócio
- **Clean Architecture**: Separação clara entre camadas
- **SOLID Principles**: Código modular e extensível

### Padrões de Design:

- **Repository Pattern**: Para acesso a dados
- **Use Case Pattern**: Para lógica de negócio
- **Value Objects**: Para tipos de dados seguros
- **Aggregate Pattern**: Para consistência de dados

## Fluxo de Dados

1. **Telemetria** coleta dados das estações
2. **Alerting** analisa os dados e gera alertas conforme regras
3. **Membership** controla quem pode acessar e gerenciar os dados
4. **Global** fornece infraestrutura comum para todos os domínios

## Considerações de Escalabilidade

- Paginação baseada em cursor para listagens eficientes
- Agregação de dados para otimizar consultas
- Separação de responsabilidades facilita manutenção
- Estruturas de valor imutáveis garantem consistência
- Interfaces bem definidas permitem substituição de implementações
