import { Body, Controller, Post, UseGuards, Get, Param, Patch, Request } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { CreateUserUseCase } from '../../application/create-user.usecase';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { UpdateUserDto } from '@modules/user/application/dto/update-user.dto';
import { GetUserUseCase } from '../../application/get-user.usecase';
import { UpdateUserUseCase } from '../../application/update-user.usecase';

@Controller('users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
  ) { }

  // Protegemos la ruta con JWT
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreateUserDto) {
    const user = await this.createUserUseCase.execute(dto.name, dto.email);
    return user;
  }

  // Endpoint para CARGAR los datos en la pantalla
  // GET http://localhost:3000/users/:uid
  @UseGuards(JwtAuthGuard)
  @Get(':uid')
  async getProfile(@Param('uid') uid: string) {
    return await this.getUserUseCase.execute(uid);
  }

  // Endpoint para GUARDAR los cambios
  // PATCH http://localhost:3000/users/:uid
  @UseGuards(JwtAuthGuard) 
  @Patch(':uid')
  async updateProfile(
    @Param('uid') uid: string, 
    @Body() dto: UpdateUserDto,
    @Request() req: any
  ) {
    // Obtenemos el companyId del token del usuario logueado
    const companyId = req.user.empresaId; 
    
    // Pasamos companyId + uid + datos al caso de uso
    return await this.updateUserUseCase.execute(companyId, uid, dto);
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
