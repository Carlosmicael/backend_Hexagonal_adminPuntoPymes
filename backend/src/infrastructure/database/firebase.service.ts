import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';


@Injectable()
export class FirebaseService {
  async uploadProfileImage(userId: string, fileBuffer: Buffer, mimeType: string): Promise<string> {
    const bucket = admin.storage().bucket();
    const fileName = `perfiles/${userId}/foto_perfil.jpg`;
    const file = bucket.file(fileName);

    await file.save(fileBuffer, {
      metadata: { contentType: mimeType },
      public: true, 
    });

    return file.publicUrl(); 
  }
}
