
import { Controller, Get } from '@nestjs/common';
import { Role } from './auth/guards/role.enum';
import { Roles } from './auth/guards/decorator/roles.decorator';
import { users } from './auth/users.db';
import { RateLimit } from './auth/guards/decorator/rate-limit.decorator';

@Controller()
export class AppController {

  // Any logged in user can view trade endpoint, but is rate limited
  @Get('trade')
  @Roles(Role.User)
  @RateLimit(1, 'hour')
  trade() {
    return `Congratulations! Request successful`
  }

  // Anyone can view price endpoint
  @Get('price')
  price() {
    return `Congratulations! Request successful`
  }

  // Only let admins list users on the platform
  @Get('users')
  @Roles(Role.Admin)
  users() {
    return users.map(i => {
      delete i.password;
      return i;
    })
  }
}