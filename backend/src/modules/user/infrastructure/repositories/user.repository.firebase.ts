/*import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../../domain/user.repository';
import { User } from '../../../domain/user.entity';
import { FirebaseService } from '../../../../infrastructure/database/firebase.service';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class FirebaseUserRepository implements IUserRepository {
  constructor(private readonly firebase: FirebaseService) {}

  async create(user: User): Promise<User> {
    const data = UserMapper.toPersistence(user);
    const docRef = await this.firebase.firestore.collection('users').add(data);
    const snapshot = await docRef.get();
    return UserMapper.toDomain(snapshot.data()!, docRef.id);
  }

  async findByEmail(email: string): Promise<User | null> {
    const query = await this.firebase.firestore
      .collection('users')
      .where('email', '==', email)
      .get();

    if (query.empty) return null;

    const doc = query.docs[0];
    return UserMapper.toDomain(doc.data(), doc.id);
  }
}
*/

import { Inject, Injectable } from '@nestjs/common';
import { firestore } from 'firebase-admin';
import { IUserRepository } from '../../domain/user.repository';
import * as bcrypt from 'bcrypt';
import moment from 'moment-timezone';

// Estructura de la Jornada
export interface Jornada {
  id: string;
  horaEntrada: string; // Ej: "09:00:00"
  horaSalida: string;  // Ej: "18:00:00"
  tolerancia: number;  // Ej: 15 (minutos)
  dias: number[];      // Array de números, Ej: [1, 2, 3, 4, 5] (Lunes a Viernes)
  activa: boolean;     // true
}

@Injectable()
export class FirebaseUserRepository {
  constructor(@Inject('FIRESTORE') private readonly firestore: firestore.Firestore) { }

  // Método para generar ID
  generateId(): string {
    return this.firestore.collection('_temp_ids').doc().id;
  }

  // Método modificado para recibir el UID ya generado
  async createUserWithId(uid: string, dto: any, fotoPerfilUrl: string, empresaId: string) {
    const passwordHash = await bcrypt.hash(dto.contrasena, 10);

    await this.firestore
      .collection('companies').doc(empresaId)
      .collection('employees').doc(uid)
      .set({
        // Datos personales
        nombre: dto.nombres,
        apellido: dto.apellidos,
        cedula: dto.cedula,
        correo: dto.correo,
        telefono: dto.telefono,
        genero: dto.genero,
        cargo: dto.cargo || 'Empleado',

        // Datos de sistema
        uid,
        usuario: dto.usuario,
        passwordHash,
        fotoPerfilUrl,

        // Ubicación y Relaciones
        latitud: dto.lat,
        longitud: dto.lng,
        branchId: null,
        manager_id: null,
        status: 'activo',

        // Metadatos
        fechaIngreso: new Date(),
        empresaId
      });

    return uid;
  }

  async findByUsername(usuario: string) {
    const snapshot = await this.firestore.collectionGroup('employees')
      .where('usuario', '==', usuario)
      .get();

    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    const empresaId = doc.ref.parent.parent?.id;

    return { id: doc.id, empresaId, ...doc.data() } as any;
  }

  // Método para LEER el perfil (GET)
  async findById(uid: string) {
    const snap = await this.firestore.collectionGroup('employees')
      .where('uid', '==', uid).get();

    if (snap.empty) return null;
    return snap.docs[0].data();
  }

  // Método para ACTUALIZAR el perfil (PATCH)
  async update(companyId: string, uid: string, data: any) {
    const { uid: id, ...updateData } = data;

    await this.firestore
      .collection('companies').doc(companyId)
      .collection('employees').doc(uid)
      .update(updateData);

    return { uid, ...updateData };
  }



  

  // Metodo para obtener la jornada vigente
 async getJornadaVigente(companyId: string, employeeId: string): Promise<Jornada | null> {
    
    // La jornada se obtiene filtrando el flag 'activa: true'
    const snapshot = await this.firestore
      .collection('companies').doc(companyId)
      .collection('employees').doc(employeeId)
      .collection('jornadas')
      .where('activa', '==', true) // <-- FILTRO CRUCIAL AGREGADO
      .limit(1)
      .get();

    if (snapshot.empty) {
      // Si no hay jornada activa, devuelve null
      return null;
    }
    
    // Retorna la primera (y única activa)
    const doc = snapshot.docs[0];
    return {
        id: doc.id,
        ...doc.data()
    } as Jornada;
  }
}

