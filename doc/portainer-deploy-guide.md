# 🚀 Guia de Deploy no Portainer - Gwan Transcribe

## 📋 Pré-requisitos

### ✅ **Infraestrutura de Produção**
- **Portainer** rodando e acessível
- **PostgreSQL** configurado e acessível
- **MinIO** configurado e acessível  
- **RabbitMQ** configurado e acessível
- **Registro Docker** (se aplicável)

### ✅ **Arquivos Necessários**
- `backend/Dockerfile.prod` ✅
- `backend/Dockerfile.worker` ✅
- `frontend/Dockerfile.prod` ✅
- `frontend/nginx.conf` ✅
- `portainer-stack-production.yml` ✅

## 🏗️ **Passo 1: Build das Imagens Docker**

### **1.1 Build da API**
```bash
# No servidor de produção
cd /path/to/gwan-transcribe
docker build -f backend/Dockerfile.prod -t gwan-transcribe-api:latest ./backend
```

### **1.2 Build do Worker**
```bash
docker build -f backend/Dockerfile.worker -t gwan-transcribe-worker:latest ./backend
```

### **1.3 Build do Frontend**
```bash
docker build -f frontend/Dockerfile.prod -t gwan-transcribe-frontend:latest ./frontend
```

### **1.4 Tag para Registro (se aplicável)**
```bash
# Exemplo para registro local
docker tag gwan-transcribe-api:latest localhost:5000/gwan-transcribe-api:latest
docker tag gwan-transcribe-worker:latest localhost:5000/gwan-transcribe-worker:latest
docker tag gwan-transcribe-frontend:latest localhost:5000/gwan-transcribe-frontend:latest

# Push para o registro
docker push localhost:5000/gwan-transcribe-api:latest
docker push localhost:5000/gwan-transcribe-worker:latest
docker push localhost:5000/gwan-transcribe-frontend:latest
```

## 🐳 **Passo 2: Configuração do Portainer**

### **2.1 Criar Stack**
1. Acesse o **Portainer**
2. Vá em **Stacks** → **Add stack**
3. Nome: `gwan-transcribe-prod`
4. Copie o conteúdo do arquivo `portainer-stack-production.yml`

### **2.2 Variáveis de Ambiente**
Configure as seguintes variáveis no Portainer:

```env
# Banco de Dados
DATABASE_URL=postgresql://postgres:pazdedeus@postgres.gwan.com.br:5433/gwan_transcribe?sslmode=disable

# MinIO
MINIO_ENDPOINT=minio.gwan.com.br
MINIO_ACCESS_KEY=your_minio_access_key
MINIO_SECRET_KEY=your_minio_secret_key

# RabbitMQ
RABBITMQ_URL=amqp://root:pazdeDeus2025@rabbitmq.gwan.com.br:5672
RABBITMQ_USER=root
RABBITMQ_PASS=pazdeDeus2025

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# Azure OpenAI
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_API_KEY=your_azure_openai_api_key
OPENAI_API_KEY=your_openai_api_key
OPENAI_USE=true

# JWT
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random

# CORS
ALLOWED_ORIGINS=https://transcribe.gwan.com.br,https://www.transcribe.gwan.com.br
```

## 🌐 **Passo 3: Configuração de Rede**

### **3.1 Criar Rede Externa**
```bash
docker network create --driver overlay --attachable gwan-transcribe-prod
```

### **3.2 Configurar Traefik (se aplicável)**
```yaml
# Labels para Traefik
- "traefik.enable=true"
- "traefik.http.routers.api.rule=Host(`api.transcribe.gwan.com.br`)"
- "traefik.http.routers.frontend.rule=Host(`transcribe.gwan.com.br`)"
- "traefik.http.services.api.loadbalancer.server.port=3000"
- "traefik.http.services.frontend.loadbalancer.server.port=80"
```

## 📁 **Passo 4: Arquivo Stack do Portainer**

### **4.1 Conteúdo do Stack**
```yaml
version: '3.8'

services:
  # Backend API
  api:
    image: gwan-transcribe-api:latest
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - MINIO_ENDPOINT=${MINIO_ENDPOINT}
      - MINIO_ACCESS_KEY=${MINIO_ACCESS_KEY}
      - MINIO_SECRET_KEY=${MINIO_SECRET_KEY}
      - RABBITMQ_URL=${RABBITMQ_URL}
      - RABBITMQ_USER=${RABBITMQ_USER}
      - RABBITMQ_PASS=${RABBITMQ_PASS}
      - EMAIL_HOST=${EMAIL_HOST}
      - EMAIL_PORT=${EMAIL_PORT}
      - SMTP_USER=${SMTP_USER}
      - SMTP_PASSWORD=${SMTP_PASSWORD}
      - AZURE_OPENAI_ENDPOINT=${AZURE_OPENAI_ENDPOINT}
      - AZURE_OPENAI_API_KEY=${AZURE_OPENAI_API_KEY}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - OPENAI_USE=${OPENAI_USE}
      - JWT_SECRET=${JWT_SECRET}
      - ALLOWED_ORIGINS=${ALLOWED_ORIGINS}
    deploy:
      replicas: 3
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3
      resources:
        limits:
          memory: 1G
          cpus: '0.5'
        reservations:
          memory: 512M
          cpus: '0.25'
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/v1/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  # Frontend
  frontend:
    image: gwan-transcribe-frontend:latest
    environment:
      - VITE_API_URL=https://api.transcribe.gwan.com.br
      - VITE_APP_NAME=Gwan Transcribe
    deploy:
      replicas: 2
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3
      resources:
        limits:
          memory: 512M
          cpus: '0.25'
        reservations:
          memory: 256M
          cpus: '0.1'
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:80"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  # Worker de Transcrição
  worker:
    image: gwan-transcribe-worker:latest
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - MINIO_ENDPOINT=${MINIO_ENDPOINT}
      - MINIO_ACCESS_KEY=${MINIO_ACCESS_KEY}
      - MINIO_SECRET_KEY=${MINIO_SECRET_KEY}
      - RABBITMQ_URL=${RABBITMQ_URL}
      - RABBITMQ_USER=${RABBITMQ_USER}
      - RABBITMQ_PASS=${RABBITMQ_PASS}
      - AZURE_OPENAI_ENDPOINT=${AZURE_OPENAI_ENDPOINT}
      - AZURE_OPENAI_API_KEY=${AZURE_OPENAI_API_KEY}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - OPENAI_USE=${OPENAI_USE}
    deploy:
      replicas: 2
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3
      resources:
        limits:
          memory: 1G
          cpus: '0.5'
        reservations:
          memory: 512M
          cpus: '0.25'
    healthcheck:
      test: ["CMD", "pgrep", "-f", "worker.main.js"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

networks:
  default:
    external: true
    name: gwan-transcribe-prod
```

