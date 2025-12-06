import { Inject, Injectable } from '@nestjs/common';
import { firestore } from 'firebase-admin';

@Injectable()
export class FirebaseVacationRepository {
  constructor(@Inject('FIRESTORE') private readonly firestore: firestore.Firestore) {}

  // Crear solicitud de vacaciones
  async requestVacation(companyId: string, employeeId: string, data: {
    fechaInicio: string; 
    fechaFin: string;    
    motivo: string;
  }) {
    const ref = await this.firestore
      .collection('companies').doc(companyId)
      .collection('employees').doc(employeeId)
      .collection('vacations')
      .add({
        ...data,
        estado: 'pendiente',
        createdAt: new Date()
      });

    return ref.id;
  }

  // Listar vacaciones del empleado
  async findAll(companyId: string, employeeId: string) {
    const snapshot = await this.firestore
      .collection('companies').doc(companyId)
      .collection('employees').doc(employeeId)
      .collection('vacations')
      .orderBy('createdAt', 'desc')
      .get();

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // Actualizar estado
  async updateStatus(companyId: string, employeeId: string, requestId: string, estado: 'aprobada' | 'rechazada') {
    await this.firestore
      .collection('companies').doc(companyId)
      .collection('employees').doc(employeeId)
      .collection('vacations').doc(requestId)
      .update({ estado });
  }
}