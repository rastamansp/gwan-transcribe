#!/bin/bash

# Script de Build para Produção - Gwan Transcribe
# ⚠️ Execute este script no servidor de produção

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funções de log
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

warning() {
    echo -e "${YELLOW}[AVISO] $1${NC}"
}

error() {
    echo -e "${RED}[ERRO] $1${NC}"
    exit 1
}

# Verificar se está no diretório correto
if [ ! -f "package.json" ]; then
    error "Execute este script no diretório raiz do projeto (gwan-transcribe/)"
fi

# Verificar se Docker está rodando
if ! docker info > /dev/null 2>&1; then
    error "Docker não está rodando. Inicie o Docker e tente novamente."
fi

log "🚀 Iniciando build das imagens Docker para produção..."

# Build da API
log "📦 Buildando imagem da API..."
if docker build -f backend/Dockerfile.prod -t gwan-transcribe-api:latest ./backend; then
    log "✅ API buildada com sucesso!"
else
    error "❌ Falha no build da API"
fi

# Build do Worker
log "🔧 Buildando imagem do Worker..."
if docker build -f backend/Dockerfile.worker -t gwan-transcribe-worker:latest ./backend; then
    log "✅ Worker buildado com sucesso!"
else
    error "❌ Falha no build do Worker"
fi

# Build do Frontend
log "🌐 Buildando imagem do Frontend..."
if docker build -f frontend/Dockerfile.prod -t gwan-transcribe-frontend:latest ./frontend; then
    log "✅ Frontend buildado com sucesso!"
else
    error "❌ Falha no build do Frontend"
fi

# Listar imagens criadas
log "📋 Imagens Docker criadas:"
docker images | grep gwan-transcribe

# Criar rede se não existir
log "🌐 Verificando rede Docker..."
if ! docker network ls | grep -q "gwan-transcribe-prod"; then
    log "📡 Criando rede gwan-transcribe-prod..."
    docker network create --driver overlay --attachable gwan-transcribe-prod
    log "✅ Rede criada com sucesso!"
else
    log "✅ Rede gwan-transcribe-prod já existe"
fi

log "🎉 Build de produção concluído com sucesso!"
log ""
log "📋 Próximos passos:"
log "1. Acesse o Portainer"
log "2. Crie uma nova Stack"
log "3. Use o arquivo: portainer-stack-production.yml"
log "4. Configure as variáveis de ambiente"
log "5. Deploy a stack"
log ""
log "🌐 URLs de produção:"
log "   - Frontend: https://transcribe.gwan.com.br"
log "   - API: https://api.transcribe.gwan.com.br"
log ""
log "📚 Documentação completa: doc/portainer-deploy-guide.md"
