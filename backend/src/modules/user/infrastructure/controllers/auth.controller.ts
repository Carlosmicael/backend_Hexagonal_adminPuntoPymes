import { Controller, Post, Body, UnauthorizedException, BadRequestException } from '@nestjs/common';
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
    // 1. Validar duplicados antes de procesar nada
    const existingUser = await this.userRepo.findByUsername(dto.usuario);
    if (existingUser) throw new BadRequestException('El usuario ya existe');

    // 2. Generar el UID del usuario PREVIAMENTE
    const newUserId = this.userRepo.generateId();

    // 3. Manejo de Empresa
    const empresaId = await this.companyRepo.findOrCreateCompany(
      dto.ruc,
      dto.nombreEmpresa ?? 'UTPL'
    );
    
    // Si dirección es undefined, pasar string vacío
    await this.companyRepo.addBranch(empresaId, dto.sucursal, dto.lat, dto.lng, dto.direccion ?? '');

    // 4. Manejo de Imagen: Usamos el newUserId generado
    let fotoPerfilUrl = 'https://cdn-icons-png.flaticon.com/512/266/266134.png'; // Default
    
    if (dto.fotoPerfilBase64 && dto.fotoPerfilBase64.length > 0) {
      try {
        const base64Data = dto.fotoPerfilBase64.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, 'base64');
        // AHORA guardamos en perfiles/{ID_REAL}/foto_perfil.jpg
        fotoPerfilUrl = await this.firebase.uploadProfileImage(
          newUserId, 
          buffer,
          dto.mimeType ?? 'image/jpeg'
        );
      } catch (error) {
        console.error('Error subiendo imagen:', error);
        // Decidir si fallar el registro o continuar con imagen por defecto
      }
    }

    // 5. Crear usuario usando el ID generado y la URL correcta
    await this.userRepo.createUserWithId(newUserId, dto, fotoPerfilUrl, empresaId);

    return { uid: newUserId, usuario: dto.usuario };
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
