import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from '../domain/user.repository';
import { User } from '../domain/user.entity';

@Injectable()
export class GetUsersUseCase {
  constructor(@Inject('IUserRepository') private repo: IUserRepository) {}

  async execute(): Promise<User[]> {
    return this.repo.findAll();
  }
}
