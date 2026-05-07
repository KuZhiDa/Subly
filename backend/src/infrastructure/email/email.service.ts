import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async sendNotifications(data: any) {
    data.forEach((d) =>
      d.subscription.map((s) =>
        this.mailerService.sendMail({
          from: {
            name: 'Subly',
            address: this.configService.get<string>('USER_MAILER'),
          },
          to: d.user.email,
          subject: 'Истек срок подписки.',
          html: `
          <h1>Важное сообщение</h1>
          <p>Срок действия подписки ${s.name} истек.</p>
          <p>Продлите или приостановите ее.</p>
          `,
        }),
      ),
    );
  }
}
