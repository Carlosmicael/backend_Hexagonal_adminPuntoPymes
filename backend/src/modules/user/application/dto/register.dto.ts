import { IsString, IsEmail, MinLength, IsDate, IsOptional, IsNumber, Min, Max } from 'class-validator';

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
  direccion?: string;
  @IsOptional()
  fotoPerfilBase64?: string;
  @IsOptional()
  mimeType?: string;
  uid?: string;
  nombreEmpresa?: string;
  @IsNumber()
  @Min(-90) @Max(90)
  lat!: number;
  @IsNumber()
  @Min(-180) @Max(180)
  lng!: number;
}
