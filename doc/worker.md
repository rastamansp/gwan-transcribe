# Worker de Transcrição

## Visão Geral
Processo standalone (separado da API) responsável por consumir jobs de transcrição da fila, baixar o áudio do storage (MinIO) e executar a transcrição real usando OpenAI Whisper. Atualiza o status da entidade `Transcription` ao longo do processamento.

- Fila: `transcription-queue`
- Storage: MinIO (SDK no worker). Em dev, a API pode salvar localmente como fallback
- Transcrição: OpenAI Whisper (`whisper-1`), habilitado quando `OPENAI_USE=true` e `OPENAI_API_KEY` definido

## Responsabilidades
- Consumir mensagens da fila RabbitMQ
- Atualizar status: UPLOADING → PROCESSING → COMPLETED/ERROR
- Baixar arquivo do MinIO via SDK (preferencial) ou HTTP(s) quando aplicável
- Executar transcrição via Whisper
- Persistir `transcriptionText`, `detectedLanguage`, timestamps e erros
- Limpar arquivos temporários

## Contratos de Fila
- Queue: `transcription-queue`
- Payload do job (`TranscriptionJob`):
  ```json
  {
    "transcriptionId": "<uuid>",
    "fileUrl": "https://minio.gwan.com.br/gwan-transcribe-audio/xxx-filename.ext",
    "language": "pt" | "en" | null
  }
  ```

## Variáveis de Ambiente (backend/.env)
- RabbitMQ
  - `RABBITMQ_URL` (ex.: `amqp://user:pass@host:5672`)
- MinIO
  - `MINIO_ENDPOINT` (ex.: `minio.gwan.com.br`)
  - `MINIO_PORT` (ex.: `443`)
  - `MINIO_USE_SSL` (`true|false`)
  - `MINIO_ACCESS_KEY`
  - `MINIO_SECRET_KEY`
  - `MINIO_BUCKET_NAME` (ex.: `gwan-transcribe-audio`)
  - `MINIO_DOMAIN` (ex.: `https://minio.gwan.com.br`) – usado na API para montar URLs públicas
- OpenAI
  - `OPENAI_API_KEY`
  - `OPENAI_USE` (`true|false`)
- Banco (TypeORM) – mesmos da API

## Como Executar Localmente
1) Suba a API (dev) para produzir jobs:
```powershell
pnpm --filter backend run dev
```
2) Rode o worker em processo separado:
```powershell
pnpm --filter backend run worker
```
3) Enfileire um job via upload HTTP:
- Use `backend/transcription-tests.http` com um arquivo válido (ex.: `backend/samples/tts.wav`).

Dica (Windows) para gerar WAV válido rapidamente:
```powershell
Add-Type -AssemblyName System.Speech; $s=New-Object System.Speech.Synthesis.SpeechSynthesizer; $s.SetOutputToWaveFile('backend/samples/tts.wav'); $s.Speak('Olá, este é um teste de áudio para transcrição.'); $s.Dispose()
```

## Logs Esperados
- Startup:
  - `OpenAI client inicializado`
  - `MinIO client inicializado no worker`
  - `Consumer de transcrição iniciado`
- Processamento:
  - `Processando transcrição <id> (fileUrl=...)`
  - Sucesso: `Transcrição <id> concluída com Whisper`
  - Erro: mensagens detalhadas com `error.response.data` quando disponível

## Troubleshooting
- 400 Invalid file format (Whisper)
  - Use arquivo de áudio real. A extensão é preservada no temporário (compatível com Whisper)
- 403 ao baixar do MinIO
  - Verifique credenciais, bucket e política; o worker usa SDK autenticado
- `Cannot find module dist/worker.main.js`
  - Use o script que compila antes de executar: `pnpm --filter backend run worker`
- Falha de conexão RabbitMQ
  - Cheque `RABBITMQ_URL`, reachability e portas

## Escalonamento
- Execute múltiplas réplicas do worker (paralelismo por processo)
- Configure `prefetch` se necessário (futuro)
- Separe filas por tipo (transcription/translation) – tradução pendente

## Deploy (exemplo Portainer / Compose)
```yaml
services:
  worker:
    image: gwan-transcribe-backend:latest
    command: ["node", "dist/worker.main.js"]
    env_file:
      - backend/.env
    depends_on:
      - rabbitmq
      - db
    deploy:
      replicas: 2
```

## Boas Práticas
- Não utilizar fallback simulado – falhas devem marcar `ERROR`
- Preservar extensão do arquivo temporário (compatibilidade Whisper)
- Sanitizar logs para não expor segredos
- Monitorar métricas (tempo/job, taxa de erro, custos OpenAI)
