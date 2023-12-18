import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FirebaseService } from './app.service';

@Controller('')
export class UploadController {
  constructor(private readonly firebaseService: FirebaseService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('pdf'))
  async uploadPDF(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ url: string }> {
    const publicUrl = await this.firebaseService.uploadPDF(file);
    return { url: publicUrl };
  }
  @Get()
  sendMessage() {
    return { message: 'User path /upload' };
  }
}
