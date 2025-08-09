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
- Limite de 20MB por arquivo

### 2. Requisitos Funcionais

#### 2.1 Autenticação

- **RF001**: Sistema deve permitir login via email
- **RF002**: Sistema deve enviar código OTP por email
- **RF003**: Código OTP deve expirar em 30 minutos
- **RF004**: Usuário deve ter máximo 3 tentativas de OTP
- **RF005**: Sistema deve criar usuário automaticamente se não existir
- **RF006**: Sistema deve implementar refresh automático de token JWT

#### 2.2 Upload de Áudio

- **RF007**: Sistema deve aceitar múltiplos formatos de áudio (MP3, WAV, M4A, AAC, FLAC)
- **RF008**: Sistema deve ter limite de 20MB por arquivo
- **RF009**: Sistema deve validar integridade do arquivo
- **RF010**: Sistema deve exibir progresso do upload
- **RF011**: Sistema deve implementar sanitização de dados de entrada

#### 2.3 Transcrição

- **RF012**: Sistema deve transcrever áudio usando OpenAI Whisper (modelo base)
- **RF013**: Sistema deve detectar idioma automaticamente
- **RF014**: Sistema deve processar transcrição via filas assíncronas
- **RF015**: Sistema deve armazenar arquivo em MinIO bucket
- **RF016**: Sistema deve implementar logs detalhados de uso da API

#### 2.4 Tradução

- **RF017**: Sistema deve traduzir automaticamente quando idioma diferente do selecionado
- **RF018**: Sistema deve suportar inglês e português brasileiro
- **RF019**: Sistema deve usar OpenAI GPT para tradução

#### 2.5 Interface

- **RF020**: Sistema deve ser responsivo (desktop e mobile)
- **RF021**: Sistema deve ter interface intuitiva
- **RF022**: Sistema deve exibir status em tempo real
- **RF023**: Sistema deve permitir download de transcrições
- **RF024**: Sistema deve suportar múltiplos idiomas (Português e Inglês)
- **RF025**: Sistema deve ter modo claro (sem modo escuro)
- **RF026**: Sistema deve mostrar progresso detalhado do processamento
- **RF027**: Sistema deve enviar notificações por email quando processamento terminar

### 3. Requisitos Não Funcionais

#### 3.1 Performance

- **RNF001**: Tempo de carregamento < 3 segundos
- **RNF002**: Tempo de processamento < 3 minutos (para arquivos de 20MB)
- **RNF003**: Disponibilidade > 99.9%
- **RNF004**: Taxa de erro < 1%

#### 3.2 Segurança

- **RNF005**: Autenticação OTP segura
- **RNF006**: Validação de entrada robusta
- **RNF007**: Proteção contra ataques comuns
- **RNF008**: Criptografia de dados sensíveis
- **RNF009**: Rate limiting nas rotas definidas
- **RNF010**: Proteção de rotas sensíveis via JWT

#### 3.3 Escalabilidade

- **RNF011**: Sistema deve suportar múltiplos usuários simultâneos
- **RNF012**: Sistema deve ser escalável horizontalmente
- **RNF013**: Sistema deve usar filas para processamento assíncrono

#### 3.4 Usabilidade

- **RNF014**: Interface deve ser intuitiva para novos usuários
- **RNF015**: Sistema deve ter feedback claro para o usuário

#### 3.5 Custos

- **RNF016**: Budget mensal limitado a R$ 100,00 para OpenAI API
- **RNF017**: Sistema deve implementar logs detalhados para monitoramento de custos

### 4. Arquitetura Técnica

#### 4.1 Stack Tecnológica

- **Backend**: NestJS + TypeScript
- **Frontend**: React 18 + TypeScript + Vite + Material-UI
- **Database**: PostgreSQL + TypeORM
- **Storage**: MinIO bucket (API gera URL pública via `MINIO_DOMAIN`; worker usa SDK MinIO para buckets privados) – implementado
- **Transcrição**: OpenAI Whisper (modelo base) – implementado no worker standalone
- **Tradução**: OpenAI GPT
- **Filas**: RabbitMQ (producer + consumer standalone) – implementado
- **Package Manager**: pnpm
- **Containerização**: Docker
- **Orquestração**: Portainer

#### 4.2 Ambiente de Desenvolvimento

- **Desenvolvimento**: Direto no sistema (não Docker)
- **Banco de Dados**: PostgreSQL local via .env
- **Dependências Externas**: Variáveis do .env (OpenAI já configuradas)
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
- **SPA** (Single Page Application) para frontend

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
  processing_stage, created_at, updated_at
)

-- Histórico de OTP
otp_history (
  id, user_id, code, expires_at,
  used, created_at
)

