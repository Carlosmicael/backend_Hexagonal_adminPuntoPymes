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

        const serviceAccountPath = path.resolve(process.cwd(), 'src/infrastructure/config/firebase.config.json');

        if (!fs.existsSync(serviceAccountPath)) {
          throw new Error(`FIREBASE service account not found at ${serviceAccountPath}`);
        }

        const serviceAccount = require(serviceAccountPath);

        if (!admin.apps.length) {
          admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            storageBucket: `${serviceAccount.project_id}.appspot.com` 
          });
        }

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