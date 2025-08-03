# Fluxo do Usuário - Gwan Transcribe

## Visão Geral

Este documento descreve o fluxo completo do usuário no sistema de transcrição de áudio, desde o acesso até a obtenção da transcrição.

## Fluxo de Autenticação

### 1. Acesso Inicial

- **URL**: `https://transcribe.gwan.br`
- **Ação**: Usuário acessa a página inicial
- **Interface**: Tela de login com campo de email

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
  - Cria sessão do usuário
- **Interface**:
  - Timer de expiração visível
  - Contador de tentativas restantes
  - Redirecionamento após sucesso

## Fluxo de Transcrição

### 1. Dashboard Principal

- **Acesso**: Após autenticação bem-sucedida
- **Interface**:
  - Área de upload de áudio
  - Seletor de idioma (inglês/português)
  - Lista de transcrições anteriores
  - Menu de navegação

### 2. Upload de Áudio

- **Ação**: Usuário seleciona arquivo de áudio
- **Formatos Aceitos**: MP3, WAV, M4A, AAC, FLAC, etc.
- **Limite**: Sem limite de tamanho
- **Interface**:
  - Drag & drop ou botão de seleção
  - Preview do arquivo selecionado
  - Barra de progresso do upload

### 3. Processamento

- **Backend**:
  - Upload para MinIO bucket
  - Envio para Azure OpenAI
  - Detecção automática de idioma
  - Transcrição do áudio
  - Tradução (se necessário)
  - Armazenamento do resultado
- **Interface**:
  - Indicador de processamento
  - Status em tempo real
  - Não exibe progresso detalhado

### 4. Resultado

- **Interface**:
  - Exibe transcrição completa
  - Mostra idioma detectado
  - Exibe tradução (se aplicável)
  - URL do arquivo original
  - Botões de ação (copiar, baixar, compartilhar)

## Funcionalidades Adicionais

### Histórico de Transcrições

- **Acesso**: Menu lateral ou botão "Histórico"
- **Interface**:
  - Lista paginada de transcrições
  - Filtros por data
  - Busca por conteúdo
  - Detalhes de cada transcrição

### Detalhes da Transcrição

- **Informações Exibidas**:
  - Data e hora do processamento
  - Nome do arquivo original
  - Tamanho do arquivo
  - Duração do áudio
  - Idioma detectado
  - Idioma selecionado
  - Transcrição completa
  - Tradução (se aplicável)
  - URL do arquivo original

## Estados de Erro

### Autenticação

- **Email inválido**: Mensagem de erro específica
- **OTP expirado**: Solicitar novo código
- **Tentativas esgotadas**: Bloquear por 1 hora
- **Email não encontrado**: Criar novo usuário automaticamente

### Upload

- **Formato não suportado**: Mensagem de erro com formatos aceitos
- **Arquivo corrompido**: Mensagem de erro específica
- **Falha no upload**: Retry automático

### Processamento

- **Falha na transcrição**: Mensagem de erro e opção de retry
- **Timeout**: Notificação de processamento longo
- **Serviço indisponível**: Mensagem de manutenção

## Responsividade

### Desktop

- Layout completo com sidebar
- Upload com drag & drop
- Visualização em colunas

### Mobile

- Layout adaptado para touch
- Upload via botão
- Visualização em cards
- Navegação por tabs

## Acessibilidade

### Recursos

- Navegação por teclado
- Screen readers
- Alto contraste
- Tamanho de fonte ajustável
- Descrições alt para imagens

### Feedback

- Mensagens de status claras
- Indicadores visuais de progresso
- Alertas sonoros opcionais
- Confirmações de ações importantes

## Performance

### Otimizações

- Lazy loading de histórico
- Cache de transcrições recentes
- Compressão de áudio antes do upload
- Paginação de resultados

### Métricas

- Tempo de carregamento < 3s
- Tempo de processamento < 30s
- Disponibilidade > 99.9%
- Taxa de erro < 1%

---

**Última atualização**: Agosto 2025
**Versão**: 1.0
