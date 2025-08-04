export interface IEmailService {
  sendOTPEmail(email: string, otpCode: string, name: string): Promise<void>;
} 