import { Module } from '@nestjs/common';
import { UploadController } from './app.controller';
import { FirebaseService } from './app.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [UploadController],
  providers: [FirebaseService],
})
export class AppModule {}
