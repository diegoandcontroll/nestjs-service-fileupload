import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as path from 'path';
import { IFirebaseCredentials } from './config';
import creadentials from './config/upload.json';
@Injectable()
export class FirebaseService {
  private readonly storage;
  constructor() {
    admin.initializeApp({
      credential: admin.credential.cert(creadentials as IFirebaseCredentials),
      storageBucket: `${process.env.BUCKET}`,
    });

    this.storage = admin.storage().bucket();
  }

  async uploadPDF(pdfFile: Express.Multer.File): Promise<string> {
    const extension = path.extname(pdfFile.originalname);
    const currentDate = new Date();
    const formattedDate = currentDate
      .toISOString()
      .replace(/[-T:.Z]/g, '')
      .slice(0, 14);

    const filename = `${formattedDate}${extension}`;
    const fileRef = this.storage.file(filename);
    await fileRef.save(pdfFile.buffer, {
      public: true,
      metadata: {
        contentType: 'application/pdf',
      },
    });

    const bucketName = this.storage.name;
    const publicUrl = `https://storage.googleapis.com/${bucketName}/${filename}`;

    return publicUrl;
  }
}
