import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  private readonly bucket;

  constructor(private readonly configService: ConfigService) {
    const serviceAccount = {
      projectId: this.configService.get<string>('FIREBASE_PROJECT_ID'),
      privateKey: this.configService
        .get<string>('FIREBASE_PRIVATE_KEY')
        .replace(/\\n/g, '\n'),
      clientEmail: this.configService.get<string>('FIREBASE_CLIENT_EMAIL'),
    };

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: this.configService.get<string>('FIREBASE_STORAGE_BUCKET'),
    });

    this.bucket = admin.storage().bucket();
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const fileUpload = this.bucket.file(`${file.originalname}`);
    const fileStream = fileUpload.createWriteStream({
      public: true,
      metadata: {
        contentType: 'application/pdf',
        acl: ['public-read'],
      },
    });

    const pdfBuffer = file.buffer;
    fileStream.end(pdfBuffer);

    const publicUrl = `https://storage.googleapis.com/${this.bucket.name}/${fileUpload.name}`;
    return publicUrl;
  }
  handleMessage() {
    return {
      message: 'Please make a POST request to /upload to upload a file.',
    };
  }
}
