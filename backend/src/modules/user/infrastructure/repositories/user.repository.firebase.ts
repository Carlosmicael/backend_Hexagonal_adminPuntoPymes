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

import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../../../../infrastructure/database/firebase.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class FirebaseUserRepository {
  constructor(private readonly firebase: FirebaseService) {}

  // Método para generar ID
  generateId(): string {
    return this.firebase.firestore.collection('usuarios').doc().id;
  }

  // Método modificado para recibir el UID ya generado
  async createUserWithId(uid: string, dto: any, fotoPerfilUrl: string, empresaId: string) {
    const passwordHash = await bcrypt.hash(dto.contrasena, 10);

    await this.firebase.firestore.collection('usuarios').doc(uid).set({
      uid,
      nombres: dto.nombres,
      apellidos: dto.apellidos,
      cedula: dto.cedula,
      correo: dto.correo,
      telefono: dto.telefono,
      genero: dto.genero,
      fechaNacimiento: dto.fechaNacimiento,
      usuario: dto.usuario,
      passwordHash,
      fotoPerfilUrl,
      rol: dto.rol ?? 'Empleado',
      empresaId,
      fechaCreacion: new Date(),
    });

    return uid;
  }

  async findByUsername(usuario: string) {
    const snap = await this.firebase.firestore.collection('usuarios')
      .where('usuario', '==', usuario).get();
    return snap.empty ? null : snap.docs[0].data();
  }

  // Método para LEER el perfil (GET)
  async findById(uid: string) {
    const doc = await this.firebase.firestore.collection('usuarios').doc(uid).get();
    if (!doc.exists) return null;
    return doc.data();
  }

  // Método para ACTUALIZAR el perfil (PATCH)
  async update(uid: string, data: any) {
    // Eliminamos campos que no deben tocarse por seguridad si llegan en el data
    const { uid: id, correo, cedula, ...updateData } = data; 
    
    await this.firebase.firestore.collection('usuarios').doc(uid).update(updateData);
    return { uid, ...updateData };
  }
}

