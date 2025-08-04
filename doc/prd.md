# PRD - Product Requirements Document

## Gwan Transcribe

### 1. Visão Geral do Produto

#### 1.1 Objetivo

Sistema web de transcrição de áudio com autenticação OTP via email, permitindo aos usuários fazer upload de arquivos de áudio para transcrição automática com tradução quando necessário.

#### 1.2 Público-Alvo

- Profissionais que precisam transcrever áudios
- Empresas que necessitam de transcrições em lote
- Usuários que precisam de tradução automática de áudios
- Pesquisadores e estudantes

#### 1.3 Proposta de Valor

- Transcrição automática de alta qualidade
- Tradução automática integrada
- Autenticação simples via email
- Interface intuitiva e responsiva
- Histórico de transcrições
- Sem limites de tamanho de arquivo

### 2. Requisitos Funcionais

#### 2.1 Autenticação

- **RF001**: Sistema deve permitir login via email
- **RF002**: Sistema deve enviar código OTP por email
- **RF003**: Código OTP deve expirar em 30 minutos
- **RF004**: Usuário deve ter máximo 3 tentativas de OTP
- **RF005**: Sistema deve criar usuário automaticamente se não existir

#### 2.2 Upload de Áudio

- **RF006**: Sistema deve aceitar múltiplos formatos de áudio (MP3, WAV, M4A, AAC, FLAC)
- **RF007**: Sistema não deve ter limite de tamanho de arquivo
- **RF008**: Sistema deve validar integridade do arquivo
- **RF009**: Sistema deve exibir progresso do upload

#### 2.3 Transcrição

- **RF010**: Sistema deve transcrever áudio usando Azure OpenAI
- **RF011**: Sistema deve detectar idioma automaticamente
- **RF012**: Sistema deve processar transcrição de forma síncrona
- **RF013**: Sistema deve armazenar arquivo em MinIO bucket

#### 2.4 Tradução

- **RF014**: Sistema deve traduzir automaticamente quando idioma diferente do selecionado
- **RF015**: Sistema deve suportar inglês e português brasileiro
- **RF016**: Sistema deve usar OpenAI para tradução

#### 2.5 Histórico

- **RF017**: Sistema deve armazenar histórico de transcrições
- **RF018**: Sistema deve permitir busca por conteúdo
- **RF019**: Sistema deve permitir filtros por data
- **RF020**: Sistema deve exibir detalhes completos da transcrição

#### 2.6 Interface

- **RF021**: Sistema deve ser responsivo (desktop e mobile)
- **RF022**: Sistema deve ter interface intuitiva
- **RF023**: Sistema deve exibir status em tempo real
- **RF024**: Sistema deve permitir download de transcrições

### 3. Requisitos Não Funcionais

#### 3.1 Performance

- **RNF001**: Tempo de carregamento < 3 segundos
- **RNF002**: Tempo de processamento < 30 segundos
- **RNF003**: Disponibilidade > 99.9%
- **RNF004**: Taxa de erro < 1%

#### 3.2 Segurança

- **RNF005**: Autenticação OTP segura
- **RNF006**: Validação de entrada robusta
- **RNF007**: Proteção contra ataques comuns
- **RNF008**: Criptografia de dados sensíveis

#### 3.3 Escalabilidade

- **RNF009**: Sistema deve suportar múltiplos usuários simultâneos
- **RNF010**: Sistema deve ser escalável horizontalmente
- **RNF011**: Sistema deve usar filas para processamento assíncrono

#### 3.4 Usabilidade

- **RNF012**: Interface deve ser acessível (WCAG 2.1)
- **RNF013**: Sistema deve ter feedback claro para o usuário
- **RNF014**: Sistema deve ser intuitivo para novos usuários

### 4. Arquitetura Técnica

#### 4.1 Stack Tecnológica

- **Backend**: NestJS + TypeScript
- **Frontend**: React 18 + TypeScript + Vite
- **Database**: PostgreSQL + TypeORM
- **Storage**: MinIO bucket
- **Transcrição**: Azure OpenAI
- **Tradução**: OpenAI
- **Filas**: RabbitMQ
- **Package Manager**: pnpm
- **Containerização**: Docker (apenas para produção)
- **Orquestração**: Portainer (apenas para produção)

#### 4.2 Ambiente de Desenvolvimento

- **Desenvolvimento**: Direto no sistema (não Docker)
- **Banco de Dados**: PostgreSQL local via .env
- **Dependências Externas**: Variáveis do .env (Azure OpenAI já configuradas)
- **Estrutura**: Monorepo completo com pnpm workspaces
- **Node.js**: 20.11.0 (LTS)
- **Package Manager**: pnpm 10.14.0

#### 4.3 Infraestrutura

- **API**: api.transcribe.gwan.br
- **Frontend**: transcribe.gwan.br
- **Ambiente**: Servidor Portainer (apenas produção)
- **Dev**: Desenvolvimento local
- **Prod**: Docker Swarm/Kubernetes

#### 4.4 Padrões Arquiteturais

- **Clean Architecture** para backend
- **SOLID Principles** como base
- **Use Cases Pattern** para lógica de negócio
- **Monorepo** com pnpm workspaces

### 5. Estrutura de Dados

#### 5.1 Entidades Principais

```sql
-- Usuários
users (
  id, email, created_at, updated_at, 
  otp_attempts, otp_expires_at
)

-- Transcrições
transcriptions (
  id, user_id, file_url, original_filename,
  detected_language, selected_language,
  transcription_text, translation_text,
  file_size, duration, status,
  created_at, updated_at
)

-- Histórico de OTP
otp_history (
  id, user_id, code, expires_at,
  used, created_at
)
```

