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
