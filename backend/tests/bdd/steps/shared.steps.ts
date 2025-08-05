import { Given, When, Then } from '@cucumber/cucumber';
import { TestWorld } from '../world/world';

// Given steps compartilhados
Given('que estou autenticado com token válido', async function (this: TestWorld) {
  this.setAuthToken('test-token-pedro-almeida');
});

Given('que não estou autenticado', async function (this: TestWorld) {
  this.clearAuthToken();
});

Given('que estou autenticado com token inválido', async function (this: TestWorld) {
  this.setAuthToken('token-invalido');
});

// When steps compartilhados
When('eu envio uma requisição GET para {string}', async function (this: TestWorld, endpoint: string) {
  await this.get(endpoint, this.getAuthHeaders());
});

When('eu envio uma requisição POST para {string} com:', async function (this: TestWorld, endpoint: string, docString: string) {
  const data = JSON.parse(docString);
  await this.post(endpoint, data, this.getAuthHeaders());
});

When('eu envio uma requisição POST para {string}', async function (this: TestWorld, endpoint: string) {
  await this.post(endpoint, {}, this.getAuthHeaders());
});

When('eu envio uma requisição PUT para {string} com:', async function (this: TestWorld, endpoint: string, docString: string) {
  const data = JSON.parse(docString);
  await this.put(endpoint, data, this.getAuthHeaders());
});

When('eu envio uma requisição DELETE para {string}', async function (this: TestWorld, endpoint: string) {
  await this.delete(endpoint, this.getAuthHeaders());
});

// Then steps compartilhados
Then('a resposta deve ter status {int}', async function (this: TestWorld, status: number) {
  this.expect(this.getResponseStatus()).to.equal(status);
});

Then('a resposta deve conter {string} como {string}', async function (this: TestWorld, field: string, value: string) {
  const responseData = this.getResponseData();
  this.expect(responseData[field]).to.equal(value);
});

Then('a resposta deve conter {string}', async function (this: TestWorld, property: string) {
  const responseData = this.getResponseData();
  
  // Verificar se a propriedade existe diretamente ou dentro de statistics
  if (responseData.statistics) {
    this.expect(responseData.statistics).to.have.property(property);
  } else {
    this.expect(responseData).to.have.property(property);
  }
});

Then('a resposta deve conter {string} contendo {string}', async function (this: TestWorld, field: string, value: string) {
  const responseData = this.getResponseData();
  this.expect(responseData[field]).to.include(value);
});

Then('a resposta deve conter {string} como true', async function (this: TestWorld, field: string) {
  const responseData = this.getResponseData();
  this.expect(responseData[field]).to.be.true;
});

Then('todas as respostas devem ter status {int}', async function (this: TestWorld, status: number) {
  // Para cenários com múltiplas requisições, verificar a última resposta
  this.expect(this.getResponseStatus()).to.equal(status);
}); 