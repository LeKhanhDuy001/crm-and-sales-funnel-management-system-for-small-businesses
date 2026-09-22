import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';

describe('MailService', () => {
  let mailService: MailService;
  let sendEmail: jest.Mock;

  const createConfigService = (
    values: Record<string, string | undefined>,
  ): ConfigService =>
    ({
      get: jest.fn((key: string) => values[key]),
    }) as unknown as ConfigService;

  beforeEach(() => {
    sendEmail = jest.fn();

    const configService = createConfigService({
      RESEND_API_KEY: 'test-resend-api-key',
      MAIL_FROM: 'CRM System <onboarding@resend.dev>',
    });

    mailService = new MailService(configService);

    (
      mailService as unknown as {
        resend: {
          emails: {
            send: jest.Mock;
          };
        };
      }
    ).resend = {
      emails: {
        send: sendEmail,
      },
    };

    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('ném lỗi khi RESEND_API_KEY chưa được cấu hình', () => {
    const configService = createConfigService({
      RESEND_API_KEY: undefined,
      MAIL_FROM: 'CRM System <onboarding@resend.dev>',
    });

    expect(() => new MailService(configService)).toThrow(
      'RESEND_API_KEY chưa được cấu hình.',
    );
  });

  it('ném lỗi khi MAIL_FROM chưa được cấu hình', () => {
    const configService = createConfigService({
      RESEND_API_KEY: 'test-resend-api-key',
      MAIL_FROM: undefined,
    });

    expect(() => new MailService(configService)).toThrow(
      'MAIL_FROM chưa được cấu hình.',
    );
  });

  it('gửi email đặt lại mật khẩu với đúng người nhận và reset URL', async () => {
    sendEmail.mockResolvedValue({
      data: {
        id: 'email-test-id',
      },
      error: null,
    });

    const resetUrl =
      'http://localhost:3000/reset-password?token=test-reset-token';

    await mailService.sendPasswordResetEmail(
      'admin.demo@crm.local',
      resetUrl,
    );

    expect(sendEmail).toHaveBeenCalledTimes(1);

    expect(sendEmail).toHaveBeenCalledWith({
      from: 'CRM System <onboarding@resend.dev>',
      to: 'admin.demo@crm.local',
      subject: 'Đặt lại mật khẩu CRM System',
      text: expect.stringContaining(resetUrl),
      html: expect.stringContaining(resetUrl),
    });
  });

  it('ném lỗi khi Resend không gửi được email', async () => {
    sendEmail.mockResolvedValue({
      data: null,
      error: {
        message: 'Resend unavailable',
      },
    });

    await expect(
      mailService.sendPasswordResetEmail(
        'admin.demo@crm.local',
        'http://localhost:3000/reset-password?token=test-reset-token',
      ),
    ).rejects.toThrow('Không thể gửi email đặt lại mật khẩu.');
  });
});