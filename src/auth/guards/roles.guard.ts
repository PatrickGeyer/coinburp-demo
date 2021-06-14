import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './decorator/roles.decorator';
import { Role } from './role.enum';

@Injectable()
export class RolesGuard implements CanActivate {

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {

    // Gets 'roles' metadata from endpoint
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles required to access endpoint, allow all requests
    if (!requiredRoles) {
      return true;
    }

    // Otherwise check that auth user has the correct role attached
    const { user } = context.switchToHttp().getRequest();
    if(!user) {
      throw new UnauthorizedException();
    }
    return requiredRoles.some((role) => user?.roles?.includes(role));
  }
}