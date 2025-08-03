# Tarefas do Projeto - Gwan Transcribe

## Visão Geral

Este documento contém o detalhamento de todas as tarefas necessárias para o desenvolvimento do sistema de transcrição de áudio com autenticação OTP, organizadas por fases e com status de execução.

### Objetivo do Projeto

Sistema web que permite aos usuários fazer upload de arquivos de áudio para transcrição automática. O usuário acessa o sistema através de autenticação OTP via email, seleciona o idioma desejado (inglês ou português brasileiro), faz upload do áudio e recebe a transcrição com tradução automática quando necessário.

## Legenda de Status

- 🔴 **Não Iniciado**: Tarefa ainda não foi iniciada
- 🟡 **Em Andamento**: Tarefa está sendo executada
- 🟢 **Concluído**: Tarefa foi finalizada
- ⚠️ **Bloqueado**: Tarefa está bloqueada por dependência
- 🔄 **Revisão**: Tarefa concluída, aguardando revisão

## Fase 1: Configuração Inicial

### 1.1 Estrutura do Projeto

| Tarefa | Descrição | Responsável | Status | Prioridade | Estimativa |
|--------|-----------|-------------|--------|------------|------------|
| T1.1.1 | Criar estrutura de pastas do monorepo | Dev | 🟢 Concluído | Alta | 1h |
| T1.1.2 | Configurar package.json workspace | Dev | 🔴 Não Iniciado | Alta | 2h |
| T1.1.3 | Configurar TypeScript para monorepo | Dev | 🔴 Não Iniciado | Alta | 3h |
| T1.1.4 | Configurar ESLint e Prettier | Dev | 🔴 Não Iniciado | Média | 2h |
| T1.1.5 | Configurar Husky para git hooks | Dev | 🔴 Não Iniciado | Baixa | 1h |

### 1.2 Documentação

| Tarefa | Descrição | Responsável | Status | Prioridade | Estimativa |
|--------|-----------|-------------|--------|------------|------------|
| T1.2.1 | Criar .cursorrules | Dev | 🟢 Concluído | Alta | 4h |
| T1.2.2 | Criar project_status.md | Dev | 🟢 Concluído | Alta | 2h |
| T1.2.3 | Criar tasks.md | Dev | 🟢 Concluído | Alta | 3h |
| T1.2.4 | Criar README.md principal | Dev | 🔴 Não Iniciado | Alta | 2h |
| T1.2.5 | Documentar arquitetura | Dev | 🔴 Não Iniciado | Média | 4h |

## Fase 2: Backend Setup

### 2.1 Configuração NestJS

| Tarefa | Descrição | Responsável | Status | Prioridade | Estimativa |
|--------|-----------|-------------|--------|------------|------------|
| T2.1.1 | Instalar NestJS CLI | Dev | 🔴 Não Iniciado | Alta | 1h |
| T2.1.2 | Criar projeto NestJS | Dev | 🔴 Não Iniciado | Alta | 2h |
| T2.1.3 | Configurar TypeScript strict mode | Dev | 🔴 Não Iniciado | Alta | 1h |
| T2.1.4 | Configurar estrutura de pastas Clean Architecture | Dev | 🔴 Não Iniciado | Alta | 3h |
| T2.1.5 | Configurar validação com class-validator | Dev | 🔴 Não Iniciado | Média | 2h |

### 2.2 Módulo de Autenticação OTP

| Tarefa | Descrição | Responsável | Status | Prioridade | Estimativa |
|--------|-----------|-------------|--------|------------|------------|
| T2.2.1 | Criar entidade User | Dev | 🔴 Não Iniciado | Alta | 2h |
| T2.2.2 | Implementar Use Cases de autenticação OTP | Dev | 🔴 Não Iniciado | Alta | 6h |
| T2.2.3 | Implementar envio de email OTP | Dev | 🔴 Não Iniciado | Alta | 4h |
| T2.2.4 | Criar DTOs de autenticação OTP | Dev | 🔴 Não Iniciado | Média | 2h |
| T2.2.5 | Implementar AuthController com OTP | Dev | 🔴 Não Iniciado | Alta | 4h |
| T2.2.6 | Configurar expiração de 30min para OTP | Dev | 🔴 Não Iniciado | Alta | 2h |
| T2.2.7 | Implementar limite de 3 tentativas | Dev | 🔴 Não Iniciado | Alta | 2h |

