import { Module } from '@nestjs/common';
import { UserController } from './infrastructure/controllers/user.controller';

@Module({
  controllers: [UserController],
})
export class UserModule {}



//esto mejora el desacoplamiento ya que solo creamos una nueva injecccion del repositorio

/*import { Module } from '@nestjs/common';
import { UserController } from './infrastructure/controllers/user.controller';
import { DatabaseModule } from '../../infrastructure/database/database.module';
import { FirebaseUserRepository } from './infrastructure/repositories/user.repository.firebase';
import { CreateUserUseCase } from './application/create-user.usecase';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [
    FirebaseUserRepository,
    {
      provide: CreateUserUseCase,
      useFactory: (repo: FirebaseUserRepository) => new CreateUserUseCase(repo),
      inject: [FirebaseUserRepository],
    },
  ],
})
export class UserModule {}
*/

//explicacion

/*
Aquí ocurre lo siguiente:

FirebaseUserRepository se registra como proveedor.

NestJS sabe cómo crear una instancia de FirebaseUserRepository.

Luego, con useFactory, NestJS crea el CreateUserUseCase inyectando el repositorio automáticamente:

useFactory: (repo: FirebaseUserRepository) => new CreateUserUseCase(repo),
inject: [FirebaseUserRepository],


Eso significa:
➤ “Cuando alguien pida un CreateUserUseCase, créalo usando este repositorio”.*/