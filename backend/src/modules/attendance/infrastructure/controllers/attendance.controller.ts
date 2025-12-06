import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { RegisterAttendanceUseCase } from '../../application/register-attendance.usecase';
import { RegisterAttendanceDto } from '../dto/register-attendance.dto';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly registerUseCase: RegisterAttendanceUseCase) {}

  @UseGuards(JwtAuthGuard)
  @Post('register')
  async register(@Request() req, @Body() dto: RegisterAttendanceDto) {
    // req.user viene del JwtStrategy (asumiendo que guarda { uid, empresaId, ... })
    const { uid, empresaId } = req.user; 

    return await this.registerUseCase.execute(
      empresaId,
      uid,
      dto.lat,
      dto.lng
    );
  }
}