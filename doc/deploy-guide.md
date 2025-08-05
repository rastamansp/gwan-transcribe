# Guia de Deploy - Gwan Transcribe

## Visão Geral

Este guia descreve como fazer deploy da aplicação Gwan Transcribe no Portainer usando Docker Swarm.

## Pré-requisitos

### 1. Servidor com Portainer
- Portainer instalado e configurado
- Docker Swarm habilitado
- Acesso SSH ao servidor

### 2. Domínios Configurados
- `api.transcribe.gwan.br` - Backend API
- `transcribe.gwan.br` - Frontend
- `traefik.transcribe.gwan.br` - Traefik Dashboard (opcional)

### 3. Certificados SSL
- Certificados Let's Encrypt configurados
- Ou certificados próprios configurados

## Estrutura de Arquivos

```
gwan-transcribe/
├── docker-compose.yml             # Configuração principal
├── docker-compose.override.yml    # Overrides para desenvolvimento
├── portainer-stack.yml            # Stack para Portainer
├── env.example                    # Exemplo de variáveis de ambiente
├── backend/                       # Código do backend
├── frontend/                      # Código do frontend
└── doc/
    └── deploy-guide.md            # Este arquivo
```

## Configuração de Ambiente

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# ===========================================
# Database Configuration
# ===========================================
DATABASE_URL=postgresql://user:pass@db:5432/gwan_prod
POSTGRES_DB=gwan_prod
POSTGRES_USER=user
POSTGRES_PASSWORD=your-secure-password

# ===========================================
# MinIO Storage Configuration
# ===========================================
MINIO_ENDPOINT=minio:9000
MINIO_ACCESS_KEY=your-minio-access-key
MINIO_SECRET_KEY=your-minio-secret-key
MINIO_ROOT_USER=admin
MINIO_ROOT_PASSWORD=your-secure-minio-password

# ===========================================
# RabbitMQ Configuration
# ===========================================
RABBITMQ_URL=amqp://rabbitmq:5672
RABBITMQ_USER=admin
RABBITMQ_PASS=your-secure-rabbitmq-password
RABBITMQ_DEFAULT_USER=admin
RABBITMQ_DEFAULT_PASS=your-secure-rabbitmq-password

# ===========================================
# Email Configuration
# ===========================================
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# ===========================================
# OpenAI Configuration
# ===========================================
OPENAI_API_KEY=your-openai-api-key
OPENAI_ORGANIZATION=your-openai-organization-id

# ===========================================
# JWT Configuration
# ===========================================
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# ===========================================
# Rate Limiting Configuration
# ===========================================
RATE_LIMIT_WINDOW=15m
RATE_LIMIT_MAX=100

# ===========================================
# Frontend Configuration
# ===========================================
VITE_API_URL=https://api.transcribe.gwan.br
VITE_APP_NAME=Gwan Transcribe
VITE_DEFAULT_LANGUAGE=pt-BR
VITE_SUPPORTED_LANGUAGES=pt-BR,en-US
VITE_MAX_FILE_SIZE=20971520
VITE_ALLOWED_FILE_TYPES=audio/mp3,audio/wav,audio/m4a,audio/aac,audio/flac
VITE_RATE_LIMIT_ENABLED=true
VITE_RATE_LIMIT_MAX=10
VITE_RATE_LIMIT_WINDOW=60000
```

### 2. Configuração de Rede

Crie uma rede externa no Docker Swarm:

```bash
docker network create --driver overlay --attachable gwan-transcribe-prod
```

## Deploy no Portainer

### 1. Acesso ao Portainer

1. Acesse o Portainer no navegador
2. Faça login com suas credenciais
3. Navegue até "Stacks"

### 2. Criar Nova Stack

1. Clique em "Add stack"
2. Nome: `gwan-transcribe`
3. Método: "Web editor"
4. Cole o conteúdo do arquivo `portainer-stack.yml`

### 3. Configurar Variáveis

1. Na seção "Environment variables", adicione todas as variáveis do arquivo `.env`
2. Certifique-se de que os valores estão corretos para produção

### 4. Deploy

1. Clique em "Deploy the stack"
2. Aguarde a criação dos serviços
3. Verifique os logs de cada serviço

## Verificação do Deploy

### 1. Health Checks

Verifique se todos os serviços estão saudáveis:

```bash
# Verificar status dos serviços
docker service ls

# Verificar logs do backend
docker service logs gwan-transcribe_api

# Verificar logs do frontend
docker service logs gwan-transcribe_frontend
```

### 2. Testes de Conectividade

```bash
# Testar API
curl -f https://api.transcribe.gwan.br/api/v1/health

# Testar Frontend
curl -f https://transcribe.gwan.br

