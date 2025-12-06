import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './infrastructure/controllers/auth.controller';
import { FirebaseUserRepository } from './infrastructure/repositories/user.repository.firebase';
import { FirebaseCompanyRepository } from './infrastructure/repositories/company.repository.firebase';
import { FirebaseService } from '../../infrastructure/database/firebase.service';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'superSecretKey',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    FirebaseUserRepository,
    FirebaseCompanyRepository,
    FirebaseService,
    JwtStrategy,
  ],
})
export class AuthModule { }
