# 🐳 Docker Local - Gwan Transcribe

## 🚀 Como Testar Localmente

### 1. Configurar Variáveis de Ambiente
Edite o arquivo `.env.local` com suas credenciais de produção:

```env
# Banco de Dados
DATABASE_URL=postgresql://username:password@host:5432/gwan_transcribe_prod

# MinIO
MINIO_ENDPOINT=minio.gwan.com.br
MINIO_ACCESS_KEY=your_minio_access_key
MINIO_SECRET_KEY=your_minio_secret_key

# RabbitMQ
RABBITMQ_URL=amqp://username:password@host:5672
RABBITMQ_USER=your_rabbitmq_user
RABBITMQ_PASS=your_rabbitmq_password

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Azure OpenAI
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_API_KEY=your_azure_openai_api_key
OPENAI_USE=true

# JWT
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
```

### 2. Executar os Containers

```bash
# Build e start
docker-compose -f docker-compose.prod.yml up --build -d

# Ver status
docker-compose -f docker-compose.prod.yml ps

# Ver logs
docker-compose -f docker-compose.prod.yml logs -f

# Parar
docker-compose -f docker-compose.prod.yml down
```

### 3. URLs de Teste

- **Frontend**: http://localhost:8080
- **API**: http://localhost:3000
- **Health Check**: http://localhost:3000/api/v1/health

### 4. Comandos Úteis

```bash
# Ver logs de um serviço específico
docker-compose -f docker-compose.prod.yml logs -f api
docker-compose -f docker-compose.prod.yml logs -f frontend
docker-compose -f docker-compose.prod.yml logs -f worker

# Reiniciar um serviço
docker-compose -f docker-compose.prod.yml restart api

# Rebuild um serviço
docker-compose -f docker-compose.prod.yml up --build -d api
```

## ⚠️ Importante

- Este setup **conecta nos serviços de produção** (PostgreSQL, MinIO, RabbitMQ)
- **Configure corretamente** o arquivo `.env.local` com credenciais reais
- **Não use** em produção - apenas para testes locais
- **Verifique** se tem acesso de rede aos serviços de produção

## 🔧 Troubleshooting

### Container não inicia
```bash
# Ver logs detalhados
docker-compose -f docker-compose.prod.yml logs api

# Verificar variáveis de ambiente
docker-compose -f docker-compose.prod.yml config
```

### Erro de conexão
- Verifique se as credenciais no `.env.local` estão corretas
- Confirme se tem acesso de rede aos serviços de produção
- Verifique se os hosts estão resolvendo corretamente

### Porta já em uso
```bash
# Verificar portas em uso
netstat -tlnp | grep :3000
netstat -tlnp | grep :8080
```
