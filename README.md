# Gwan Transcribe

Sistema de transcrição de áudio com autenticação OTP via email, desenvolvido com TypeScript, seguindo Clean Architecture, SOLID principles e Use Cases.

## 🎯 Objetivo do Projeto

Sistema web que permite aos usuários fazer upload de arquivos de áudio para transcrição automática. O usuário acessa o sistema através de autenticação OTP via email, seleciona o idioma desejado (inglês ou português brasileiro), faz upload do áudio e recebe a transcrição com tradução automática quando necessário.

## 📋 Documentação do Projeto

Toda a documentação detalhada do projeto está organizada na pasta `/doc`:

- **[📊 Status do Projeto](doc/project_status.md)** - Status atual de implementação e métricas de progresso
- **[📝 Tarefas Detalhadas](doc/tasks.md)** - Lista completa de tarefas com status de execução
- **[📋 PRD](doc/prd.md)** - Product Requirements Document completo
- **[👤 Fluxo do Usuário](doc/user-flow.md)** - Fluxo completo de autenticação e transcrição
- **[🐳 Docker Setup](doc/docker-setup.md)** - Configuração Docker e Portainer
- **[🏗️ Arquitetura](doc/architecture/)** - Documentação de arquitetura e decisões técnicas
- **[🔌 APIs](doc/api/)** - Documentação das APIs do backend
- **[🚀 Deploy](doc/deployment/)** - Guias de deploy e configuração de ambientes

## 🚀 Quick Start

### Pré-requisitos

- Node.js 18+
- npm 9+
- Git

### Instalação

```bash
# Clone o repositório
git clone <repository-url>
cd gwan-transcribe

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# Inicie o desenvolvimento
npm run dev
```

### Scripts Disponíveis

```bash
# Desenvolvimento completo (backend + frontend)
pnpm run dev

# Apenas backend
pnpm run dev:backend

# Apenas frontend
pnpm run dev:frontend

# Build para produção
pnpm run build

# Limpar builds
pnpm run clean

# Docker
docker-compose -f docker-compose.dev.yml up    # Desenvolvimento
docker-compose -f docker-compose.prod.yml up   # Produção
docker-compose down                             # Parar containers
```

## 🏗️ Arquitetura

### Backend (NestJS)

- **Clean Architecture** com separação clara de responsabilidades
- **SOLID Principles** como base de design
- **Use Cases Pattern** para lógica de negócio
- **TypeScript strict mode** para type safety
- **Autenticação OTP** via email (30min expiração, 3 tentativas)
- **Transcrição** via Azure OpenAI
- **Tradução** automática via OpenAI
- **Storage** em MinIO bucket

### Frontend (React)

- **React 18** com hooks funcionais
- **TypeScript** para type safety
- **Context API** para estado global
- **Axios** para comunicação com APIs
- **Upload de áudio** com múltiplos formatos
- **Interface OTP** para autenticação
- **Histórico** de transcrições
- **Seleção de idioma** (inglês/português)

### Estrutura do Monorepo

```
gwan-transcribe/
├── backend/          # Aplicação NestJS
├── frontend/         # Aplicação React
├── shared/           # Código compartilhado
└── doc/              # Documentação
```

## 🛠️ Tecnologias

### Backend

- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: OTP via email (30min, 3 tentativas)
- **Validation**: class-validator
- **Transcription**: Azure OpenAI
- **Translation**: OpenAI
- **Storage**: MinIO bucket
- **File Processing**: Processamento assíncrono via filas
- **Queue System**: RabbitMQ
- **Email System**: SMTP via filas

### Frontend

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **State Management**: Context API
- **HTTP Client**: Axios
- **File Upload**: Suporte a múltiplos formatos de áudio
- **Real-time**: Processamento síncrono com feedback

### Ferramentas

