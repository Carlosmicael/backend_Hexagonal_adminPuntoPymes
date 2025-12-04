import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import * as firebaseAdmin from 'firebase-admin';
import * as jwt from 'jsonwebtoken';
import { AdminRepository } from '../domain/admin.repository'; 


@Injectable()
export class AuthService {
  constructor(@Inject('AdminRepository') private readonly adminRepository: AdminRepository) {}

  async login(idToken: string) {
    const decoded = await firebaseAdmin.auth().verifyIdToken(idToken);

    const admin = await this.adminRepository.findByUid(decoded.uid);

    if (!admin) throw new UnauthorizedException('Admin no registrado');

    if (admin.role !== 'admin')
      throw new UnauthorizedException('Rol no autorizado');

    const token = jwt.sign({ uid: decoded.uid, role: admin.role }, process.env.JWT_SECRET || 'default_secret_key', {expiresIn: '1d',});

    return { token, user: admin };
  }
}
