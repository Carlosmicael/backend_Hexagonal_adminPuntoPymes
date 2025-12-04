import { User } from '../../domain/user.entity';
import { Timestamp } from '@google-cloud/firestore';

export const fromFirestore = (id: string, data: any): User => {
  if (!data) throw new Error('No data in document');

  const createdAt = data.created_at instanceof Timestamp
    ? data.created_at.toDate()
    : data.created_at instanceof Date
      ? data.created_at
      : undefined;

  const user = new User(id, data.name ?? '', data.email ?? '');
  return user;
};

export const toFirestore = (user: User) => {
  return {
    name: user.name,
    email: user.email,
  };
};
