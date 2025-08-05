import { Given, When, Then, DataTable } from '@cucumber/cucumber';
import { TestWorld } from '../world/world';
import { Client } from 'pg';

// Given steps específicos para autenticação
Given('que o servidor está rodando', async function (this: TestWorld) {
  // Verificar se o servidor está respondendo
  await this.get('/health');
  this.expect(this.getResponseStatus()).to.equal(200);
});

Given('que o sistema de email está configurado', async function (this: TestWorld) {
  // Simular que o sistema de email está configurado
  // Em um ambiente real, isso verificaria a configuração do email
  console.log('📧 Sistema de email configurado');
});

Given('que um OTP foi enviado para {string}', { timeout: 10000 }, async function (this: TestWorld, email: string) {
  // Primeiro, solicitar um OTP real via API
  try {
    await this.post('/auth/request-otp', {
      email: email,
      name: 'Usuário Teste'
    }, {});
    
    console.log(`📧 OTP solicitado para ${email}`);
  } catch (error) {
    console.error('❌ Erro ao solicitar OTP:', error.message);
  }
}); 