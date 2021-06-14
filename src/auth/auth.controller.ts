
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

  @Post('login')
  @HttpCode(200)
  login(@Body() data): string {
    return AuthService.login(data.email, data.password);
  }
}