import { Injectable, OnModuleInit } from '@nestjs/common';
import { initializeApp, cert, ServiceAccount, getApp, getApps } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getStorage, Storage } from 'firebase-admin/storage';
import * as serviceAccount from '../config/firebase.config.json';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private db!: Firestore;
  private storage!: Storage;

  onModuleInit() {
    // Si ya existe una app, reutilízala
    const app =
      getApps().length === 0
        ? initializeApp({
            credential: cert(serviceAccount as ServiceAccount),
            storageBucket: `${(serviceAccount as any).project_id}.appspot.com`,
          })
        : getApp();

    this.db = getFirestore(app);
    this.storage = getStorage(app);
  }

  get firestore(): Firestore {
    return this.db;
  }

  get bucket() {
    return this.storage.bucket();
  }

  async uploadProfileImage(uid: string, file: Buffer, mimeType: string) {
    const fileRef = this.bucket.file(`perfiles/${uid}/foto_perfil.jpg`);
    await fileRef.save(file, { contentType: mimeType });
    return fileRef.publicUrl();
  }
}
