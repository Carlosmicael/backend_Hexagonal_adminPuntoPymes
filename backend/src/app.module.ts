import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/infrastructure/user.module';

@Module({
  imports: [UserModule],
})
export class AppModule {}
