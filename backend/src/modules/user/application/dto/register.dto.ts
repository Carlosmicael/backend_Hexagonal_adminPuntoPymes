import { IsString, IsEmail, MinLength, IsDate, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsString() nombres!: string;
  @IsString() apellidos!: string;
  @IsString() cedula!: string;
  @IsEmail() correo!: string;
  @IsString() telefono!: string;
  @IsString() genero!: string;
  @IsDate() fechaNacimiento!: string;
  @IsString() usuario!: string;
  @MinLength(6) contrasena!: string;
  @IsString() ruc!: string;
  @IsString() sucursal!: string;
  lat!: number;
  lng!: number;
  direccion?: string;
  @IsOptional()
  fotoPerfilFile?: string;
  @IsOptional()
  mimeType?: string;
  uid?: string;
  nombreEmpresa?: string;
}
