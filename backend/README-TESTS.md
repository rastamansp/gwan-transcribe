# Testes HTTP - Gwan Transcribe Backend

Este documento contém instruções para testar o backend usando o arquivo `http-tests.http`.

## 📋 Pré-requisitos

### 1. Extensão REST Client
Instale a extensão "REST Client" no VS Code:
- Abra o VS Code
- Vá para Extensions (Ctrl+Shift+X)
- Procure por "REST Client"
- Instale a extensão de Huachao Mao

### 2. Backend Rodando
Certifique-se de que o backend está rodando:
```bash
cd backend
pnpm run start:dev
```

O servidor deve estar disponível em: `http://localhost:3000`

## 🚀 Como Usar

### 1. Abrir o Arquivo de Testes
- Abra o arquivo `backend/http-tests.http` no VS Code
- Você verá botões "Send Request" acima de cada requisição

### 2. Executar Testes
- Clique em "Send Request" para executar uma requisição
- A resposta aparecerá em uma nova aba
- Use Ctrl+Shift+P e digite "REST Client: Show Response" para ver todas as respostas

### 3. Ordem Recomendada
1. **Health Check** - Verificar se o servidor está funcionando
2. **Request OTP** - Solicitar código de verificação
3. **Verify OTP** - Usar o código retornado para verificar
4. **Testes de Erro** - Verificar validações
5. **Testes de Segurança** - Verificar proteções

## 📊 Tipos de Testes

### ✅ Testes de Funcionalidade
- **Health Check**: Verifica se o servidor está online
- **Request OTP**: Testa solicitação de código
- **Verify OTP**: Testa verificação de código
- **Validações**: Testa regras de negócio

### 🔒 Testes de Segurança
- **SQL Injection**: Tenta injeção de SQL
- **XSS**: Tenta cross-site scripting
- **Validação de Entrada**: Testa dados malformados

### ⚡ Testes de Performance
- **Múltiplos Usuários**: Testa concorrência
- **Stress Test**: Múltiplas requisições
- **Dados Grandes**: Testa limites de tamanho

### 🛡️ Testes de Configuração
- **Content-Type**: Testa diferentes tipos de conteúdo
- **Endpoints Inexistentes**: Testa tratamento de erros
- **Métodos HTTP**: Testa métodos não permitidos

## 📝 Exemplos de Respostas Esperadas

### Health Check - Sucesso
```json
{
  "status": "ok",
  "info": {
    "database": {
      "status": "up"
    }
  },
  "error": {},
  "details": {
    "database": {
      "status": "up"
    }
  }
}
```

### Request OTP - Sucesso
```json
{
  "success": true,
  "message": "Código de verificação enviado para teste@example.com",
  "debugCode": "123456"
}
```

### Request OTP - Erro de Validação
```json
{
  "statusCode": 400,
  "message": [
    "email must be an email"
  ],
  "error": "Bad Request"
}
```

### Verify OTP - Sucesso
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "teste@example.com",
    "name": "Usuário Teste"
  }
}
```

### Verify OTP - Código Inválido
```json
{
  "statusCode": 401,
  "message": "Código inválido",
  "error": "Unauthorized"
}
```

## 🔍 Monitoramento Durante os Testes

### 1. Logs do Backend
Observe os logs no terminal onde o backend está rodando:
```bash
[Nest] 12345 - 04/08/2025, 19:30:15 LOG [RequestOTPUseCase] Solicitação de OTP iniciada para teste@example.com
[Nest] 12345 - 04/08/2025, 19:30:15 LOG [RequestOTPUseCase] Código OTP gerado: 123456
[Nest] 12345 - 04/08/2025, 19:30:15 LOG [RequestOTPUseCase] Email enviado com sucesso para teste@example.com
```

### 2. Banco de Dados
Verifique as tabelas no PostgreSQL:
```sql
-- Verificar usuários criados
SELECT * FROM users;

-- Verificar OTPs gerados
SELECT * FROM otps;
```

### 3. Arquivos de Log
Verifique os arquivos de log criados pelo Winston:
- `logs/combined.log` - Todos os logs
- `logs/error.log` - Apenas erros

## 🐛 Troubleshooting

### Problema: "Cannot connect to server"
**Solução**: Verifique se o backend está rodando em `http://localhost:3000`

### Problema: "Validation failed"
**Solução**: Verifique se os dados enviados estão no formato correto

### Problema: "Database connection failed"
**Solução**: Verifique a conexão com o PostgreSQL no arquivo `.env`

### Problema: "Email not sent"
**Solução**: Verifique a configuração de email no arquivo `.env`

## 📈 Métricas de Teste

### Tempo de Resposta Esperado
- **Health Check**: < 100ms
- **Request OTP**: < 2s
- **Verify OTP**: < 1s

### Taxa de Sucesso Esperada
- **Testes de Sucesso**: 100%
- **Testes de Validação**: 100% (deve falhar conforme esperado)
- **Testes de Segurança**: 100% (deve falhar conforme esperado)

## 🔄 Testes Automatizados

Para executar testes automatizados (quando implementados):
```bash
# Testes unitários (quando implementados)
pnpm run test

# Testes E2E (quando implementados)
pnpm run test:e2e
```

## 📞 Suporte

Se encontrar problemas durante os testes:
1. Verifique os logs do backend
2. Verifique a conexão com o banco de dados
3. Verifique as configurações no arquivo `.env`
4. Consulte a documentação do projeto em `/doc`

---

**Última atualização**: Janeiro 2025
**Versão**: 1.0.0 