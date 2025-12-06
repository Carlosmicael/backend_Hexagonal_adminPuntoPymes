import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/user/auth.module';
import { FirebaseModule } from './infrastructure/database/firebase.module';
import { AttendanceModule } from './modules/attendance/attendance.module';

@Module({
  imports: [FirebaseModule, UserModule, AuthModule, AttendanceModule],
})
export class AppModule { }
