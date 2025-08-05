# language: pt
Funcionalidade: Autenticação OTP
  Como um usuário
  Eu quero me autenticar usando OTP via email
  Para acessar o sistema de transcrição

  Contexto:
    Dado que o servidor está rodando
    E que o sistema de email está configurado

  Cenário: Solicitar OTP com sucesso
    Quando eu envio uma requisição POST para "/auth/request-otp" com:
      """
      {
        "email": "teste@example.com",
        "name": "Usuário Teste"
      }
      """
    Então a resposta deve ter status 201
    E a resposta deve conter "success" como true
    E a resposta deve conter "message" contendo "Código de verificação enviado"

  Cenário: Solicitar OTP com email inválido
    Quando eu envio uma requisição POST para "/auth/request-otp" com:
      """
      {
        "email": "email-invalido",
        "name": "Usuário Teste"
      }
      """
    Então a resposta deve ter status 400
    E a resposta deve conter "error" como "Bad Request"

  Cenário: Solicitar OTP sem nome
    Quando eu envio uma requisição POST para "/auth/request-otp" com:
      """
      {
        "email": "teste@example.com"
      }
      """
    Então a resposta deve ter status 400
    E a resposta deve conter "error" como "Bad Request"

  Cenário: Verificar OTP com sucesso
    Dado que um OTP foi enviado para "teste@example.com"
    Quando eu envio uma requisição POST para "/auth/verify-otp" com:
      """
      {
        "email": "teste@example.com",
        "code": "123456"
      }
      """
    Então a resposta deve ter status 200
    E a resposta deve conter "success" como true
    E a resposta deve conter "token"

  Cenário: Verificar OTP com código inválido
    Dado que o servidor está rodando
    E que o sistema de email está configurado
    Dado que um OTP foi enviado para "teste@example.com"
    Quando eu envio uma requisição POST para "/auth/verify-otp" com:
      """
      {
        "email": "teste@example.com",
        "code": "000000"
      }
      """
    Então a resposta deve ter status 401
    E a resposta deve conter "error" como "Unauthorized"

  Cenário: Verificar OTP com email não encontrado
    Quando eu envio uma requisição POST para "/auth/verify-otp" com:
      """
      {
        "email": "nao-existe@example.com",
        "code": "123456"
      }
      """
    Então a resposta deve ter status 404
    E a resposta deve conter "error" como "Not Found"

  Cenário: Verificar OTP com código vazio
    Dado que um OTP foi enviado para "teste@example.com"
    Quando eu envio uma requisição POST para "/auth/verify-otp" com:
      """
      {
        "email": "teste@example.com",
        "code": ""
      }
      """
    Então a resposta deve ter status 400
    E a resposta deve conter "error" como "Bad Request"

  Cenário: Múltiplas tentativas de request OTP
    Quando eu envio uma requisição POST para "/auth/request-otp" com:
      """
      {
        "email": "stress@example.com",
        "name": "Teste Stress"
      }
      """
    E eu envio uma requisição POST para "/auth/request-otp" com:
      """
      {
        "email": "stress@example.com",
        "name": "Teste Stress"
      }
      """
    E eu envio uma requisição POST para "/auth/request-otp" com:
      """
      {
        "email": "stress@example.com",
        "name": "Teste Stress"
      }
      """
    Então todas as respostas devem ter status 201

  Cenário: Teste de validação - Email muito longo
    Quando eu envio uma requisição POST para "/auth/request-otp" com:
      """
      {
        "email": "email-muito-longo-que-excede-o-limite-maximo-permitido-pela-validacao@example.com",
        "name": "Usuário Teste"
      }
      """
    Então a resposta deve ter status 400
    E a resposta deve conter "error" como "Bad Request"

  Cenário: Teste de validação - Nome muito longo
    Quando eu envio uma requisição POST para "/auth/request-otp" com:
      """
      {
        "email": "teste@example.com",
        "name": "Nome muito longo que pode exceder o limite máximo permitido pela validação do sistema e ainda ter mais caracteres para garantir que realmente exceda o limite de 100 caracteres estabelecido pela validação"
      }
      """
    Então a resposta deve ter status 400
    E a resposta deve conter "error" como "Bad Request"

  Cenário: Teste de segurança - SQL Injection
    Quando eu envio uma requisição POST para "/auth/request-otp" com:
      """
      {
        "email": "test'; DROP TABLE users; --@example.com",
        "name": "SQL Injection"
      }
      """
    Então a resposta deve ter status 400
    E a resposta deve conter "error" como "Bad Request"

  Cenário: Teste de segurança - XSS
    Quando eu envio uma requisição POST para "/auth/request-otp" com:
      """
      {
        "email": "teste@example.com",
        "name": "<script>alert('XSS')</script>"
      }
      """
    Então a resposta deve ter status 201
    E a resposta deve conter "success" como true 