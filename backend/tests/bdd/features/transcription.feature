Feature: Transcrição de áudio
  Como um usuário autenticado
  Quero enviar arquivos para transcrição
  Para acompanhar o status e listar minhas transcrições

  Background:
    Given que estou autenticado com token válido

  Scenario: Upload de arquivo MP3, listar e obter por ID
    When eu faço upload de transcrição com arquivo "samples/sample.mp3" e idioma "pt"
    Then a resposta deve ter status 201
    And a resposta deve conter "success" como true
    And eu salvo o id da transcrição retornada
    When eu envio uma requisição GET para "/transcription"
    Then a resposta deve ter status 200
    And a resposta deve conter "success" como true
    When eu busco a transcrição pelo último id
    Then a resposta deve ter status 200
    And a resposta deve conter "success" como true

  Scenario: Upload com arquivo inválido
    Given que estou autenticado com token válido
    When eu faço upload de transcrição com arquivo "samples/invalid.txt"
    Then a resposta deve ter status 400

