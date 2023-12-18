import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as path from 'path';
import { createHash } from 'crypto';
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

    const fileId = createHash('sha1').update(crypto.randomUUID()).digest('hex');

    const filename = `${fileId}${extension}`;
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