## 🔧 **Passo 5: Deploy e Verificação**

### **5.1 Deploy da Stack**
1. Clique em **Deploy the stack**
2. Aguarde a criação dos serviços
3. Verifique o status de cada serviço

### **5.2 Verificação de Funcionamento**
```bash
# Verificar logs da API
docker service logs gwan-transcribe-prod_api

# Verificar logs do Frontend
docker service logs gwan-transcribe-prod_frontend

# Verificar logs do Worker
docker service logs gwan-transcribe-prod_worker

# Verificar status dos serviços
docker service ls | grep gwan-transcribe
```

### **5.3 Testes de Conectividade**
```bash
# Testar API
curl -f https://api.transcribe.gwan.com.br/api/v1/health

# Testar Frontend
curl -f https://transcribe.gwan.com.br

# Verificar health checks
docker service ps gwan-transcribe-prod_api --format "table {{.Name}}\t{{.CurrentState}}\t{{.Error}}"
```

## 🌍 **Passo 6: Configuração de DNS**

### **6.1 Registros DNS**
Configure os seguintes registros:
```
api.transcribe.gwan.com.br  →  IP_DO_SERVIDOR
transcribe.gwan.com.br      →  IP_DO_SERVIDOR
```

### **6.2 SSL/TLS (se aplicável)**
- Configure certificados SSL para os domínios
- Use Traefik ou Nginx como reverse proxy
- Configure redirecionamento HTTP → HTTPS

## 📊 **Passo 7: Monitoramento**

### **7.1 Métricas do Portainer**
- **CPU/Memory** por serviço
- **Logs** em tempo real
- **Health checks** status
- **Replicas** ativas

### **7.2 Alertas Recomendados**
- CPU > 80%
- Memory > 80%
- Health check falhando
- Serviço não respondendo

## 🔍 **Troubleshooting**

### **Problemas Comuns**

#### **1. Serviço não inicia**
```bash
# Verificar logs detalhados
docker service logs gwan-transcribe-prod_api --tail 100

# Verificar variáveis de ambiente
docker service inspect gwan-transcribe-prod_api
```

#### **2. Erro de conexão com banco**
- Verificar `DATABASE_URL` no Portainer
- Confirmar conectividade de rede
- Verificar credenciais

#### **3. Erro de CORS**
- Verificar `ALLOWED_ORIGINS` no Portainer
- Confirmar domínios configurados
- Reiniciar serviço após mudança

#### **4. Worker não processa filas**
- Verificar conexão com RabbitMQ
- Confirmar credenciais
- Verificar logs do worker

## 📈 **Passo 8: Escalabilidade**

### **8.1 Ajustar Replicas**
```bash
# Aumentar replicas da API
docker service scale gwan-transcribe-prod_api=5

# Aumentar replicas do Worker
docker service scale gwan-transcribe-prod_worker=3

# Aumentar replicas do Frontend
docker service scale gwan-transcribe-prod_frontend=3
```

### **8.2 Recursos por Serviço**
- **API**: 1-2GB RAM, 0.5-1 CPU
- **Worker**: 1-2GB RAM, 0.5-1 CPU  
- **Frontend**: 256-512MB RAM, 0.1-0.25 CPU

## 🎯 **Checklist Final**

- [ ] **Imagens Docker** buildadas e testadas
- [ ] **Stack criado** no Portainer
- [ ] **Variáveis de ambiente** configuradas
- [ ] **Rede externa** criada
- [ ] **DNS** configurado
- [ ] **SSL/TLS** configurado (se aplicável)
- [ ] **Health checks** passando
- [ ] **Logs** sendo gerados
- [ ] **Monitoramento** configurado
- [ ] **Backup** configurado

## 🚀 **Próximos Passos**

1. **Testar** todas as funcionalidades em produção
2. **Configurar** backup automático
3. **Implementar** CI/CD pipeline
4. **Configurar** alertas de monitoramento
5. **Documentar** procedimentos de manutenção

---

**🎯 Status**: Guia de deploy no Portainer criado  
**📅 Última atualização**: 15/08/2025  
**👨‍💻 Suporte**: Equipe de DevOps Gwan
