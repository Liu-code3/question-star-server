import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from '../user/dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() userInfo: UserDto) {
    const { username, password } = userInfo;

    return await this.authService.signIn(username, password);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
