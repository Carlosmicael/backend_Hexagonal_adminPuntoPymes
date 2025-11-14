import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/user/auth.module';

@Module({
  imports: [UserModule, AuthModule],
})
export class AppModule {}