### 6. APIs

#### 6.1 Autenticação

- `POST /auth/request-otp` - Solicitar código OTP
- `POST /auth/validate-otp` - Validar código OTP
- `POST /auth/logout` - Logout do usuário

#### 6.2 Transcrição

- `POST /transcription/upload` - Upload de áudio
- `GET /transcription/:id` - Obter transcrição
- `GET /transcription/history` - Listar histórico
- `DELETE /transcription/:id` - Deletar transcrição

#### 6.3 Usuário

- `GET /user/profile` - Obter perfil
- `PUT /user/profile` - Atualizar perfil

### 7. Fluxo de Processamento

#### 7.1 Upload e Transcrição

1. Usuário faz upload do arquivo
2. Sistema valida arquivo e salva no MinIO
3. Sistema envia para fila RabbitMQ
4. Worker processa transcrição via Azure OpenAI
5. Sistema detecta idioma automaticamente
6. Sistema traduz se necessário via OpenAI
7. Sistema salva resultado no banco
8. Sistema notifica frontend via WebSocket

#### 7.2 Envio de Email

1. Sistema gera código OTP
2. Sistema envia para fila RabbitMQ
3. Worker de email processa fila
4. Sistema envia email via SMTP
5. Sistema registra tentativa no banco

### 8. Configuração de Ambiente

#### 8.1 Desenvolvimento

```yaml
# docker-compose.dev.yml
services:
  api:
    build: ./backend
    ports: ["3000:3000"]
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://user:pass@db:5432/gwan_dev
      - MINIO_ENDPOINT=minio:9000
      - RABBITMQ_URL=amqp://rabbitmq:5672
  
  frontend:
    build: ./frontend
    ports: ["5173:5173"]
    environment:
      - VITE_API_URL=http://localhost:3000
  
  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=gwan_dev
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
  
  minio:
    image: minio/minio
    ports: ["9000:9000", "9001:9001"]
    environment:
      - MINIO_ROOT_USER=admin
      - MINIO_ROOT_PASSWORD=password
  
  rabbitmq:
    image: rabbitmq:3-management
    ports: ["5672:5672", "15672:15672"]
```

#### 8.2 Produção

```yaml
# docker-compose.prod.yml
services:
  api:
    build: ./backend
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - MINIO_ENDPOINT=${MINIO_ENDPOINT}
      - RABBITMQ_URL=${RABBITMQ_URL}
    deploy:
      replicas: 3
  
  frontend:
    build: ./frontend
    environment:
      - VITE_API_URL=https://api.transcribe.gwan.br
    deploy:
      replicas: 2
```

### 9. Métricas e Monitoramento

#### 9.1 Métricas de Negócio

- Número de usuários ativos
- Volume de transcrições por dia
- Taxa de conversão (upload → transcrição)
- Tempo médio de processamento

#### 9.2 Métricas Técnicas

- Latência da API
- Taxa de erro
- Uso de recursos (CPU, RAM, Storage)
- Disponibilidade dos serviços

### 10. Cronograma de Desenvolvimento

#### 10.1 Fase 1: Configuração (1 semana)

- Setup do monorepo com pnpm
- Configuração do Docker
- Estrutura de pastas
- Configuração do banco PostgreSQL

#### 10.2 Fase 2: Backend Core (2 semanas)

- Implementação da autenticação OTP
- Configuração do TypeORM
- Integração com MinIO
- Configuração do RabbitMQ

#### 10.3 Fase 3: Integrações (2 semanas)

- Integração com Azure OpenAI
- Integração com OpenAI para tradução
- Sistema de filas para processamento
- Sistema de filas para email

#### 10.4 Fase 4: Frontend (2 semanas)

- Interface de autenticação OTP
- Componente de upload de áudio
- Dashboard de transcrições
- Histórico de transcrições

#### 10.5 Fase 5: Deploy e Polimento (1 semana)

- Configuração do Portainer
- Deploy em produção
- Testes de carga
- Otimizações finais

### 11. Riscos e Mitigações

#### 11.1 Riscos Técnicos

- **Risco**: Alta latência do Azure OpenAI
  - **Mitigação**: Implementar cache e processamento assíncrono

- **Risco**: Falha no envio de emails
  - **Mitigação**: Sistema de retry e filas

- **Risco**: Sobrecarga do banco de dados
  - **Mitigação**: Índices otimizados e paginação

#### 11.2 Riscos de Negócio

- **Risco**: Alto custo de processamento
  - **Mitigação**: Otimização de prompts e cache

- **Risco**: Baixa adoção
  - **Mitigação**: Interface intuitiva e onboarding

### 12. Critérios de Aceitação

#### 12.1 Funcionalidades Core

- [ ] Usuário consegue fazer login via OTP
- [ ] Usuário consegue fazer upload de áudio
- [ ] Sistema transcreve áudio corretamente
- [ ] Sistema traduz quando necessário
- [ ] Usuário consegue visualizar histórico

#### 12.2 Performance

- [ ] Tempo de carregamento < 3s
- [ ] Tempo de processamento < 30s
- [ ] Disponibilidade > 99.9%
- [ ] Suporte a 100 usuários simultâneos

#### 12.3 Segurança

- [ ] Autenticação OTP segura
- [ ] Validação de entrada robusta
- [ ] Proteção contra ataques
- [ ] Criptografia de dados

---

**Versão**: 1.0
**Data**: Dezembro 2024
**Autor**: Equipe de Desenvolvimento