-- Logs de API
api_logs (
  id, user_id, endpoint, request_data,
  response_data, cost, duration,
  created_at
)
```

### 6. APIs

#### 6.1 Autenticação

- `POST /auth/request-otp` - Solicitar código OTP
- `POST /auth/validate-otp` - Validar código OTP
- `POST /auth/logout` - Logout do usuário

#### 6.2 Transcrição

- `POST /transcription/upload` - Upload de áudio (limite 20MB)
- `GET /transcription/:id` - Obter transcrição
- `GET /transcription/:id/status` - Obter status do processamento
- `DELETE /transcription/:id` - Deletar transcrição

#### 6.3 Usuário

- `GET /user/profile` - Obter perfil
- `PUT /user/profile` - Atualizar perfil

### 7. Fluxo de Processamento

#### 7.1 Upload e Transcrição

1. Usuário faz upload do arquivo (máximo 20MB)
2. Sistema valida arquivo e salva no MinIO (ou fallback local em dev)
3. Sistema envia para fila RabbitMQ
4. Worker processa transcrição com OpenAI Whisper (modelo base) e atualiza status; em erro, marca `ERROR` sem fallback simulado
5. Sistema detecta idioma automaticamente
6. Sistema traduz se necessário via OpenAI GPT
7. Sistema salva resultado no banco
8. Sistema envia email de notificação
9. Sistema retorna resultado para frontend

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
      - VITE_APP_NAME=Gwan Transcribe
      - VITE_DEFAULT_LANGUAGE=pt-BR
  
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
      - VITE_APP_NAME=Gwan Transcribe
      - VITE_DEFAULT_LANGUAGE=pt-BR
    deploy:
      replicas: 2
```

### 9. Variáveis de Ambiente

#### 9.1 Backend (.env)

```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/gwan_dev

# MinIO
MINIO_ENDPOINT=localhost:9000
MINIO_ACCESS_KEY=admin
MINIO_SECRET_KEY=password

# RabbitMQ
RABBITMQ_URL=amqp://localhost:5672
RABBITMQ_USER=admin
RABBITMQ_PASS=password

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=dev@gwan.br
EMAIL_PASS=password

# OpenAI
OPENAI_API_KEY=your-openai-api-key
OPENAI_ORGANIZATION=your-openai-organization-id

# JWT
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=24h

# Rate Limiting
RATE_LIMIT_WINDOW=15m
RATE_LIMIT_MAX=100

# Budget Control
OPENAI_BUDGET_LIMIT=100
OPENAI_BUDGET_CURRENCY=BRL
```

#### 9.2 Frontend (.env)

```env
# API Configuration
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=Gwan Transcribe

# Internationalization
VITE_DEFAULT_LANGUAGE=pt-BR
VITE_SUPPORTED_LANGUAGES=pt-BR,en-US

# File Upload
VITE_MAX_FILE_SIZE=20971520
VITE_ALLOWED_FILE_TYPES=audio/mp3,audio/wav,audio/m4a,audio/aac,audio/flac

# Security
VITE_RATE_LIMIT_ENABLED=true
VITE_RATE_LIMIT_MAX=10
VITE_RATE_LIMIT_WINDOW=60000
```

### 10. Cronograma de Desenvolvimento

#### 10.1 Fase 1: Frontend Básico (1 semana)

- Configurar React com Material-UI
- Implementar autenticação OTP
- Implementar upload de arquivos
- Implementar internacionalização

#### 10.2 Fase 2: Backend Transcrição (1 semana)

- Implementar módulo de transcrição
- Integrar com OpenAI Whisper
- Implementar filas RabbitMQ
- Implementar logs de API

#### 10.3 Fase 3: Integração (1 semana)

- Conectar frontend com backend
- Implementar status em tempo real
- Implementar notificações por email
- Testes de integração

#### 10.4 Fase 4: Deploy e Polimento (1 semana)

- Configurar Docker
- Deploy no Portainer
- Otimizações finais
- Monitoramento

### 11. Riscos e Mitigações

#### 11.1 Riscos Técnicos

- **Risco**: Alto custo da OpenAI API
  - **Mitigação**: Logs detalhados e monitoramento de custos

- **Risco**: Falha no envio de emails
  - **Mitigação**: Sistema de retry e filas

- **Risco**: Sobrecarga do banco de dados
  - **Mitigação**: Índices otimizados e paginação

#### 11.2 Riscos de Negócio

- **Risco**: Exceder budget de R$ 100,00
  - **Mitigação**: Monitoramento em tempo real e alertas

- **Risco**: Baixa adoção
  - **Mitigação**: Interface intuitiva e onboarding

### 12. Critérios de Aceitação

#### 12.1 Funcionalidades Core

- [ ] Usuário consegue fazer login via OTP
- [ ] Usuário consegue fazer upload de áudio (máximo 20MB)
- [ ] Sistema transcreve áudio corretamente
- [ ] Sistema traduz quando necessário
- [ ] Usuário consegue baixar transcrição

#### 12.2 Performance

- [ ] Tempo de carregamento < 3s
- [ ] Tempo de processamento < 3min
- [ ] Disponibilidade > 99.9%
- [ ] Suporte a 100 usuários simultâneos

#### 12.3 Segurança

- [ ] Autenticação OTP segura
- [ ] Validação de entrada robusta
- [ ] Proteção contra ataques
- [ ] Rate limiting implementado

#### 12.4 Custos

- [ ] Budget mensal < R$ 100,00
- [ ] Logs detalhados implementados
- [ ] Monitoramento de custos ativo

---

**Versão**: 2.2
**Data**: Agosto 2025
**Autor**: Equipe de Desenvolvimento
