# Índice de Diagramas - Gwan Transcribe

## 📊 Diagramas Mermaid Disponíveis

Este índice organiza todos os diagramas Mermaid criados para o projeto Gwan Transcribe, facilitando a navegação e compreensão da arquitetura e fluxos do sistema.

### 🔗 Links Rápidos

- **[📋 Documentação Completa](application-flow.md)** - Todos os diagramas com códigos Mermaid
- **[🖼️ Imagens dos Diagramas](images/)** - Pasta com todas as imagens PNG

---

## 📋 Lista de Diagramas

### 1. **Fluxo Geral da Aplicação**
- **Arquivo**: `images/fluxo_geral.png`
- **Descrição**: Visão macro de todo o processo da aplicação
- **Cobre**: Desde o acesso até o download da transcrição
- **Tipo**: Flowchart

### 2. **Fluxo de Autenticação OTP**
- **Arquivo**: `images/fluxo_autenticacao_otp.png`
- **Descrição**: Processo detalhado de autenticação via OTP
- **Cobre**: Login, geração de OTP, validação e JWT
- **Tipo**: Sequence Diagram

### 3. **Fluxo de Upload e Transcrição**
- **Arquivo**: `images/fluxo_upload_transcricao.png`
- **Descrição**: Processo completo de transcrição de áudio
- **Cobre**: Upload, processamento, OpenAI, notificação
- **Tipo**: Sequence Diagram

### 4. **Arquitetura de Componentes**
- **Arquivo**: `images/arquitetura_componentes.png`
- **Descrição**: Estrutura técnica da aplicação
- **Cobre**: Frontend, Backend, Infraestrutura, Serviços Externos
- **Tipo**: Component Diagram

### 5. **Estados de Processamento**
- **Arquivo**: `images/estados_processamento.png`
- **Descrição**: Estados e transições do processamento
- **Cobre**: Upload → Validação → Processamento → Conclusão
- **Tipo**: State Diagram

### 6. **Fluxo de Dados**
- **Arquivo**: `images/fluxo_dados.png`
- **Descrição**: Como os dados fluem pelo sistema
- **Cobre**: Arquivo → Validação → Storage → Processamento → Resultado
- **Tipo**: Data Flow

### 7. **Monitoramento de Custos**
- **Arquivo**: `images/monitoramento_custos.png`
- **Descrição**: Sistema de controle de budget e custos
- **Cobre**: Logs → Cálculo → Budget → Alertas
- **Tipo**: Flowchart

### 8. **Fluxo de Notificações**
- **Arquivo**: `images/fluxo_notificacoes.png`
- **Descrição**: Processo de envio de notificações
- **Cobre**: Worker → Database → Email → Usuário
- **Tipo**: Sequence Diagram

### 9. **Estrutura de Filas**
- **Arquivo**: `images/estrutura_filas.png`
- **Descrição**: Organização das filas RabbitMQ
- **Cobre**: Upload → Transcrição → Tradução → Notificação
- **Tipo**: Queue Structure

### 10. **Fluxo de Internacionalização**
- **Arquivo**: `images/fluxo_intercionalizacao.png`
- **Descrição**: Processo de troca de idiomas
- **Cobre**: Seleção → Carregamento → Aplicação
- **Tipo**: Flowchart

---

## 🎯 Como Usar os Diagramas

### **Para Desenvolvedores**
1. **Entendimento da Arquitetura**: Use os diagramas 1, 4 e 5
2. **Implementação de Features**: Use os diagramas 2, 3 e 6
3. **Debugging**: Use os diagramas 7 e 8
4. **Configuração**: Use os diagramas 9 e 10

### **Para Stakeholders**
1. **Visão Geral**: Diagrama 1 (Fluxo Geral)
2. **Processo de Usuário**: Diagramas 2 e 3
3. **Tecnologia**: Diagrama 4 (Arquitetura)
4. **Monitoramento**: Diagrama 7 (Custos)

### **Para Documentação**
- **README.md**: Incluir diagramas 1 e 4
- **PRD**: Incluir diagramas 2 e 3
- **Arquitetura**: Incluir diagramas 4, 5 e 6
- **Deploy**: Incluir diagramas 7 e 9

---

## 📁 Estrutura de Arquivos

```
doc/
├── application-flow.md          # Documentação completa com diagramas
├── diagrams-index.md           # Este arquivo (índice)
└── images/                     # Pasta com imagens PNG
    ├── fluxo_geral.png
    ├── fluxo_autenticacao_otp.png
    ├── fluxo_upload_transcricao.png
    ├── arquitetura_componentes.png
    ├── estados_processamento.png
    ├── fluxo_dados.png
    ├── monitoramento_custos.png
    ├── fluxo_notificacoes.png
    ├── estrutura_filas.png
    └── fluxo_intercionalizacao.png
```

---

## 🔄 Atualizações

### **Versão 1.0** (Agosto 2025)
- ✅ Criação de 10 diagramas Mermaid
- ✅ Geração de imagens PNG
- ✅ Integração na documentação
- ✅ Índice organizado

### **Próximas Atualizações**
- 🔄 Diagramas de deploy
- 🔄 Diagramas de monitoramento
- 🔄 Diagramas de segurança
- 🔄 Diagramas de performance

---

**Última atualização**: Agosto 2025  
**Versão**: 1.0  
**Status**: ✅ **COMPLETO** 