### 2.3 Módulo de Usuários

| Tarefa | Descrição | Responsável | Status | Prioridade | Estimativa |
|--------|-----------|-------------|--------|------------|------------|
| T2.3.1 | Implementar Use Cases de usuário | Dev | 🔴 Não Iniciado | Alta | 4h |
| T2.3.2 | Criar UserController | Dev | 🔴 Não Iniciado | Média | 2h |
| T2.3.3 | Implementar validação de dados | Dev | 🔴 Não Iniciado | Média | 2h |
| T2.3.4 | Configurar middleware de autenticação | Dev | 🔴 Não Iniciado | Alta | 2h |

### 2.4 Banco de Dados

| Tarefa | Descrição | Responsável | Status | Prioridade | Estimativa |
|--------|-----------|-------------|--------|------------|------------|
| T2.4.1 | Escolher e configurar ORM | Dev | 🔴 Não Iniciado | Alta | 3h |
| T2.4.2 | Configurar conexão com banco | Dev | 🔴 Não Iniciado | Alta | 2h |
| T2.4.3 | Criar migrations iniciais | Dev | 🔴 Não Iniciado | Alta | 2h |
| T2.4.4 | Implementar repositories | Dev | 🔴 Não Iniciado | Alta | 4h |

### 2.5 Módulo de Transcrição

| Tarefa | Descrição | Responsável | Status | Prioridade | Estimativa |
|--------|-----------|-------------|--------|------------|------------|
| T2.5.1 | Criar entidade Transcription | Dev | 🔴 Não Iniciado | Alta | 2h |
| T2.5.2 | Implementar Use Cases de transcrição | Dev | 🔴 Não Iniciado | Alta | 6h |
| T2.5.3 | Integrar Azure OpenAI para transcrição | Dev | 🔴 Não Iniciado | Alta | 8h |
| T2.5.4 | Implementar processamento síncrono | Dev | 🔴 Não Iniciado | Alta | 4h |
| T2.5.5 | Criar TranscriptionController | Dev | 🔴 Não Iniciado | Média | 3h |
| T2.5.6 | Implementar detecção automática de idioma | Dev | 🔴 Não Iniciado | Alta | 4h |

### 2.6 Módulo de Tradução

| Tarefa | Descrição | Responsável | Status | Prioridade | Estimativa |
|--------|-----------|-------------|--------|------------|------------|
| T2.6.1 | Criar entidade Translation | Dev | 🔴 Não Iniciado | Alta | 2h |
| T2.6.2 | Implementar Use Cases de tradução | Dev | 🔴 Não Iniciado | Alta | 4h |
| T2.6.3 | Integrar OpenAI para tradução | Dev | 🔴 Não Iniciado | Alta | 6h |
| T2.6.4 | Implementar tradução automática | Dev | 🔴 Não Iniciado | Alta | 4h |
| T2.6.5 | Criar TranslationController | Dev | 🔴 Não Iniciado | Média | 3h |

### 2.7 Módulo de Storage

| Tarefa | Descrição | Responsável | Status | Prioridade | Estimativa |
|--------|-----------|-------------|--------|------------|------------|
| T2.7.1 | Configurar MinIO bucket | Dev | 🔴 Não Iniciado | Alta | 4h |
| T2.7.2 | Implementar upload de arquivos | Dev | 🔴 Não Iniciado | Alta | 6h |
| T2.7.3 | Implementar validação de formatos | Dev | 🔴 Não Iniciado | Média | 3h |
| T2.7.4 | Criar FileController | Dev | 🔴 Não Iniciado | Média | 3h |

