
import { Module } from '@nestjs/common';
import { AuthController } from './infrastructure/controllers/auth.controller';
import { FirebaseModule } from '../../infrastructure/database/firebase.module';
import { AdminFirestoreRepository } from './infrastructure/repositories/admin.firestore.repository';
import { AuthService } from './application/admin.service';

@Module({
  imports: [FirebaseModule],
  controllers: [AuthController],
  providers: [AuthService, { provide: 'AdminRepository', useClass: AdminFirestoreRepository }],
})
export class AdminModule {}