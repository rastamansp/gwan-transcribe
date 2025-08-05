# Fluxo da Aplicação - Gwan Transcribe

## Diagramas Mermaid

### 1. Fluxo Geral da Aplicação

```mermaid
graph TD
    A[Usuário Acessa transcribe.gwan.br] --> B[Página de Login]
    B --> C[Usuário Insere Email]
    C --> D[Sistema Gera OTP]
    D --> E[Email Enviado com Código]
    E --> F[Usuário Insere OTP]
    F --> G{OTP Válido?}
    G -->|Sim| H[Login Bem-sucedido]
    G -->|Não| I[Erro - Tentar Novamente]
    I --> F
    H --> J[Página de Conteúdo]
    J --> K[Usuário Faz Upload de Áudio]
    K --> L{Arquivo Válido?}
    L -->|Sim| M[Salvar no MinIO]
    L -->|Não| N[Erro - Arquivo Inválido]
    N --> K
    M --> O[Enviar para Fila RabbitMQ]
    O --> P[Worker Processa Transcrição]
    P --> Q[OpenAI Whisper - Modelo Base]
    Q --> R[Detectar Idioma]
    R --> S{Idioma Diferente do Selecionado?}
    S -->|Sim| T[OpenAI GPT - Tradução]
    S -->|Não| U[Salvar Resultado]
    T --> U
    U --> V[Enviar Email de Notificação]
    V --> W[Atualizar Status no Frontend]
    W --> X[Usuário Visualiza Resultado]
    X --> Y[Download da Transcrição]
```

### 2. Fluxo de Autenticação OTP

```mermaid
sequenceDiagram
    participant U as Usuário
    participant F as Frontend
    participant B as Backend
    participant E as Email Service
    participant DB as Database

    U->>F: Acessa página de login
    F->>U: Exibe formulário de email
    U->>F: Insere email
    F->>B: POST /auth/request-otp
    B->>DB: Verificar se usuário existe
    B->>DB: Criar/atualizar usuário
    B->>B: Gerar código OTP (123456)
    B->>E: Enviar email com OTP
    E->>U: Email recebido
    B->>F: Resposta: OTP enviado
    F->>U: Exibe mensagem de sucesso
    U->>F: Insere código OTP
    F->>B: POST /auth/verify-otp
    B->>DB: Validar OTP
    B->>B: Gerar JWT token
    B->>F: Resposta: Token JWT
    F->>U: Redireciona para página de conteúdo
```

### 3. Fluxo de Upload e Transcrição

```mermaid
sequenceDiagram
    participant U as Usuário
    participant F as Frontend
    participant B as Backend
    participant M as MinIO
    participant R as RabbitMQ
    participant W as Worker
    participant O as OpenAI
    participant DB as Database
    participant E as Email Service

    U->>F: Faz upload de arquivo (máx 20MB)
    F->>B: POST /transcription/upload
    B->>B: Validar arquivo
    B->>M: Salvar arquivo no bucket
    M->>B: Confirmação de upload
    B->>R: Enviar para fila de processamento
    B->>F: Resposta: ID da transcrição
    F->>U: Exibe status "Upload Concluído"
    
    R->>W: Worker consome da fila
    W->>O: OpenAI Whisper (modelo base)
    O->>W: Transcrição + idioma detectado
    W->>O: OpenAI GPT (se tradução necessária)
    O->>W: Tradução (se aplicável)
    W->>DB: Salvar resultado
    W->>E: Enviar email de notificação
    E->>U: Email de conclusão
    
    F->>B: Polling GET /transcription/:id/status
    B->>F: Status atualizado
    F->>U: Atualiza interface em tempo real
```

### 4. Arquitetura de Componentes