### 2.8 Módulo de Histórico

| Tarefa | Descrição | Responsável | Status | Prioridade | Estimativa |
|--------|-----------|-------------|--------|------------|------------|
| T2.8.1 | Criar entidade History | Dev | 🔴 Não Iniciado | Alta | 2h |
| T2.8.2 | Implementar Use Cases de histórico | Dev | 🔴 Não Iniciado | Alta | 4h |
| T2.8.3 | Implementar listagem de transcrições | Dev | 🔴 Não Iniciado | Alta | 4h |
| T2.8.4 | Criar HistoryController | Dev | 🔴 Não Iniciado | Média | 3h |

### 2.9 Módulo de Filas

| Tarefa | Descrição | Responsável | Status | Prioridade | Estimativa |
|--------|-----------|-------------|--------|------------|------------|
| T2.9.1 | Configurar RabbitMQ | Dev | 🔴 Não Iniciado | Alta | 4h |
| T2.9.2 | Implementar fila de transcrição | Dev | 🔴 Não Iniciado | Alta | 6h |
| T2.9.3 | Implementar fila de email | Dev | 🔴 Não Iniciado | Alta | 4h |
| T2.9.4 | Criar workers para processamento | Dev | 🔴 Não Iniciado | Alta | 8h |
| T2.9.5 | Implementar retry e dead letter | Dev | 🔴 Não Iniciado | Média | 4h |

### 2.10 Módulo de Email

| Tarefa | Descrição | Responsável | Status | Prioridade | Estimativa |
|--------|-----------|-------------|--------|------------|------------|
| T2.10.1 | Configurar SMTP | Dev | 🔴 Não Iniciado | Alta | 3h |
| T2.10.2 | Implementar templates de email | Dev | 🔴 Não Iniciado | Alta | 4h |
| T2.10.3 | Implementar worker de email | Dev | 🔴 Não Iniciado | Alta | 4h |
| T2.10.4 | Configurar retry de emails | Dev | 🔴 Não Iniciado | Média | 3h |

## Fase 3: Frontend Setup

### 3.1 Configuração React

| Tarefa | Descrição | Responsável | Status | Prioridade | Estimativa |
|--------|-----------|-------------|--------|------------|------------|
| T3.1.1 | Criar projeto React com Vite | Dev | 🔴 Não Iniciado | Alta | 2h |
| T3.1.2 | Configurar TypeScript | Dev | 🔴 Não Iniciado | Alta | 1h |
| T3.1.3 | Configurar ESLint e Prettier | Dev | 🔴 Não Iniciado | Média | 2h |
| T3.1.4 | Configurar estrutura de pastas | Dev | 🔴 Não Iniciado | Alta | 2h |

### 3.2 Componentes de Autenticação OTP

| Tarefa | Descrição | Responsável | Status | Prioridade | Estimativa |
|--------|-----------|-------------|--------|------------|------------|
| T3.2.1 | Criar componente Login com email | Dev | 🔴 Não Iniciado | Alta | 4h |
| T3.2.2 | Criar componente validação OTP | Dev | 🔴 Não Iniciado | Alta | 6h |
| T3.2.3 | Implementar AuthContext com OTP | Dev | 🔴 Não Iniciado | Alta | 4h |
| T3.2.4 | Criar AuthGuard para sessão | Dev | 🔴 Não Iniciado | Média | 2h |
| T3.2.5 | Implementar contador de tentativas | Dev | 🔴 Não Iniciado | Média | 3h |
| T3.2.6 | Implementar timer de expiração OTP | Dev | 🔴 Não Iniciado | Média | 3h |

### 3.3 Layout e Navegação

