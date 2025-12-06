import { Module } from '@nestjs/common';
import { AttendanceController } from './infrastructure/controllers/attendance.controller';
import { RegisterAttendanceUseCase } from './application/register-attendance.usecase';
import { FirebaseAttendanceRepository } from './infrastructure/repositories/attendance.repository.firebase';

// Repositorios que están en la carpeta 'user' pero son usados aquí
// Nota: Ajusta la ruta a tu 'modules/user/...' si es necesario
import { FirebaseUserRepository } from '../user/infrastructure/repositories/user.repository.firebase';
import { FirebaseCompanyRepository } from '../user/infrastructure/repositories/company.repository.firebase';

// Módulo de la base de datos (Asumo que lo tienes en infrastructure/database)
import { FirebaseModule } from '../../infrastructure/database/firebase.module'; 
// Asegúrate de que 'FirebaseModule' exporte el provider 'FIRESTORE'.

@Module({
  imports: [
    FirebaseModule, // Para proporcionar la dependencia 'FIRESTORE' a los repositorios
    // Otros módulos que necesites importar (ej: AuthModule si usas guardias)
  ],
  controllers: [AttendanceController],
  providers: [
    // 1. Caso de Uso (La clase que NestJS no encontraba)
    RegisterAttendanceUseCase,

    // 2. Repositorios (Las dependencias del Caso de Uso)
    FirebaseAttendanceRepository,
    FirebaseUserRepository,
    FirebaseCompanyRepository,
  ],
})
export class AttendanceModule {}