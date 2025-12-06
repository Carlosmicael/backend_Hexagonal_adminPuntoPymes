import { Inject, Injectable } from '@nestjs/common';
import { firestore } from 'firebase-admin';

@Injectable()
export class FirebaseAttendanceRepository {
  constructor(@Inject('FIRESTORE') private readonly firestore: firestore.Firestore) {}

  // Registrar Entrada o Salida
  async registerAttendance(companyId: string, employeeId: string, data: {
    latitud: number;
    longitud: number;
    tipo: 'entrada' | 'salida';
    dentroDelRango: boolean;
    deviceInfo?: string;
  }) {
    const attendanceRef = this.firestore
      .collection('companies').doc(companyId)
      .collection('employees').doc(employeeId)
      .collection('attendance');

    const result = await attendanceRef.add({
      ...data,
      fecha: new Date(),
      hora: new Date().toLocaleTimeString('es-EC'),
    });

    return { id: result.id, ...data };
  }

  // Obtener asistencias de un empleado
  async getHistory(companyId: string, employeeId: string, limit: number = 30) {
    const snapshot = await this.firestore
      .collection('companies').doc(companyId)
      .collection('employees').doc(employeeId)
      .collection('attendance')
      .orderBy('fecha', 'desc')
      .limit(limit)
      .get();

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // Verificar si ya marcó entrada hoy
  async hasCheckedInToday(companyId: string, employeeId: string): Promise<boolean> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const snapshot = await this.firestore
      .collection('companies').doc(companyId)
      .collection('employees').doc(employeeId)
      .collection('attendance')
      .where('fecha', '>=', startOfDay)
      .where('tipo', '==', 'entrada')
      .get();

    return !snapshot.empty;
  }
}