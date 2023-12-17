import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FirebaseService } from './app.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly firebaseService: FirebaseService) {}

  @Post()
  @UseInterceptors(FileInterceptor('pdf'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      const url = await this.firebaseService.uploadFile(file);
      return { url };
    } catch (error) {
      throw new Error('Erro ao fazer upload do arquivo');
    }
  }
}
