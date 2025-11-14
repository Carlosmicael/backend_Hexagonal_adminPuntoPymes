import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { CreateUserUseCase } from '../../application/create-user.usecase';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  // Protegemos la ruta con JWT
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreateUserDto) {
    const user = await this.createUserUseCase.execute(dto.name, dto.email);
    return { id: user.id, name: user.name, email: user.email };
  }
}


/*
@Controller('users')
export class UserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post()
  async create(@Body() dto: CreateUserDto) {
    const user = await this.createUserUseCase.execute(dto.name, dto.email);
    return { id: user.id, name: user.name, email: user.email };
  }
}*/
