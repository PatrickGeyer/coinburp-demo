import { NestFactory, Reflector } from '@nestjs/core';
import { authMiddleware } from 'auth/auth.middleware';
import { RateLimitGuard } from 'auth/guards/rate-limit.guard';
import { RolesGuard } from 'auth/guards/roles.guard';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Verify & attach any authentication information to the request
  app.use(authMiddleware)

  app.useGlobalGuards(new RolesGuard(app.get(Reflector)))
  app.useGlobalGuards(new RateLimitGuard(app.get(Reflector)))

  await app.listen(3000);
}
bootstrap();