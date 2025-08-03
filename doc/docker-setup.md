# Docker Setup - Gwan Transcribe

## Visão Geral

Este documento descreve a configuração Docker para os ambientes de desenvolvimento e produção do projeto Gwan Transcribe.

## Estrutura de Arquivos Docker

```
gwan-transcribe/
├── docker-compose.dev.yml      # Ambiente de desenvolvimento
├── docker-compose.prod.yml     # Ambiente de produção
├── portainer-stack.yml         # Stack para Portainer
├── backend/
│   ├── Dockerfile.dev          # Dockerfile para desenvolvimento
│   └── Dockerfile.prod         # Dockerfile para produção
└── frontend/
    ├── Dockerfile.dev          # Dockerfile para desenvolvimento
    └── Dockerfile.prod         # Dockerfile para produção
```

## Ambiente de Desenvolvimento

### Serviços Incluídos

1. **API (Backend)**
   - Porta: 3000
   - Hot reload habilitado
   - Volumes montados para desenvolvimento

2. **Frontend**
   - Porta: 5173
   - Hot reload habilitado
   - Volumes montados para desenvolvimento

3. **PostgreSQL**
   - Porta: 5432
   - Database: gwan_dev
   - Usuário: user
   - Senha: pass

4. **MinIO**
   - Porta: 9000 (API)
   - Porta: 9001 (Console)
   - Usuário: admin
   - Senha: password

5. **RabbitMQ**
   - Porta: 5672 (AMQP)
   - Porta: 15672 (Management)
   - Usuário: admin
   - Senha: password

6. **MailHog**
   - Porta: 1025 (SMTP)
   - Porta: 8025 (Web UI)
   - Para testes de email

### Comandos de Desenvolvimento

```bash
# Iniciar ambiente completo
docker-compose -f docker-compose.dev.yml up

# Iniciar em background
docker-compose -f docker-compose.dev.yml up -d

# Parar todos os serviços
docker-compose -f docker-compose.dev.yml down

# Rebuild das imagens
docker-compose -f docker-compose.dev.yml build

# Ver logs
docker-compose -f docker-compose.dev.yml logs -f api

# Executar comandos no container
docker-compose -f docker-compose.dev.yml exec api pnpm run migration:run
```

### URLs de Desenvolvimento

- **Frontend**: <http://localhost:5173>
- **API**: <http://localhost:3000>
- **MinIO Console**: <http://localhost:9001>
- **RabbitMQ Management**: <http://localhost:15672>
- **MailHog**: <http://localhost:8025>

## Ambiente de Produção

### Serviços Incluídos

1. **API (Backend)**
   - 3 réplicas
   - Health checks
   - Resource limits

2. **Frontend**
   - 2 réplicas
   - Build otimizado
   - Nginx para servir arquivos

3. **Nginx**
   - Reverse proxy
   - SSL/TLS
   - Load balancing

### Comandos de Produção

```bash
# Build das imagens
docker-compose -f docker-compose.prod.yml build

# Deploy local
docker-compose -f docker-compose.prod.yml up -d

# Verificar status
docker-compose -f docker-compose.prod.yml ps

# Ver logs
docker-compose -f docker-compose.prod.yml logs -f
```

## Deploy no Portainer

### 1. Preparação

1. Acesse o Portainer
2. Crie uma nova Stack
3. Use o arquivo `portainer-stack.yml`
4. Configure as variáveis de ambiente

### 2. Variáveis de Ambiente

```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/gwan_prod

# MinIO
MINIO_ENDPOINT=your-minio-endpoint
MINIO_ACCESS_KEY=your-access-key
MINIO_SECRET_KEY=your-secret-key

# RabbitMQ
RABBITMQ_URL=amqp://host:5672
RABBITMQ_USER=admin
RABBITMQ_PASS=password

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-password

# Azure OpenAI
AZURE_OPENAI_ENDPOINT=your-azure-endpoint
AZURE_OPENAI_API_KEY=your-api-key
```

### 3. Deploy

1. **Criar Stack no Portainer**
   - Nome: `gwan-transcribe`
   - Arquivo: `portainer-stack.yml`
   - Variáveis: Configurar conforme acima

2. **Verificar Deploy**
   - Status dos containers
   - Health checks
   - Logs

3. **Configurar DNS**
   - `transcribe.gwan.br` → Frontend
   - `api.transcribe.gwan.br` → API

### 4. SSL/TLS

