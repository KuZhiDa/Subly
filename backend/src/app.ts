import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

export class App {
  private readonly app: INestApplication;
  private readonly port: number;
  private readonly configService: ConfigService;
  private readonly prefix: string;
  private readonly url_docs: string;

  constructor(app: INestApplication) {
    this.app = app;
    this.configService = app.get(ConfigService);
    this.port = this.configService.getOrThrow<number>('PORT');
    this.prefix = this.configService.getOrThrow<string>('PREFIX_APP');
    this.url_docs = this.configService.getOrThrow<string>('URL_DOCS');
  }

  private appConfig() {
    this.app.setGlobalPrefix(this.prefix);
    this.app.useGlobalPipes(
      new ValidationPipe({ transform: true, whitelist: true }),
    );
    this.app.use(cookieParser());
    return this;
  }

  private swaggerConfig() {
    const option = new DocumentBuilder()
      .setTitle('Subly')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(this.app, option);
    SwaggerModule.setup(`${this.prefix}/${this.url_docs}`, this.app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
      },
    });
    return this;
  }

  private async runApp() {
    this.app.listen(this.port, () => {
      console.log(`http://localhost:${this.port}/${this.prefix}`);
    });
    return this;
  }

  public static async run() {
    const app = await NestFactory.create(AppModule);
    await new App(app).appConfig().swaggerConfig().runApp();
  }
}
