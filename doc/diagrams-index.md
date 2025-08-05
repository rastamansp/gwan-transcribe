# Índice de Diagramas - Gwan Transcribe

## 📊 Diagramas Mermaid Disponíveis

Este índice organiza todos os diagramas Mermaid criados para o projeto Gwan Transcribe, facilitando a navegação e compreensão da arquitetura e fluxos do sistema.

### 🔗 Links Rápidos

- **[📋 Documentação Completa](application-flow.md)** - Todos os diagramas Mermaid

---

## 📋 Lista de Diagramas

### 1. **Fluxo Geral da Aplicação**
- **Descrição**: Visão macro de todo o processo da aplicação
- **Cobre**: Desde o acesso até o download da transcrição
- **Tipo**: Flowchart
- **Localização**: [application-flow.md#1-fluxo-geral-da-aplicação](application-flow.md#1-fluxo-geral-da-aplicação)

### 2. **Fluxo de Autenticação OTP**
- **Descrição**: Processo detalhado de autenticação via OTP
- **Cobre**: Login, geração de OTP, validação e JWT
- **Tipo**: Sequence Diagram
- **Localização**: [application-flow.md#2-fluxo-de-autenticação-otp](application-flow.md#2-fluxo-de-autenticação-otp)

### 3. **Fluxo de Upload e Transcrição**
- **Descrição**: Processo completo de transcrição de áudio
- **Cobre**: Upload, processamento, OpenAI, notificação
- **Tipo**: Sequence Diagram
- **Localização**: [application-flow.md#3-fluxo-de-upload-e-transcrição](application-flow.md#3-fluxo-de-upload-e-transcrição)

### 4. **Arquitetura de Componentes**
- **Descrição**: Estrutura técnica da aplicação
- **Cobre**: Frontend, Backend, Infraestrutura, Serviços Externos
- **Tipo**: Component Diagram
- **Localização**: [application-flow.md#4-arquitetura-de-componentes](application-flow.md#4-arquitetura-de-componentes)

### 5. **Estados de Processamento**
- **Descrição**: Estados e transições do processamento
- **Cobre**: Upload → Validação → Processamento → Conclusão
- **Tipo**: State Diagram
- **Localização**: [application-flow.md#5-estados-de-processamento](application-flow.md#5-estados-de-processamento)

### 6. **Fluxo de Dados**
- **Descrição**: Como os dados fluem pelo sistema
- **Cobre**: Arquivo → Validação → Storage → Processamento → Resultado
- **Tipo**: Data Flow
- **Localização**: [application-flow.md#6-fluxo-de-dados](application-flow.md#6-fluxo-de-dados)

### 7. **Monitoramento de Custos**
- **Descrição**: Sistema de controle de budget e custos
- **Cobre**: Logs → Cálculo → Budget → Alertas
- **Tipo**: Flowchart
- **Localização**: [application-flow.md#7-monitoramento-de-custos](application-flow.md#7-monitoramento-de-custos)

### 8. **Fluxo de Notificações**
- **Descrição**: Processo de envio de notificações
- **Cobre**: Worker → Database → Email → Usuário
- **Tipo**: Sequence Diagram
- **Localização**: [application-flow.md#8-fluxo-de-notificações](application-flow.md#8-fluxo-de-notificações)

### 9. **Estrutura de Filas**
- **Descrição**: Organização das filas RabbitMQ
- **Cobre**: Upload → Transcrição → Tradução → Notificação
- **Tipo**: Queue Structure
- **Localização**: [application-flow.md#9-estrutura-de-filas](application-flow.md#9-estrutura-de-filas)

### 10. **Fluxo de Internacionalização**
- **Descrição**: Processo de troca de idiomas
- **Cobre**: Seleção → Carregamento → Aplicação
- **Tipo**: Flowchart
- **Localização**: [application-flow.md#10-fluxo-de-internacionalização](application-flow.md#10-fluxo-de-internacionalização)

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
├── application-flow.md          # Documentação completa com diagramas Mermaid
└── diagrams-index.md           # Este arquivo (índice)
```

---

## 🔄 Atualizações

### **Versão 1.1** (Agosto 2025)
- ✅ Remoção das imagens PNG
- ✅ Foco apenas nos diagramas Mermaid
- ✅ Documentação mais limpa e fácil de manter
- ✅ Links diretos para seções específicas

### **Próximas Atualizações**
- 🔄 Diagramas de deploy
- 🔄 Diagramas de monitoramento
- 🔄 Diagramas de segurança
- 🔄 Diagramas de performance

---

**Última atualização**: Agosto 2025  
**Versão**: 1.1  
**Status**: ✅ **OTIMIZADO** 