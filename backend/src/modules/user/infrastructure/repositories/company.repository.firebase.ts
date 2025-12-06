
import { Inject, Injectable } from '@nestjs/common';
import { firestore } from 'firebase-admin';

@Injectable()
export class FirebaseCompanyRepository {
  constructor(@Inject('FIRESTORE') private readonly firestore: firestore.Firestore) { }

  async findOrCreateCompany(ruc: string, nombre: string, direccion: string, telefono: string) {
    const snap = await this.firestore.collection('companies')
      .where('ruc', '==', ruc).get();

    if (!snap.empty) return snap.docs[0].id;

    const ref = await this.firestore.collection('companies').add({
      ruc,
      nombre,
      direccion,
      telefono,
      createdAt: new Date(),
    });
    return ref.id;
  }

  async addBranch(empresaId: string, sucursal: string, lat: number, lng: number, direccion?: string) {
    await this.firestore.collection('companies')
      .doc(empresaId).collection('branches').add({
        nombre: sucursal,
        latitud: lat,
        longitud: lng,
        rangoGeografico: 100,
        direccion,
        createdAt: new Date()
      });
  }

  async getBranchById(companyId: string, branchId: string) {
    const doc = await this.firestore
      .collection('companies').doc(companyId)
      .collection('branches').doc(branchId)
      .get();

    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as any;
  }
}
