import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [UserModule, AdminModule],
})
export class AppModule {}
