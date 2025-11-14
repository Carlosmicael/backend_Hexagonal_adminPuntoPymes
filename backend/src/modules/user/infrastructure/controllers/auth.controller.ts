import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { FirebaseUserRepository } from '../repositories/user.repository.firebase';
import { FirebaseCompanyRepository } from '../repositories/company.repository.firebase';
import { FirebaseService } from '../../../../infrastructure/database/firebase.service';
import { RegisterDto } from '../../application/dto/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userRepo: FirebaseUserRepository,
    private readonly companyRepo: FirebaseCompanyRepository,
    private readonly firebase: FirebaseService,
    private readonly jwtService: JwtService,
  ) { }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const empresaId = await this.companyRepo.findOrCreateCompany(
      dto.ruc,
      dto.nombreEmpresa ?? 'UTPL' // si viene undefined, pasa string por defecto utpl
    );
    await this.companyRepo.addBranch(empresaId, dto.sucursal, dto.lat, dto.lng, dto.direccion ?? '') //si es undefined, guarda string vacío);

    // Manejo de imagen opcional
    let fotoPerfilUrl = 'https://img.freepik.com/vector-premium/escena-naturaleza-arboles-e-ilustracion-rio_135595-107842.jpg?semt=ais_hybrid&w=740&q=80'; // valor por defecto
    if (dto.fotoPerfilFile) {
      const buffer = Buffer.from(dto.fotoPerfilFile, 'base64');
      fotoPerfilUrl = await this.firebase.uploadProfileImage(
        dto.uid ?? 'temp',
        buffer,
        dto.mimeType ?? 'image/jpeg'
      );
    }

    const uid = await this.userRepo.createUser(dto, fotoPerfilUrl, empresaId);

    return { uid, usuario: dto.usuario };
  }

  @Post('login')
  async login(@Body() body: { usuario: string; contrasena: string }) {
    const { usuario, contrasena } = body;

    const user = await this.userRepo.findByUsername(usuario);
    if (!user) throw new UnauthorizedException('Usuario no encontrado');

    const valid = await bcrypt.compare(contrasena, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Contraseña incorrecta');

    const payload = { uid: user.uid, usuario: user.usuario, rol: user.rol };
    const token = await this.jwtService.signAsync(payload);

    return { access_token: token, uid: user.uid, usuario: user.usuario, rol: user.rol };
  }
}
