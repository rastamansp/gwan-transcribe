# language: pt
Funcionalidade: Gestão de Usuários
  Como um usuário autenticado
  Eu quero gerenciar meu perfil
  Para manter minhas informações atualizadas

  Contexto:
    Dado que o servidor está rodando
    E que estou autenticado com token válido

  Cenário: Obter perfil do usuário com sucesso
    Quando eu envio uma requisição GET para "/users/profile"
    Então a resposta deve ter status 200
    E a resposta deve conter "id"
    E a resposta deve conter "email"
    E a resposta deve conter "name"

  Cenário: Obter perfil sem token
    Dado que não estou autenticado
    Quando eu envio uma requisição GET para "/users/profile"
    Então a resposta deve ter status 401
    E a resposta deve conter "error" como "Unauthorized"

  Cenário: Obter perfil com token inválido
    Dado que estou autenticado com token inválido
    Quando eu envio uma requisição GET para "/users/profile"
    Então a resposta deve ter status 401
    E a resposta deve conter "error" como "Unauthorized"

  Cenário: Atualizar perfil com sucesso - Nome
    Quando eu envio uma requisição PUT para "/users/profile" com:
      """
      {
        "name": "Pedro Henrique Almeida"
      }
      """
    Então a resposta deve ter status 200
    E a resposta deve conter "success" como true
    E a resposta deve conter "message" contendo "Perfil atualizado"

  Cenário: Atualizar perfil com sucesso - Email
    Quando eu envio uma requisição PUT para "/users/profile" com:
      """
      {
        "email": "pedro.almeida@gmail.com"
      }
      """
    Então a resposta deve ter status 200
    E a resposta deve conter "success" como true
    E a resposta deve conter "message" contendo "Perfil atualizado"

  Cenário: Atualizar perfil com sucesso - Nome e Email
    Quando eu envio uma requisição PUT para "/users/profile" com:
      """
      {
        "name": "Pedro H. Almeida",
        "email": "pedro.h.almeida@gmail.com"
      }
      """
    Então a resposta deve ter status 200
    E a resposta deve conter "success" como true
    E a resposta deve conter "message" contendo "Perfil atualizado"

  Cenário: Atualizar perfil com email já existente
    Quando eu envio uma requisição PUT para "/users/profile" com:
      """
      {
        "email": "test@example.com"
      }
      """
    Então a resposta deve ter status 409
    E a resposta deve conter "error" como "Conflict"

  Cenário: Atualizar perfil com nome muito longo
    Quando eu envio uma requisição PUT para "/users/profile" com:
      """
      {
        "name": "Nome muito longo que excede o limite máximo permitido pela validação do sistema de usuários com mais de 100 caracteres para testar se a validação está funcionando corretamente"
      }
      """
    Então a resposta deve ter status 400
    E a resposta deve conter "error" como "Bad Request"

  Cenário: Atualizar perfil com nome null
    Quando eu envio uma requisição PUT para "/users/profile" com:
      """
      {
        "name": null
      }
      """
    Então a resposta deve ter status 400
    E a resposta deve conter "error" como "Bad Request"

  Cenário: Atualizar perfil com nome vazio
    Quando eu envio uma requisição PUT para "/users/profile" com:
      """
      {
        "name": ""
      }
      """
    Então a resposta deve ter status 400
    E a resposta deve conter "error" como "Bad Request"

  Cenário: Atualizar perfil com body vazio
    Quando eu envio uma requisição PUT para "/users/profile" com:
      """
      {
      }
      """
    Então a resposta deve ter status 400
    E a resposta deve conter "error" como "Bad Request"

  Cenário: Atualizar perfil com email inválido
    Quando eu envio uma requisição PUT para "/users/profile" com:
      """
      {
        "email": "email-invalido"
      }
      """
    Então a resposta deve ter status 400
    E a resposta deve conter "error" como "Bad Request"

  Cenário: Atualizar perfil sem token
    Dado que não estou autenticado
    Quando eu envio uma requisição PUT para "/users/profile" com:
      """
      {
        "name": "Pedro Almeida"
      }
      """
    Então a resposta deve ter status 401
    E a resposta deve conter "error" como "Unauthorized"

  Cenário: Desativar perfil com sucesso
    Quando eu envio uma requisição DELETE para "/users/profile"
    Então a resposta deve ter status 200
    E a resposta deve conter "success" como true
    E a resposta deve conter "message" contendo "Conta desativada"
    # Reativar usuário para testes subsequentes
    Quando eu envio uma requisição POST para "/users/activate"

  Cenário: Desativar perfil sem token
    Dado que não estou autenticado
    Quando eu envio uma requisição DELETE para "/users/profile"
    Então a resposta deve ter status 401
    E a resposta deve conter "error" como "Unauthorized"

  Cenário: Desativar perfil já inativo
    Dado que meu perfil está inativo
    Quando eu envio uma requisição DELETE para "/users/profile"
    Então a resposta deve ter status 401
    E a resposta deve conter "error" como "Unauthorized"

  Cenário: Obter estatísticas do usuário com sucesso
    Quando eu envio uma requisição GET para "/users/statistics"
    Então a resposta deve ter status 200
    E a resposta deve conter "totalTranscriptions"
    E a resposta deve conter "totalMinutes"
    E a resposta deve conter "averageAccuracy"

  Cenário: Obter estatísticas sem token
    Dado que não estou autenticado
    Quando eu envio uma requisição GET para "/users/statistics"
    Então a resposta deve ter status 401
    E a resposta deve conter "error" como "Unauthorized"

  Cenário: Obter estatísticas com token inválido
    Dado que estou autenticado com token inválido
    Quando eu envio uma requisição GET para "/users/statistics"
    Então a resposta deve ter status 401
    E a resposta deve conter "error" como "Unauthorized"

  Cenário: Múltiplas requisições de perfil simultâneas
    Quando eu envio uma requisição GET para "/users/profile"
    E eu envio uma requisição GET para "/users/profile"
    E eu envio uma requisição GET para "/users/profile"
    Então todas as respostas devem ter status 200

  Cenário: Múltiplas atualizações de perfil simultâneas
    Quando eu envio uma requisição PUT para "/users/profile" com:
      """
      {
        "name": "Pedro Almeida - Teste 1"
      }
      """
    E eu envio uma requisição PUT para "/users/profile" com:
      """
      {
        "name": "Pedro Almeida - Teste 2"
      }
      """
    E eu envio uma requisição PUT para "/users/profile" com:
      """
      {
        "name": "Pedro Almeida - Teste 3"
      }
      """
    Então todas as respostas devem ter status 200

  Cenário: Teste de validação - Nome com caracteres especiais
    Quando eu envio uma requisição PUT para "/users/profile" com:
      """
      {
        "name": "Pedro Henrique Pinheiro de Almeida"
      }
      """
    Então a resposta deve ter status 200
    E a resposta deve conter "success" como true

  Cenário: Teste de validação - Email com caracteres especiais
    Quando eu envio uma requisição PUT para "/users/profile" com:
      """
      {
        "email": "pedro.henrique+teste@gmail.com"
      }
      """
    Então a resposta deve ter status 200
    E a resposta deve conter "success" como true

  Cenário: Teste de validação - Campos vazios
    Quando eu envio uma requisição PUT para "/users/profile" com:
      """
      {
        "name": "",
        "email": ""
      }
      """
    Então a resposta deve ter status 400
    E a resposta deve conter "error" como "Bad Request"

  Cenário: Teste de segurança - SQL Injection
    Quando eu envio uma requisição PUT para "/users/profile" com:
      """
      {
        "name": "Pedro'; DROP TABLE users; --",
        "email": "pedro@example.com"
      }
      """
    Então a resposta deve ter status 200
    E a resposta deve conter "success" como true

  Cenário: Teste de segurança - XSS
    Quando eu envio uma requisição PUT para "/users/profile" com:
      """
      {
        "name": "<script>alert('XSS')</script>",
        "email": "pedro@example.com"
      }
      """
    Então a resposta deve ter status 200
    E a resposta deve conter "success" como true 