| Tarefa | Descrição | Responsável | Status | Prioridade | Estimativa |
|--------|-----------|-------------|--------|------------|------------|
| T3.3.1 | Criar layout principal | Dev | 🔴 Não Iniciado | Alta | 3h |
| T3.3.2 | Implementar navegação | Dev | 🔴 Não Iniciado | Alta | 3h |
| T3.3.3 | Criar componentes de header/footer | Dev | 🔴 Não Iniciado | Média | 2h |
| T3.3.4 | Implementar responsividade | Dev | 🔴 Não Iniciado | Média | 4h |

### 3.4 Serviços de API

| Tarefa | Descrição | Responsável | Status | Prioridade | Estimativa |
|--------|-----------|-------------|--------|------------|------------|
| T3.4.1 | Configurar Axios | Dev | 🔴 Não Iniciado | Alta | 2h |
| T3.4.2 | Criar interceptors | Dev | 🔴 Não Iniciado | Alta | 2h |
| T3.4.3 | Implementar serviços de API | Dev | 🔴 Não Iniciado | Alta | 4h |
| T3.4.4 | Configurar error handling | Dev | 🔴 Não Iniciado | Média | 2h |

### 3.5 Componentes de Transcrição

| Tarefa | Descrição | Responsável | Status | Prioridade | Estimativa |
|--------|-----------|-------------|--------|------------|------------|
| T3.5.1 | Criar componente de upload de áudio | Dev | 🔴 Não Iniciado | Alta | 6h |
| T3.5.2 | Implementar validação de formatos | Dev | 🔴 Não Iniciado | Alta | 4h |
| T3.5.3 | Criar componente de processamento | Dev | 🔴 Não Iniciado | Alta | 4h |
| T3.5.4 | Implementar exibição de transcrição | Dev | 🔴 Não Iniciado | Alta | 6h |
| T3.5.5 | Criar componente de tradução | Dev | 🔴 Não Iniciado | Média | 4h |

### 3.6 Componentes de Histórico

| Tarefa | Descrição | Responsável | Status | Prioridade | Estimativa |
|--------|-----------|-------------|--------|------------|------------|
| T3.6.1 | Criar componente de lista de transcrições | Dev | 🔴 Não Iniciado | Alta | 6h |
| T3.6.2 | Implementar filtros por data | Dev | 🔴 Não Iniciado | Média | 3h |
| T3.6.3 | Implementar busca por conteúdo | Dev | 🔴 Não Iniciado | Média | 4h |
| T3.6.4 | Criar componente de detalhes | Dev | 🔴 Não Iniciado | Média | 4h |

### 3.7 Componentes de Idioma

| Tarefa | Descrição | Responsável | Status | Prioridade | Estimativa |
|--------|-----------|-------------|--------|------------|------------|
| T3.7.1 | Criar seletor de idioma | Dev | 🔴 Não Iniciado | Alta | 3h |
| T3.7.2 | Implementar detecção automática | Dev | 🔴 Não Iniciado | Alta | 4h |
| T3.7.3 | Criar indicador de idioma detectado | Dev | 🔴 Não Iniciado | Média | 2h |

## Fase 4: Integração e Funcionalidades Core

### 4.1 Integração Azure OpenAI

| Tarefa | Descrição | Responsável | Status | Prioridade | Estimativa |
|--------|-----------|-------------|--------|------------|------------|
| T4.1.1 | Configurar Azure OpenAI SDK | Dev | 🔴 Não Iniciado | Alta | 4h |
| T4.1.2 | Implementar transcrição de áudio | Dev | 🔴 Não Iniciado | Alta | 8h |
| T4.1.3 | Implementar detecção de idioma | Dev | 🔴 Não Iniciado | Alta | 6h |
| T4.1.4 | Implementar tradução automática | Dev | 🔴 Não Iniciado | Alta | 6h |
| T4.1.5 | Configurar processamento assíncrono | Dev | 🔴 Não Iniciado | Alta | 4h |

### 4.2 Integração MinIO

