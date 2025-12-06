import { Inject, Injectable } from '@nestjs/common';
import { firestore } from 'firebase-admin';
import moment from 'moment-timezone';

@Injectable()
export class FirebaseAttendanceRepository {
  constructor(@Inject('FIRESTORE') private readonly firestore: firestore.Firestore) {}

  // Buscar registros de HOY para este empleado
  async getTodayRecords(companyId: string, employeeId: string) {
    // Definir "hoy" (ajustar zona horaria según necesidad, ej: 'America/Guayaquil')
    const todayStr = moment().tz('America/Guayaquil').format('YYYY-MM-DD');

    const snapshot = await this.firestore
      .collection('companies').doc(companyId)
      .collection('employees').doc(employeeId)
      .collection('attendance')
      .where('fecha', '==', todayStr)
      .get();

    return snapshot.docs.map(doc => doc.data());
  }

  // Guardar el registro
  async create(companyId: string, employeeId: string, data: any) {
    return await this.firestore
      .collection('companies').doc(companyId)
      .collection('employees').doc(employeeId)
      .collection('attendance')
      .add({
        ...data,
        createdAt: new Date(), // Timestamp del servidor (Auditoría)
      });
  }
}