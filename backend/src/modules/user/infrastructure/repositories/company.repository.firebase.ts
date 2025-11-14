
import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../../../../infrastructure/database/firebase.service';

@Injectable()
export class FirebaseCompanyRepository {
  constructor(private readonly firebase: FirebaseService) {}

  async findOrCreateCompany(ruc: string, nombre: string) {
    const snap = await this.firebase.firestore.collection('empresas')
      .where('ruc', '==', ruc).get();

    if (!snap.empty) return snap.docs[0].id;

    const ref = await this.firebase.firestore.collection('empresas').add({
      ruc,
      nombre,
      fechaRegistro: new Date(),
    });
    return ref.id;
  }

  async addBranch(empresaId: string, sucursal: string, lat: number, lng: number, direccion?: string) {
    await this.firebase.firestore.collection('empresas')
      .doc(empresaId).collection('sucursales').add({
        nombreSucursal: sucursal,
        coordenadas: new (require('firebase-admin').firestore.GeoPoint)(lat, lng),
        direccion,
      });
  }
}
