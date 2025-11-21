import { Injectable } from '@nestjs/common';
import { FirebaseUserRepository } from '../infrastructure/repositories/user.repository.firebase';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UpdateUserUseCase {
  constructor(private readonly userRepo: FirebaseUserRepository) {}

  async execute(uid: string, dto: UpdateUserDto) {
    return await this.userRepo.update(uid, dto);
  }
}