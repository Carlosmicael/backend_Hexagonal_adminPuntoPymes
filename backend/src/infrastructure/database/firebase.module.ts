import { Module, Global } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as path from 'path';
import * as fs from 'fs';

@Global()
@Module({
  providers: [
    {
      provide: 'FIREBASE_APP',
      useFactory: () => {

        const serviceAccountPath = path.join(__dirname, '..', 'config', 'FIREBASE_SERVICE_ACCOUNT.json');

        if (!fs.existsSync(serviceAccountPath)) {
          throw new Error(`FIREBASE service account not found at ${serviceAccountPath}`);
        }

        const serviceAccount = require(serviceAccountPath);

        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          projectId: process.env.FIREBASE_PROJECT_ID,
        });

        return admin.app();
      },
    },
    {
      provide: 'FIRESTORE',
      useFactory: () => admin.firestore(),
    },
  ],
  exports: ['FIREBASE_APP', 'FIRESTORE'],
})
export class FirebaseModule {}

