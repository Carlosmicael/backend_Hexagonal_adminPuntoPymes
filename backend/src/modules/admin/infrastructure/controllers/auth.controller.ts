import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from '../../application/admin.service';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body('idToken') idToken: string, @Res({ passthrough: true }) res: any) {
    console.log('ID Token received:', idToken);
    const session = await this.authService.login(idToken);

    res.cookie('session', session.token, {
      httpOnly: true,
      secure: false, 
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24, 
    });

    return { user: session.user }; 
  }
}
