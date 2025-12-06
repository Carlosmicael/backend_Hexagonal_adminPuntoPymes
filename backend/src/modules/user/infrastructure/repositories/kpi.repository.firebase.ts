import { Inject, Injectable } from '@nestjs/common';
import { firestore } from 'firebase-admin';

@Injectable()
export class FirebaseKpiRepository {
  constructor(@Inject('FIRESTORE') private readonly firestore: firestore.Firestore) {}

  // Agregar un registro de KPI
  async addKpiValue(companyId: string, employeeId: string, data: {
    kpiId: string;
    valor: number;
    periodo: string;
    comentarios?: string;
  }) {
    const ref = await this.firestore
      .collection('companies').doc(companyId)
      .collection('employees').doc(employeeId)
      .collection('kpis')
      .add({
        ...data,
        registradoAt: new Date()
      });
      
    return ref.id;
  }

  // Obtener KPIs de un empleado
  async getKpis(companyId: string, employeeId: string) {
    const snapshot = await this.firestore
      .collection('companies').doc(companyId)
      .collection('employees').doc(employeeId)
      .collection('kpis')
      .orderBy('periodo', 'desc')
      .get();

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
}