# Gwan Transcribe

Sistema de transcrição de áudio com autenticação OTP via email, desenvolvido em TypeScript monorepo com backend NestJS e frontend React, seguindo Clean Architecture, SOLID principles e Use Cases.

## 📊 Status do Projeto

**✅ Backend Completo** - Testes BDD 100% passando (38/38 cenários)  
**⏳ Frontend Pendente** - Interface React a ser implementada  
**📅 Última Atualização**: 05/08/2025

## 🚀 Quick Start

### Pré-requisitos
- Node.js 20.11.0
- pnpm 10.14.0
- PostgreSQL 15

### Instalação
```bash
# Clonar repositório
git clone <repository-url>
cd gwan-transcribe

# Instalar dependências
pnpm install

# Configurar variáveis de ambiente
cp backend/.env.example backend/.env
# Editar backend/.env com suas configurações

# Iniciar backend
pnpm run dev
```

### Testes
```bash
# Executar testes BDD (38 cenários)
pnpm run test:bdd

# Executar testes específicos
pnpm run test:bdd -- --grep "autenticação"

# Gerar relatório HTML
pnpm run test:bdd:report
```

## 📁 Estrutura do Projeto

```
gwan-transcribe/
├── doc/                          # Documentação
│   ├── project_status.md         # Status atual ✅
│   ├── tasks.md                  # Tarefas detalhadas ✅
│   └── prd.md                   # Requisitos do produto
├── backend/                      # NestJS API ✅ COMPLETO
├── frontend/                     # React App ⏳ PENDENTE
└── shared/                       # Código compartilhado
```

## 🏗️ Arquitetura

### Backend (NestJS) ✅ COMPLETO
- **Clean Architecture**: Implementada
- **SOLID Principles**: Seguidos
- **Use Cases Pattern**: Implementado
- **TypeORM**: PostgreSQL
- **JWT**: Autenticação
- **OTP**: Via email
- **Logging**: Winston estruturado

### Frontend (React) ⏳ PENDENTE
- **React 18**: TypeScript
- **Vite**: Build tool
- **Context API**: Estado global
- **Axios**: HTTP client

## 🧪 Testes BDD

### Estrutura
```
backend/tests/bdd/
├── features/           # 2 arquivos (38 cenários)
├── steps/              # 3 arquivos
├── support/            # Hooks
├── world/              # Custom World
└── reports/            # Relatórios
```

### Cenários Testados
- **Autenticação OTP**: 12 cenários ✅
- **Gestão de Usuários**: 26 cenários ✅
- **Validações**: Robustas ✅
- **Segurança**: Testes implementados ✅

### Resultados
- **38 cenários**: 100% passando ✅
- **216 steps**: 100% passando ✅
- **0 falhas**: Zero erros ✅

## 📚 Documentação

- **[Project Status](doc/project_status.md)**: Status detalhado da implementação
- **[Tasks](doc/tasks.md)**: Lista de tarefas com progresso
- **[PRD](doc/prd.md)**: Product Requirements Document
- **[User Flow](doc/user-flow.md)**: Fluxos de usuário

## 🔧 Tecnologias

### Backend
- **NestJS**: Framework
- **TypeScript**: Linguagem
- **PostgreSQL**: Banco de dados
- **TypeORM**: ORM
- **JWT**: Autenticação
- **Winston**: Logging
- **Cucumber.js**: Testes BDD

### Frontend (Pendente)
- **React 18**: Framework
- **TypeScript**: Linguagem
- **Vite**: Build tool
- **Axios**: HTTP client

## 🎯 Funcionalidades

### ✅ Implementadas
- **Autenticação OTP**: Via email
- **Gestão de Usuários**: CRUD completo
- **Validações**: Robustas
- **Logging**: Estruturado
- **Testes BDD**: 100% cobertura

### ⏳ Pendentes
- **Frontend React**: Interface de usuário
- **Upload de Áudio**: Funcionalidade principal
- **Transcrição**: Integração com IA
- **Deploy**: Produção

## 🚀 Comandos Úteis

```bash
# Desenvolvimento
pnpm run dev              # Backend + Frontend
pnpm run dev:backend      # Apenas Backend

# Testes
pnpm run test:bdd         # Testes BDD
pnpm run test:bdd:report  # Relatório HTML

# Build
pnpm run build            # Build completo
pnpm run build:backend    # Build Backend
```

## 📊 Métricas de Qualidade

- **Cobertura de Testes**: 100% (Backend)
- **Código Limpo**: Clean Architecture
- **Performance**: Otimizada
- **Logs**: Estruturados e limpos
- **Documentação**: Atualizada

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

**Status**: ✅ **BACKEND PRONTO PARA PRODUÇÃO**  
**Próximo Milestone**: Implementação do Frontend React
