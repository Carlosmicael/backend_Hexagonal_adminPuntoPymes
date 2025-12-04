import { Controller, Get } from '@nestjs/common';
import { GetUsersUseCase } from '../../application/get-user.usecase';

@Controller('users')
export class UserController {
  constructor(private readonly getUserUseCase: GetUsersUseCase) {}

  @Get()
  async findAll() {
    return this.getUserUseCase.execute();
  }
}
