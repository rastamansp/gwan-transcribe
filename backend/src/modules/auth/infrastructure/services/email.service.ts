import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { IEmailService } from '../../domain/services/email.service.interface';

@Injectable()
export class EmailService implements IEmailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('email.host'),
      port: this.configService.get<number>('email.port'),
      secure: false,
      auth: {
        user: this.configService.get<string>('email.user'),
        pass: this.configService.get<string>('email.pass'),
      },
    });
  }

  async sendOTPEmail(email: string, otpCode: string, name: string): Promise<void> {
    const mailOptions = {
      from: this.configService.get<string>('email.from'),
      to: email,
      subject: 'Código de Verificação - Gwan Transcribe',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Olá, ${name}!</h2>
          <p>Seu código de verificação é:</p>
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #007bff; font-size: 32px; letter-spacing: 5px; margin: 0;">${otpCode}</h1>
          </div>
          <p>Este código expira em 30 minutos.</p>
          <p>Se você não solicitou este código, ignore este email.</p>
          <hr>
          <p style="color: #666; font-size: 12px;">
            Este é um email automático, não responda a este email.
          </p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      throw new Error('Erro ao enviar código de verificação');
    }
  }
} 