| Tarefa | Descrição | Responsável | Status | Prioridade | Estimativa |
|--------|-----------|-------------|--------|------------|------------|
| T4.2.1 | Configurar MinIO client | Dev | 🔴 Não Iniciado | Alta | 4h |
| T4.2.2 | Implementar upload de arquivos | Dev | 🔴 Não Iniciado | Alta | 6h |
| T4.2.3 | Implementar download de arquivos | Dev | 🔴 Não Iniciado | Média | 4h |
| T4.2.4 | Configurar políticas de retenção | Dev | 🔴 Não Iniciado | Média | 3h |

### 4.3 Integração Email

| Tarefa | Descrição | Responsável | Status | Prioridade | Estimativa |
|--------|-----------|-------------|--------|------------|------------|
| T4.3.1 | Configurar serviço de email | Dev | 🔴 Não Iniciado | Alta | 4h |
| T4.3.2 | Implementar template de email OTP | Dev | 🔴 Não Iniciado | Alta | 3h |
| T4.3.3 | Configurar fila de emails | Dev | 🔴 Não Iniciado | Média | 4h |
| T4.3.4 | Implementar retry de emails | Dev | 🔴 Não Iniciado | Média | 3h |

### 4.2 Componentes de Transcrição (Frontend)

| Tarefa | Descrição | Responsável | Status | Prioridade | Estimativa |
|--------|-----------|-------------|--------|------------|------------|
| T4.2.1 | Criar componente de upload | Dev | 🔴 Não Iniciado | Alta | 4h |
| T4.2.2 | Implementar visualização de transcrições | Dev | 🔴 Não Iniciado | Alta | 6h |
| T4.2.3 | Criar dashboard de transcrições | Dev | 🔴 Não Iniciado | Alta | 8h |
| T4.2.4 | Implementar filtros e busca | Dev | 🔴 Não Iniciado | Média | 4h |

### 4.3 Gestão de Arquivos

| Tarefa | Descrição | Responsável | Status | Prioridade | Estimativa |
|--------|-----------|-------------|--------|------------|------------|
| T4.3.1 | Implementar storage de arquivos | Dev | 🔴 Não Iniciado | Alta | 4h |
| T4.3.2 | Criar validação de tipos de arquivo | Dev | 🔴 Não Iniciado | Média | 2h |
| T4.3.3 | Implementar progress tracking | Dev | 🔴 Não Iniciado | Média | 3h |
| T4.3.4 | Criar sistema de limpeza automática | Dev | 🔴 Não Iniciado | Baixa | 2h |

## Fase 5: Docker e Containerização

### 5.1 Configuração Docker

| Tarefa | Descrição | Responsável | Status | Prioridade | Estimativa |
|--------|-----------|-------------|--------|------------|------------|
| T5.1.1 | Criar Dockerfile para backend | Dev | 🔴 Não Iniciado | Alta | 3h |
| T5.1.2 | Criar Dockerfile para frontend | Dev | 🔴 Não Iniciado | Alta | 3h |
| T5.1.3 | Configurar docker-compose.dev.yml | Dev | 🔴 Não Iniciado | Alta | 4h |
| T5.1.4 | Configurar docker-compose.prod.yml | Dev | 🔴 Não Iniciado | Alta | 4h |
| T5.1.5 | Configurar volumes e networks | Dev | 🔴 Não Iniciado | Média | 2h |

### 5.2 Configuração Portainer

| Tarefa | Descrição | Responsável | Status | Prioridade | Estimativa |
|--------|-----------|-------------|--------|------------|------------|
| T5.2.1 | Configurar Portainer | Dev | 🔴 Não Iniciado | Alta | 4h |
| T5.2.2 | Configurar stacks para produção | Dev | 🔴 Não Iniciado | Alta | 6h |
| T5.2.3 | Configurar domínios e SSL | Dev | 🔴 Não Iniciado | Alta | 4h |
| T5.2.4 | Configurar backup automático | Dev | 🔴 Não Iniciado | Média | 3h |

## Fase 6: Polimento e Deploy

### 6.1 Otimizações

