
import { Module } from '@nestjs/common';
import { UserController } from './infrastructure/controllers/user.controller';
import { FirebaseModule } from '../../infrastructure/database/firebase.module';
import { FirebaseUserRepository } from './infrastructure/repositories/user.repository.firebase';
/*import { CreateUserUseCase } from './application/create-user.usecase';*/
import { GetUsersUseCase } from './application/get-user.usecase';

@Module({
  imports: [FirebaseModule],
  controllers: [UserController],
  providers: [
  GetUsersUseCase,{ provide: 'IUserRepository', useClass: FirebaseUserRepository },
]
})
export class UserModule {}
