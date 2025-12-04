/*import { IUserRepository } from '../domain/user.repository';
import { User } from '../domain/user.entity';
import { v4 as uuid } from 'uuid';

export class CreateUserUseCase {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(name: string, email: string): Promise<User> {
    const existing = await this.userRepo.findByEmail(email);
    if (existing) throw new Error('Email already exists');

    const user = new User(uuid(), name, email);
    return await this.userRepo.create(user);
  }
}
*/