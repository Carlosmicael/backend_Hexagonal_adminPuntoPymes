
/*import { Injectable, OnModuleInit } from '@nestjs/common';
import { initializeApp, cert, ServiceAccount } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import * as firebaseConfig from '../config/firebase.config.json';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private db: Firestore;

  onModuleInit() {
    const app = initializeApp({
      credential: cert(firebaseConfig as ServiceAccount),
    });
    this.db = getFirestore(app);
  }

  get firestore(): Firestore {
    return this.db;
  }
}
*/