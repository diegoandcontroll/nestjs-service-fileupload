import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    await app.listen(3000);
  } catch (error) {
    console.error('Erro ao fazer o parse do JSON:', error);
  }
}
bootstrap();