# Testar Traefik Dashboard
curl -f https://traefik.transcribe.gwan.br
```

### 3. Testes de Funcionalidade

1. **Autenticação OTP**:
   - Acesse `https://transcribe.gwan.br`
   - Teste o login com email
   - Verifique se o OTP é enviado

2. **Upload de Arquivo**:
   - Faça login no sistema
   - Teste upload de arquivo de áudio
   - Verifique se a transcrição funciona

## Monitoramento

### 1. Logs

```bash
# Ver logs em tempo real
docker service logs -f gwan-transcribe_api
docker service logs -f gwan-transcribe_frontend

# Ver logs de todos os serviços
docker service logs gwan-transcribe_traefik
docker service logs gwan-transcribe_db
docker service logs gwan-transcribe_minio
docker service logs gwan-transcribe_rabbitmq
```

### 2. Métricas

- **Portainer**: Use o dashboard do Portainer para monitorar recursos
- **Traefik**: Acesse `https://traefik.transcribe.gwan.br` para métricas
- **MinIO**: Acesse `http://localhost:9001` para console do MinIO
- **RabbitMQ**: Acesse `http://localhost:15672` para console do RabbitMQ

### 3. Alertas

Configure alertas para:
- Uso de CPU > 80%
- Uso de memória > 80%
- Uso de disco > 90%
- Falhas de health check

## Backup e Recuperação

### 1. Backup do Banco de Dados

```bash
# Backup do PostgreSQL
docker exec gwan-transcribe_db_1 pg_dump -U user gwan_prod > backup_$(date +%Y%m%d_%H%M%S).sql

# Restaurar backup
docker exec -i gwan-transcribe_db_1 psql -U user gwan_prod < backup_file.sql
```

### 2. Backup do MinIO

```bash
# Backup dos dados do MinIO
docker run --rm -v minio_data:/data -v $(pwd):/backup alpine tar czf /backup/minio_backup_$(date +%Y%m%d_%H%M%S).tar.gz -C /data .
```

### 3. Backup das Configurações

```bash
# Backup das variáveis de ambiente
cp .env backup_env_$(date +%Y%m%d_%H%M%S)

# Backup do stack
cp portainer-stack.yml backup_stack_$(date +%Y%m%d_%H%M%S).yml
```

## Troubleshooting

### 1. Problemas Comuns

#### Serviço não inicia
```bash
# Verificar logs
docker service logs gwan-transcribe_api

# Verificar variáveis de ambiente
docker service inspect gwan-transcribe_api
```

#### Problemas de conectividade
```bash
# Verificar rede
docker network ls
docker network inspect gwan-transcribe-prod

# Verificar DNS
docker exec gwan-transcribe_api_1 nslookup db
```

#### Problemas de certificados SSL
```bash
# Verificar certificados do Traefik
docker exec gwan-transcribe_traefik_1 ls -la /letsencrypt/

# Verificar logs do Traefik
docker service logs gwan-transcribe_traefik
```

### 2. Comandos Úteis

```bash
# Reiniciar serviço
docker service update --force gwan-transcribe_api

# Escalar serviço
docker service scale gwan-transcribe_api=3

# Ver recursos
docker stats

# Ver processos
docker service ps gwan-transcribe_api
```

## Atualizações

### 1. Atualizar Código

1. Faça push das alterações para o repositório
2. No Portainer, vá até a stack
3. Clique em "Update the stack"
4. Aguarde o deploy da nova versão

### 2. Rollback

Se algo der errado:

1. No Portainer, vá até a stack
2. Clique em "Redeploy the stack"
3. Selecione a versão anterior
4. Confirme o rollback

## Segurança

### 1. Firewall

Configure o firewall para permitir apenas:
- Porta 80 (HTTP)
- Porta 443 (HTTPS)
- Porta 22 (SSH)

### 2. Acesso SSH

```bash
# Configurar chaves SSH
ssh-copy-id user@server

# Desabilitar login por senha
sudo nano /etc/ssh/sshd_config
# PasswordAuthentication no
```

### 3. Monitoramento de Segurança

- Configure alertas para tentativas de login SSH
- Monitore logs de acesso
- Configure fail2ban se necessário

## Performance

### 1. Otimizações

- Configure limites de recursos no Docker
- Use volumes para dados persistentes
- Configure cache do Traefik
- Otimize queries do banco de dados

### 2. Escalabilidade

```bash
# Escalar serviços
docker service scale gwan-transcribe_api=3
docker service scale gwan-transcribe_frontend=2

# Verificar distribuição
docker service ps gwan-transcribe_api
```

---

**Última atualização**: Agosto 2025  
**Versão**: 1.1 