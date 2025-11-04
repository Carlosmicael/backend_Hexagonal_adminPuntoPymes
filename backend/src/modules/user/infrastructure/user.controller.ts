import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { CreateUserUseCase } from '../application/create-user.usecase';
import { InMemoryUserRepository } from './user.repository.memory';

@Controller('users')
export class UserController {
  private readonly createUserUseCase: CreateUserUseCase;

  constructor() {
    // Aquí en la vida real usarías DI (Dependency Injection)
    const repo = new InMemoryUserRepository();
    this.createUserUseCase = new CreateUserUseCase(repo);
  }

  @Post()
  async create(@Body() dto: CreateUserDto) {
    const user = await this.createUserUseCase.execute(dto.name, dto.email);
    return { id: user.id, name: user.name, email: user.email };
  }
}
