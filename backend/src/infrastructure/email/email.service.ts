import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getMessageForNotification } from 'src/common/const/message';
import { NotificationDto } from 'src/module/notification/presentation/dto/notification.dto';

@Injectable()
export class EmailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async sendNotifications(data: NotificationDto[]) {
    await Promise.all(
      data.map(
        async (d) =>
          await Promise.all(
            d.subscription.map(async (s) => {
              const message = getMessageForNotification(s.type, s.name);

              return this.mailerService.sendMail({
                from: {
                  name: 'Subly',
                  address: this.configService.get<string>('USER_MAILER'),
                },
                to: d.user.email,
                subject: s.type,
                html: `
          <h1>Важное сообщение</h1>
          <p>${message}</p>
          `,
              });
            }),
          ),
      ),
    );
  }
}