O Traefik configura automaticamente SSL usando Let's Encrypt:

- Certificados automáticos
- Renovação automática
- HTTP → HTTPS redirect

## Dockerfiles

### Backend - Desenvolvimento

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm

# Copiar package files
COPY package*.json pnpm-lock.yaml ./

# Instalar dependências
RUN pnpm install

# Copiar código
COPY . .

# Expor porta
EXPOSE 3000

# Comando de desenvolvimento
CMD ["pnpm", "run", "start:dev"]
```

### Backend - Produção

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm

# Copiar package files
COPY package*.json pnpm-lock.yaml ./

# Instalar dependências
RUN pnpm install --frozen-lockfile

# Copiar código
COPY . .

# Build da aplicação
RUN pnpm run build

# Imagem de produção
FROM node:18-alpine

WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm

# Copiar package files
COPY package*.json pnpm-lock.yaml ./

# Instalar apenas dependências de produção
RUN pnpm install --prod --frozen-lockfile

# Copiar build
COPY --from=builder /app/dist ./dist

# Expor porta
EXPOSE 3000

# Comando de produção
CMD ["pnpm", "run", "start:prod"]
```

### Frontend - Desenvolvimento

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm

# Copiar package files
COPY package*.json pnpm-lock.yaml ./

# Instalar dependências
RUN pnpm install

# Copiar código
COPY . .

# Expor porta
EXPOSE 5173

# Comando de desenvolvimento
CMD ["pnpm", "run", "dev", "--host"]
```

### Frontend - Produção

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm

# Copiar package files
COPY package*.json pnpm-lock.yaml ./

# Instalar dependências
RUN pnpm install --frozen-lockfile

# Copiar código
COPY . .

# Build da aplicação
RUN pnpm run build

# Imagem de produção com Nginx
FROM nginx:alpine

# Copiar build
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuração do Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Expor porta
EXPOSE 80

# Comando de produção
CMD ["nginx", "-g", "daemon off;"]
```

## Volumes e Networks

### Volumes

```yaml
volumes:
  postgres_data:    # Dados do PostgreSQL
  minio_data:       # Dados do MinIO
  rabbitmq_data:    # Dados do RabbitMQ
  traefik-certificates:  # Certificados SSL
```

### Networks

```yaml
networks:
  default:
    name: gwan-transcribe-dev    # Desenvolvimento
    name: gwan-transcribe-prod   # Produção
```

## Monitoramento

### Health Checks

Todos os serviços possuem health checks configurados:

- **API**: `curl -f http://localhost:3000/health`
- **Frontend**: `curl -f http://localhost:80`
- **Database**: `pg_isready -U user -d gwan_dev`
- **MinIO**: `curl -f http://localhost:9000/minio/health/live`
- **RabbitMQ**: `rabbitmq-diagnostics ping`

### Logs

```bash
# Ver logs de todos os serviços
docker-compose -f docker-compose.dev.yml logs -f

# Ver logs de um serviço específico
docker-compose -f docker-compose.dev.yml logs -f api

# Ver logs das últimas 100 linhas
docker-compose -f docker-compose.dev.yml logs --tail=100 api
```

## Troubleshooting

### Problemas Comuns

1. **Porta já em uso**

   ```bash
   # Verificar portas em uso
   netstat -tulpn | grep :3000
   
   # Parar serviço que está usando a porta
   sudo systemctl stop service-name
   ```

2. **Container não inicia**

   ```bash
   # Ver logs do container
   docker-compose -f docker-compose.dev.yml logs api
   
   # Rebuild da imagem
   docker-compose -f docker-compose.dev.yml build --no-cache api
   ```

3. **Problemas de permissão**

   ```bash
   # Corrigir permissões
   sudo chown -R $USER:$USER .
   ```

4. **Limpeza de recursos**

   ```bash
   # Parar e remover containers
   docker-compose -f docker-compose.dev.yml down
   
   # Remover volumes
   docker-compose -f docker-compose.dev.yml down -v
   
   # Remover imagens
   docker-compose -f docker-compose.dev.yml down --rmi all
   ```

### Comandos Úteis

```bash
# Ver status dos containers
docker-compose -f docker-compose.dev.yml ps

# Executar comando em container
docker-compose -f docker-compose.dev.yml exec api pnpm run migration:run

# Ver uso de recursos
docker stats

# Limpar recursos não utilizados
docker system prune -a
```

---

**Última atualização**: Dezembro 2024
**Versão**: 1.0
