import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '../../../user/domain/user.repository';
import { User } from '../../../user/domain/user.entity';
import{firestore} from 'firebase-admin';

@Injectable()
export class FirebaseUserRepository implements IUserRepository {
  constructor(@Inject('FIRESTORE') private firestore: firestore.Firestore) {}

  async create(user: User): Promise<User> {
    await this.firestore.collection('users').doc(user.id).set({
      name: user.name,
      email: user.email,
    });
    return user;
  }

  async findAll(): Promise<User[]> {
    const snapshot = await this.firestore.collection('users').get();

    const users: User[] = [];

    snapshot.forEach(doc => {
      const data = doc.data();
      users.push(new User(doc.id, data.name, data.email));
    });

    return users;
  }
}