- **Package Manager**: pnpm (workspaces)
- **Linting**: ESLint + Prettier
- **Git Hooks**: Husky
- **Type Checking**: TypeScript strict mode
- **Containerização**: Docker
- **Orquestração**: Portainer
- **Sistema de Filas**: RabbitMQ

## 📁 Estrutura de Pastas

```
gwan-transcribe/
├── doc/                         # Documentação do projeto
│   ├── project_status.md        # Status de implementação
│   ├── tasks.md                 # Detalhamento de tarefas
│   └── architecture/            # Documentação de arquitetura
├── backend/                     # Aplicação NestJS
│   ├── src/
│   │   ├── modules/             # Módulos da aplicação
│   │   ├── shared/              # Código compartilhado
│   │   ├── infrastructure/      # Camada de infraestrutura
│   │   ├── application/         # Camada de aplicação (Use Cases)
│   │   └── domain/              # Camada de domínio
│   └── package.json
├── frontend/                    # Aplicação React
│   ├── src/
│   │   ├── components/          # Componentes React
│   │   ├── hooks/               # Custom hooks
│   │   ├── services/            # Serviços de API
│   │   ├── types/               # Tipos TypeScript
│   │   └── utils/               # Utilitários
│   └── package.json
├── shared/                      # Código compartilhado
│   ├── types/                   # Tipos compartilhados
│   └── utils/                   # Utilitários compartilhados
└── package.json                 # Package.json raiz (workspace)
```

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Backend
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/gwan_transcribe

# Azure OpenAI
AZURE_OPENAI_ENDPOINT=your-azure-openai-endpoint
AZURE_OPENAI_API_KEY=your-azure-openai-api-key

# MinIO Storage
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=your-minio-access-key
MINIO_SECRET_KEY=your-minio-secret-key
MINIO_BUCKET_NAME=gwan-transcribe-audio

# RabbitMQ
RABBITMQ_URL=amqp://localhost:5672
RABBITMQ_USER=admin
RABBITMQ_PASS=password

# Email Service
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password

# Frontend
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=Gwan Transcribe
```

### Banco de Dados

```bash
# Instalar PostgreSQL
# Criar banco de dados
createdb gwan_transcribe

# Executar migrations
npm run migration:run
```

## 🚀 Deploy

### Desenvolvimento

```bash
# Usando pnpm
pnpm run dev

# Usando Docker
docker-compose -f docker-compose.dev.yml up
```

### Produção

```bash
# Build das imagens
docker-compose -f docker-compose.prod.yml build

# Deploy no Portainer
# 1. Acesse o Portainer
# 2. Crie uma nova Stack
# 3. Use o arquivo portainer-stack.yml
# 4. Configure as variáveis de ambiente
```

### URLs de Produção

- **Frontend**: <https://transcribe.gwan.br>
- **API**: <https://api.transcribe.gwan.br>
- **Portainer**: Servidor Portainer

Para informações detalhadas sobre deploy, consulte a [documentação de deploy](doc/deployment/).

## 📚 Documentação Adicional

- **[Status do Projeto](doc/project_status.md)** - Métricas de progresso e status atual
- **[Tarefas Detalhadas](doc/tasks.md)** - Roadmap completo com estimativas
- **[Arquitetura](doc/architecture/)** - Decisões arquiteturais e padrões
- **[APIs](doc/api/)** - Documentação das APIs REST
- **[Deploy](doc/deployment/)** - Guias de configuração e deploy

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Padrões de Desenvolvimento

- Seguir as convenções estabelecidas no [.cursorrules](.cursorrules)
- Manter arquivos com máximo 200-300 linhas
- Implementar error handling robusto
- Documentar APIs e decisões arquiteturais
- **Não implementar testes unitários** (conforme especificação)

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Para dúvidas ou suporte:

- Consulte a [documentação](doc/)
- Abra uma [issue](https://github.com/your-repo/issues)
- Entre em contato com a equipe de desenvolvimento

---

**Desenvolvido com ❤️ seguindo Clean Architecture, SOLID principles e Use Cases**