```mermaid
graph TB
    subgraph "Frontend (React + Material-UI)"
        A1[Login Component]
        A2[Upload Component]
        A3[Status Component]
        A4[Result Component]
        A5[Language Selector]
    end

    subgraph "Backend (NestJS)"
        B1[Auth Controller]
        B2[Transcription Controller]
        B3[User Controller]
        B4[Email Service]
        B5[OpenAI Service]
    end

    subgraph "Infrastructure"
        C1[PostgreSQL]
        C2[MinIO Storage]
        C3[RabbitMQ]
        C4[Redis Cache]
    end

    subgraph "External Services"
        D1[OpenAI Whisper]
        D2[OpenAI GPT]
        D3[SMTP Server]
    end

    A1 --> B1
    A2 --> B2
    A3 --> B2
    A4 --> B2
    A5 --> B1

    B1 --> C1
    B2 --> C2
    B2 --> C3
    B4 --> D3
    B5 --> D1
    B5 --> D2
```

### 5. Estados de Processamento

```mermaid
stateDiagram-v2
    [*] --> Upload
    Upload --> Validating
    Validating --> Queued
    Validating --> Error: Arquivo inválido
    Queued --> Processing
    Processing --> Detecting
    Detecting --> Transcribing
    Transcribing --> Translating: Se necessário
    Transcribing --> Completed: Sem tradução
    Translating --> Completed
    Completed --> [*]
    Error --> [*]
```

### 6. Fluxo de Dados

```mermaid
graph LR
    A[Arquivo de Áudio] --> B[Validação]
    B --> C[MinIO Storage]
    C --> D[RabbitMQ Queue]
    D --> E[Worker Process]
    E --> F[OpenAI Whisper]
    F --> G[Detecção de Idioma]
    G --> H{Tradução Necessária?}
    H -->|Sim| I[OpenAI GPT]
    H -->|Não| J[Resultado Final]
    I --> J
    J --> K[Database]
    J --> L[Email Notification]
    J --> M[Frontend Update]
```

### 7. Monitoramento de Custos

```mermaid
graph TD
    A[API Call] --> B[Log Service]
    B --> C[Cost Calculator]
    C --> D[Database Log]
    D --> E[Budget Check]
    E --> F{Budget OK?}
    F -->|Sim| G[Process Continue]
    F -->|Não| H[Alert/Block]
    G --> I[Update Metrics]
    H --> I
    I --> J[Monthly Report]
```

### 8. Fluxo de Notificações

```mermaid
sequenceDiagram
    participant W as Worker
    participant DB as Database
    participant E as Email Service
    participant S as SMTP
    participant U as Usuário

    W->>DB: Processamento concluído
    DB->>E: Trigger email notification
    E->>S: Enviar email
    S->>U: Email de conclusão
    U->>U: Verifica resultado no frontend
```

### 9. Estrutura de Filas

```mermaid
graph LR
    A[Upload Request] --> B[Transcription Queue]
    B --> C[Transcription Worker]
    C --> D[Translation Queue]
    D --> E[Translation Worker]
    E --> F[Notification Queue]
    F --> G[Email Worker]
```

### 10. Fluxo de Internacionalização

```mermaid
graph TD
    A[Usuário Seleciona Idioma] --> B[Frontend Update]
    B --> C[Load Translation JSON]
    C --> D[Update UI Components]
    D --> E[Save Preference]
    E --> F[Apply to All Pages]
```

---

## Resumo dos Fluxos

### **Autenticação**
1. Usuário acessa e insere email
2. Sistema gera OTP e envia por email
3. Usuário insere código e recebe JWT
4. Redirecionamento para página de conteúdo

### **Transcrição**
1. Upload de arquivo (máx 20MB)
2. Validação e salvamento no MinIO
3. Envio para fila RabbitMQ
4. Processamento assíncrono com OpenAI Whisper
5. Detecção de idioma e tradução se necessário
6. Notificação por email e atualização do frontend

### **Monitoramento**
1. Logs detalhados de todas as chamadas API
2. Controle de budget (R$ 100,00 mensal)
3. Métricas de uso e custos
4. Alertas quando próximo do limite

---

**Última atualização**: Agosto 2025  
**Versão**: 1.0 