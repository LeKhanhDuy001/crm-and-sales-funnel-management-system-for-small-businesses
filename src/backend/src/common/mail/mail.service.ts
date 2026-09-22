import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly resend: Resend;
  private readonly mailFrom: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    const mailFrom = this.configService.get<string>('MAIL_FROM');

    if (!apiKey) {
      throw new Error('RESEND_API_KEY chưa được cấu hình.');
    }

    if (!mailFrom) {
      throw new Error('MAIL_FROM chưa được cấu hình.');
    }

    this.resend = new Resend(apiKey);
    this.mailFrom = mailFrom;
  }

  async sendPasswordResetEmail(to: string, resetUrl: string): Promise<void> {
    const { error } = await this.resend.emails.send({
      from: this.mailFrom,
      to,
      subject: 'Đặt lại mật khẩu CRM System',
      text: `Bạn đã yêu cầu đặt lại mật khẩu CRM System. Truy cập liên kết sau để đặt mật khẩu mới: ${resetUrl}. Liên kết có hiệu lực trong 15 phút.`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;line-height:1.6">
          <h2>Đặt lại mật khẩu CRM System</h2>
          <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản CRM System.</p>
          <p>
            <a href="${resetUrl}" style="display:inline-block;padding:12px 20px;background:#2563eb;color:#ffffff;text-decoration:none;border-radius:6px">
              Đặt lại mật khẩu
            </a>
          </p>
          <p>Liên kết này có hiệu lực trong 15 phút.</p>
          <p>Nếu bạn không thực hiện yêu cầu này, bạn có thể bỏ qua email.</p>
        </div>
      `,
    });

    if (error) {
      this.logger.error(`Gửi email đặt lại mật khẩu thất bại: ${error.message}`);
      throw new Error('Không thể gửi email đặt lại mật khẩu.');
    }
  }
}