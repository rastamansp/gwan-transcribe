# Testes BDD com Cucumber

Este diretório contém os testes BDD (Behavior Driven Development) usando Cucumber para o backend da aplicação Gwan Transcribe.

## Estrutura

```
tests/bdd/
├── features/           # Arquivos .feature com cenários
│   ├── authentication.feature
│   └── user-management.feature
├── steps/              # Step definitions
│   ├── authentication.steps.ts
│   └── user-management.steps.ts
├── support/            # Hooks e configurações
│   └── hooks.ts
├── world/              # World object e helpers
│   └── world.ts
├── reports/            # Relatórios de teste
└── README.md           # Esta documentação
```

## Funcionalidades Testadas

### 1. Autenticação OTP
- Solicitar OTP via email
- Verificar OTP
- Validações de entrada
- Testes de segurança
- Testes de stress

### 2. Gestão de Usuários
- Obter perfil do usuário
- Atualizar perfil
- Desativar perfil
- Obter estatísticas
- Validações de dados
- Testes de autenticação

## Comandos

### Executar todos os testes
```bash
pnpm run test:bdd
```

### Executar testes em modo watch
```bash
pnpm run test:bdd:watch
```

### Executar testes específicos
```bash
# Testes de autenticação
pnpm run test:bdd -- --grep "autenticação"

# Testes de usuários
pnpm run test:bdd -- --grep "usuários"
```

### Gerar relatório HTML
```bash
pnpm run test:bdd:report
```

### Restaurar usuário de teste manualmente
```bash
pnpm run test:restore-user
```

## Configuração

### Pré-requisitos
- Servidor backend rodando em `http://localhost:3000`
- Banco de dados configurado
- Usuário de teste criado

### Token de Teste
O sistema usa um token de teste especial: `test-token-pedro-almeida`

Este token é configurado no `AuthGuard` para bypass de autenticação durante os testes.

### Variáveis de Ambiente
- `BASE_URL`: URL base da API (padrão: `http://localhost:3000/api/v1`)
- `TEST_TOKEN`: Token de teste (padrão: `test-token-pedro-almeida`)

## Cenários de Teste

### Autenticação OTP
1. **Solicitar OTP com sucesso**
2. **Solicitar OTP com email inválido**
3. **Solicitar OTP sem nome**
4. **Verificar OTP com sucesso**
5. **Verificar OTP com código inválido**
6. **Verificar OTP com email não encontrado**
7. **Verificar OTP com código vazio**
8. **Múltiplas tentativas de request OTP**
9. **Teste de validação - Email muito longo**
10. **Teste de validação - Nome muito longo**
11. **Teste de segurança - SQL Injection**
12. **Teste de segurança - XSS**

### Gestão de Usuários
1. **Obter perfil do usuário com sucesso**
2. **Obter perfil sem token**
3. **Obter perfil com token inválido**
4. **Atualizar perfil com sucesso - Nome**
5. **Atualizar perfil com sucesso - Email**
6. **Atualizar perfil com sucesso - Nome e Email**
7. **Atualizar perfil com email já existente**
8. **Atualizar perfil com nome muito longo**
9. **Atualizar perfil com nome null**
10. **Atualizar perfil com nome vazio**
11. **Atualizar perfil com body vazio**
12. **Atualizar perfil com email inválido**
13. **Atualizar perfil sem token**
14. **Desativar perfil com sucesso**
15. **Desativar perfil sem token**
16. **Desativar perfil já inativo**
17. **Obter estatísticas do usuário com sucesso**
18. **Obter estatísticas sem token**
19. **Obter estatísticas com token inválido**
20. **Múltiplas requisições de perfil simultâneas**
21. **Múltiplas atualizações de perfil simultâneas**
22. **Teste de validação - Nome com caracteres especiais**
23. **Teste de validação - Email com caracteres especiais**
24. **Teste de validação - Campos vazios**
25. **Teste de segurança - SQL Injection**
26. **Teste de segurança - XSS**

## Relatórios

Os relatórios são gerados em:
- **HTML**: `tests/bdd/reports/report.html`
- **JSON**: `tests/bdd/reports/report.json`

## Debugging

Para debugar os testes, adicione logs no World object:

```typescript
console.log('Response:', this.getResponseData());
console.log('Status:', this.getResponseStatus());
```

## Extensões

Para adicionar novos testes:

1. **Criar feature**: Adicione arquivo `.feature` em `features/`
2. **Criar steps**: Adicione arquivo `.steps.ts` em `steps/`
3. **Atualizar hooks**: Se necessário, atualize `support/hooks.ts`
4. **Executar testes**: Use `pnpm run test:bdd`

## Integração com CI/CD

Para integrar com CI/CD, adicione ao pipeline:

```yaml
- name: Run BDD Tests
  run: |
    cd backend
    pnpm run test:bdd:report
```

## Notas Importantes

- Os testes dependem do servidor estar rodando
- O token de teste é configurado no `AuthGuard`
- Os testes usam Axios para requisições HTTP
- As validações usam Chai para assertions
- Os relatórios são gerados automaticamente

## Restauração Automática do Usuário de Teste

### Estado Padrão
Após a execução dos testes BDD, o usuário de teste é automaticamente restaurado ao estado padrão:

```json
{
  "name": "Pedro Almeida",
  "email": "pedro.almeida@gmail.com"
}
```

### Restauração Automática
- **Quando**: Ao final de todos os testes BDD (`AfterAll` hook)
- **O que**: Atualiza o perfil do usuário de teste para o estado padrão
- **Como**: Usa o token `test-token-pedro-almeida` para autenticação
- **Logs**: Exibe confirmação da restauração no console

### Restauração Manual
Se for necessário restaurar o usuário manualmente:

```bash
pnpm run test:restore-user
```

### Benefícios
- **Consistência**: Garante que o banco de dados sempre tenha dados consistentes
- **Repetibilidade**: Permite executar os testes múltiplas vezes sem problemas
- **Debugging**: Facilita a identificação de problemas nos testes
- **Manutenção**: Reduz a necessidade de limpeza manual do banco 