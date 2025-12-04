import { Injectable } from '@nestjs/common';
import { AdminRepository } from '../../domain/admin.repository';
import { Admin } from '../../domain/admin.entity';
import * as firebase from 'firebase-admin';

@Injectable()
export class AdminFirestoreRepository implements AdminRepository {
  private collection = firebase.firestore().collection('admins');

  async findByUid(uid: string): Promise<Admin | null> {
    const snap = await this.collection.doc(uid).get();
    if (!snap.exists) return null;

    const data = snap.data();
    if (!data) return null;

    return new Admin(data.uid, data.nombre, data.email, data.role);
  }
}

