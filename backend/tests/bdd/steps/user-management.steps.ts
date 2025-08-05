import { Given, When, Then } from '@cucumber/cucumber';
import { TestWorld } from '../world/world';

// Given steps específicos para usuários
Given('que meu perfil está inativo', async function (this: TestWorld) {
  // Realmente desativar o usuário para o teste
  try {
    await this.delete('/users/profile', this.getAuthHeaders());
    console.log('👤 Usuário desativado para teste');
  } catch (error) {
    console.error('❌ Erro ao desativar usuário:', error.message);
  }
});

// Steps específicos para validações de usuário
Then('a resposta deve conter dados do perfil', async function (this: TestWorld) {
  const responseData = this.getResponseData();
  this.expect(responseData).to.have.property('id');
  this.expect(responseData).to.have.property('email');
  this.expect(responseData).to.have.property('name');
  this.expect(responseData).to.have.property('isActive');
});

Then('a resposta deve conter dados de estatísticas', async function (this: TestWorld) {
  const responseData = this.getResponseData();
  this.expect(responseData).to.have.property('totalTranscriptions');
  this.expect(responseData).to.have.property('totalMinutes');
  this.expect(responseData).to.have.property('averageAccuracy');
});

Then('a resposta deve indicar sucesso na atualização', async function (this: TestWorld) {
  const responseData = this.getResponseData();
  this.expect(responseData.success).to.be.true;
  this.expect(responseData.message).to.include('Perfil atualizado');
});

Then('a resposta deve indicar sucesso na desativação', async function (this: TestWorld) {
  const responseData = this.getResponseData();
  this.expect(responseData.success).to.be.true;
  this.expect(responseData.message).to.include('Perfil desativado');
});

Then('a resposta deve indicar erro de validação', async function (this: TestWorld) {
  const responseData = this.getResponseData();
  this.expect(responseData.error).to.equal('Bad Request');
});

Then('a resposta deve indicar erro de conflito', async function (this: TestWorld) {
  const responseData = this.getResponseData();
  this.expect(responseData.error).to.equal('Conflict');
});

Then('a resposta deve indicar erro de não autorizado', async function (this: TestWorld) {
  const responseData = this.getResponseData();
  this.expect(responseData.error).to.equal('Unauthorized');
}); 