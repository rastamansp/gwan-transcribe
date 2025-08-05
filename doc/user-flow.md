# Fluxo do Usuário - Gwan Transcribe

## Visão Geral

Este documento descreve o fluxo completo do usuário no sistema de transcrição de áudio, desde o acesso até a obtenção da transcrição.

## Fluxo de Autenticação

### 1. Acesso Inicial

- **URL**: `https://transcribe.gwan.br`
- **Ação**: Usuário acessa a página inicial
- **Interface**: Tela de login com campo de email
- **Idioma**: Português (padrão) com opção de alterar para Inglês

### 2. Solicitação de OTP

- **Ação**: Usuário insere email e clica em "Enviar Código"
- **Backend**:
  - Valida formato do email
  - Gera código OTP de 6 dígitos
  - Envia email com código
  - Define expiração de 30 minutos
- **Interface**: Exibe mensagem "Código enviado para seu email"

### 3. Validação OTP

- **Ação**: Usuário insere código recebido
- **Backend**:
  - Valida código OTP
  - Verifica expiração (30min)
  - Conta tentativas (máximo 3)
  - Cria sessão do usuário com JWT
- **Interface**:
  - Timer de expiração visível
  - Contador de tentativas restantes
  - Redirecionamento após sucesso

## Fluxo de Transcrição

### 1. Página de Conteúdo

- **Acesso**: Após autenticação bem-sucedida
- **Interface**:
  - Texto descritivo do serviço
  - Botão para upload de arquivo de áudio
  - Seletor de idioma (Português/Inglês)
  - Botão de logout

### 2. Upload de Áudio

- **Ação**: Usuário seleciona arquivo de áudio
- **Formatos Aceitos**: MP3, WAV, M4A, AAC, FLAC
- **Limite**: Máximo 20MB por arquivo
- **Interface**:
  - Drag & drop ou botão de seleção
  - Preview do arquivo selecionado
  - Barra de progresso do upload
  - Validação de tamanho e formato

### 3. Processamento Assíncrono

- **Backend**:
  - Upload para MinIO bucket
  - Envio para fila RabbitMQ
  - Processamento em background
  - Status atualizado em tempo real
- **Interface**:
  - Indicador de processamento em tempo real
  - Progresso detalhado (detecção → transcrição → tradução)
  - Atualização automática de status

### 4. Status de Processamento

- **Estágios**:
  1. **Upload**: Arquivo sendo enviado
  2. **Detecção**: Detectando idioma do áudio
  3. **Transcrição**: Processando com OpenAI Whisper (modelo base)
  4. **Tradução**: Traduzindo se necessário (OpenAI GPT)
  5. **Concluído**: Processamento finalizado

### 5. Notificação e Resultado

- **Email**: Sistema envia notificação por email quando processamento termina
- **Interface**:
  - Exibe transcrição completa
  - Mostra idioma detectado
  - Exibe tradução (se aplicável)
  - URL do arquivo original
  - Botões de ação (copiar, baixar, traduzir)

## Funcionalidades de Interface

### Internacionalização

- **Idiomas Suportados**: Português (pt-BR) e Inglês (en-US)
- **Interface**: Bandeiras EUA e Brasil para alternar idioma
- **Arquivo**: JSON com traduções para ambos os idiomas
- **Padrão**: Português como idioma padrão

### Modo Visual

- **Tema**: Apenas modo claro (sem modo escuro)
- **Cores**: Paleta de cores consistente
- **Material-UI**: Componentes padronizados

### Responsividade

- **Desktop**: Layout completo com sidebar
- **Mobile**: Layout adaptado para touch
- **Tablet**: Layout intermediário

## Estados de Erro

### Autenticação

- **Email inválido**: Mensagem de erro específica
- **OTP expirado**: Solicitar novo código
- **Tentativas esgotadas**: Bloquear por 1 hora

### Upload

- **Formato não suportado**: Mensagem de erro com formatos aceitos
- **Arquivo muito grande**: Mensagem de limite de 20MB
- **Arquivo corrompido**: Mensagem de erro específica
- **Falha no upload**: Retry automático

### Processamento

- **Falha na transcrição**: Mensagem de erro e opção de retry
- **Timeout**: Notificação de processamento longo (máximo 3 minutos)
- **Serviço indisponível**: Mensagem de manutenção
- **Erro OpenAI**: Mensagem de erro da API

## Segurança

### Rate Limiting

- **Autenticação**: 10 tentativas por minuto
- **Upload**: 5 uploads por hora
- **API**: 100 requisições por 15 minutos

### Proteção de Rotas

- **JWT**: Token de autenticação
- **Refresh**: Renovação automática de token
- **Sanitização**: Validação de entrada robusta

## Performance

### Otimizações

- **Upload**: Validação client-side
- **Processamento**: Indicadores de progresso detalhado
- **Interface**: Componentes otimizados
- **Whisper**: Modelo base para melhor performance

### Métricas

- **Tempo de carregamento**: < 3s
- **Tempo de processamento**: < 3min (para arquivos de 20MB)
- **Disponibilidade**: > 99.9%
- **Taxa de erro**: < 1%

## Monitoramento de Custos

### Logs Detalhados

- **API Calls**: Registro de todas as chamadas para OpenAI
- **Custos**: Rastreamento de custos por usuário/transcrição
- **Budget**: Monitoramento do limite de R$ 100,00 mensal
- **Alertas**: Notificações quando próximo do limite

### Métricas de Uso

- **Transcrições por dia**: Contagem de processamentos
- **Custo por transcrição**: Média de custo por arquivo
- **Uso por usuário**: Estatísticas individuais
- **Tendências**: Análise de uso ao longo do tempo

## Acessibilidade

### Recursos Básicos

- **Navegação**: Por teclado
- **Contraste**: Alto contraste
- **Fonte**: Tamanho ajustável

### Feedback

- **Mensagens**: Status claras
- **Indicadores**: Visuais de progresso detalhado
- **Confirmações**: Ações importantes
- **Notificações**: Email quando processamento termina

---

**Última atualização**: Agosto 2025
**Versão**: 2.2
