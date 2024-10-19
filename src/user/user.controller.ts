import { Body, Controller, Get, Post, Redirect } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { Public } from '../auth/decorators/public.decorators';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @Public()
  async register(@Body() userData: UserDto) {
    return await this.userService.create(userData);
  }

  @Get('info')
  @Redirect('/api/auth/profile', 302) // http 状态码, GET 301 永久, 302 临时
  async info() {
    return;
  }

  @Post('login')
  @Public()
  @Redirect('/api/auth/login', 307) //  http 状态码, POST 308 永久, 307 临时
  async login() {
    return;
  }
}