| Tarefa | Descrição | Responsável | Status | Prioridade | Estimativa |
|--------|-----------|-------------|--------|------------|------------|
| T6.1.1 | Otimizar queries do banco | Dev | 🔴 Não Iniciado | Média | 4h |
| T6.1.2 | Implementar caching | Dev | 🔴 Não Iniciado | Média | 6h |
| T6.1.3 | Otimizar bundle do frontend | Dev | 🔴 Não Iniciado | Média | 3h |
| T6.1.4 | Implementar lazy loading | Dev | 🔴 Não Iniciado | Baixa | 4h |

### 6.2 Deploy e Infraestrutura

| Tarefa | Descrição | Responsável | Status | Prioridade | Estimativa |
|--------|-----------|-------------|--------|------------|------------|
| T6.2.1 | Configurar CI/CD | Dev | 🔴 Não Iniciado | Alta | 6h |
| T6.2.2 | Configurar monitoramento | Dev | 🔴 Não Iniciado | Baixa | 6h |
| T6.2.3 | Configurar logs centralizados | Dev | 🔴 Não Iniciado | Média | 4h |
| T6.2.4 | Configurar alertas | Dev | 🔴 Não Iniciado | Média | 3h |

### 6.3 Documentação Final

| Tarefa | Descrição | Responsável | Status | Prioridade | Estimativa |
|--------|-----------|-------------|--------|------------|------------|
| T6.3.1 | Documentar APIs | Dev | 🔴 Não Iniciado | Alta | 8h |
| T6.3.2 | Criar guias de deploy | Dev | 🔴 Não Iniciado | Média | 4h |
| T6.3.3 | Documentar arquitetura final | Dev | 🔴 Não Iniciado | Média | 6h |
| T6.3.4 | Criar documentação de usuário | Dev | 🔴 Não Iniciado | Baixa | 8h |

## Dependências Entre Tarefas

### Bloqueios Críticos

- T2.1.2 (Criar projeto NestJS) bloqueia T2.2.1 (Criar entidade User)
- T2.4.1 (Configurar ORM) bloqueia T2.4.4 (Implementar repositories)
- T3.1.1 (Criar projeto React) bloqueia T3.2.1 (Criar componente Login)
- T2.2.5 (AuthController) bloqueia T3.4.3 (Serviços de API)

### Dependências de Integração

- T2.2.5 (AuthController) + T3.4.3 (Serviços de API) = T3.2.1 (Login)
- T2.3.2 (UserController) + T3.4.3 (Serviços de API) = T3.3.1 (Layout)
- T4.1.5 (TranscriptionController) + T3.4.3 (Serviços de API) = T4.2.1 (Upload)

## Métricas de Progresso

### Total de Tarefas: 105

- **Concluídas**: 3 (2.9%)
- **Em Andamento**: 0 (0%)
- **Não Iniciadas**: 102 (97.1%)
- **Bloqueadas**: 0 (0%)

### Estimativa Total: 450 horas

- **Fase 1**: 15 horas
- **Fase 2**: 140 horas
- **Fase 3**: 85 horas
- **Fase 4**: 100 horas
- **Fase 5**: 80 horas
- **Fase 6**: 30 horas

## Próximas Ações

### Esta Semana

1. T1.1.2 - Configurar package.json workspace
2. T1.1.3 - Configurar TypeScript para monorepo
3. T2.1.1 - Instalar NestJS CLI
4. T2.1.2 - Criar projeto NestJS

### Próximas 2 Semanas

1. Completar Fase 1 (Configuração)
2. Iniciar Fase 2 (Backend Setup)
3. Implementar módulo de autenticação básico

## Notas Importantes

- **Não implementar testes unitários** conforme especificação
- Manter arquivos com máximo 200-300 linhas
- Seguir padrões estabelecidos no .cursorrules
- Documentar decisões arquiteturais
- Priorizar simplicidade e clareza

---

**Última atualização**: Dezembro 2024
**Próxima revisão**: Semanal
