import { Before, After, BeforeAll, AfterAll } from '@cucumber/cucumber';
import { TestWorld } from '../world/world';

let serverStarted = false;

BeforeAll(async function () {
  console.log('🚀 Iniciando testes BDD...');
  console.log('📋 Verificando se o servidor está rodando...');
  
  // Aguardar um pouco para garantir que o servidor está pronto
  await new Promise(resolve => setTimeout(resolve, 2000));
});

Before(async function (this: TestWorld) {
  // Limpar estado antes de cada cenário
  this.response = null;
  this.requestData = {};
  this.authToken = null;
  this.userId = null;
  
  console.log('🔄 Iniciando novo cenário...');
});

After(async function (this: TestWorld) {
  // Limpar estado após cada cenário
  this.clearAuthToken();
  this.setUserId('');
  
  // Reativar usuário se estiver inativo (para testes subsequentes)
  try {
    const tempWorld = new (require('../world/world').CustomWorld)({});
    tempWorld.setAuthToken('test-token-pedro-almeida');
    
    // Tentar ativar o usuário (não falha se já estiver ativo)
    await tempWorld.post('/users/activate', {}, tempWorld.getAuthHeaders());
  } catch (error) {
    // Ignorar erros de ativação (usuário pode já estar ativo)
  }
  
  console.log('✅ Cenário finalizado');
});

AfterAll(async function () {
  console.log('🏁 Todos os testes BDD finalizados');
  console.log('🔄 Restaurando usuário de teste ao estado padrão...');
  
  try {
    // Criar uma instância temporária do World para fazer a requisição
    const tempWorld = new (require('../world/world').CustomWorld)({});
    tempWorld.setAuthToken('test-token-pedro-almeida');
    
    // Primeiro, ativar o usuário via API
    console.log('📊 Ativando usuário via API...');
    await tempWorld.post('/users/activate', {}, tempWorld.getAuthHeaders());
    console.log('✅ Usuário ativado via API');
    
    // Agora atualizar nome e email via API
    console.log('📝 Atualizando dados do usuário via API...');
    await tempWorld.put('/users/profile', {
      name: 'Pedro Almeida',
      email: 'pedro.almeida@gmail.com'
    }, tempWorld.getAuthHeaders());
    
    console.log('✅ Usuário de teste restaurado com sucesso');
    console.log('📊 Dados restaurados:');
    console.log('   - Nome: Pedro Almeida');
    console.log('   - Email: pedro.almeida@gmail.com');
    console.log('   - Status: Ativo');
  } catch (error) {
    console.error('❌ Erro ao restaurar usuário de teste:', error.message);
  }
}); 