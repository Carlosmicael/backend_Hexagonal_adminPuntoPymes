import { PartialType } from '@nestjs/mapped-types';
import { RegisterDto } from './register.dto';
import { IsOptional, IsString } from 'class-validator';

// PartialType hace que todos los campos de RegisterDto sean opcionales
export class UpdateUserDto extends PartialType(RegisterDto) {
  // Sobreescribimos para asegurar que no se requieran validaciones estrictas de creación
  // y excluimos explícitamente lo que NO queremos que toquen (aunque PartialType ayuda).
  
  @IsOptional()
  @IsString()
  nombres?: string;

  @IsOptional()
  @IsString()
  apellidos?: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  genero?: string;
}