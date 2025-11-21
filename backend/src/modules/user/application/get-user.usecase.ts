import { Injectable } from '@nestjs/common';
import { FirebaseUserRepository } from '../infrastructure/repositories/user.repository.firebase';

@Injectable()
export class GetUserUseCase {
  constructor(private readonly userRepo: FirebaseUserRepository) {}

  async execute(uid: string) {
    const user = await this.userRepo.findById(uid);
    if (!user) throw new Error('Usuario no encontrado');
    // Opcional: Borrar el passwordHash antes de enviarlo al front
    const { passwordHash, ...userWithoutPass } = user;
    return userWithoutPass;
  }
}