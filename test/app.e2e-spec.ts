import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { authMiddleware } from '../src/auth/auth.middleware';
import { Reflector } from '@nestjs/core';
import { RateLimitGuard } from '../src/auth/guards/rate-limit.guard';
import { RolesGuard } from '../src/auth/guards/roles.guard';
import { AuthService } from '../src/auth/auth.service';

describe('App', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(authMiddleware)
    app.useGlobalGuards(new RolesGuard(app.get(Reflector)))
    app.useGlobalGuards(new RateLimitGuard(app.get(Reflector)))
    await app.init();
  });

  describe('Auth', () => {
    it('should accept correct login details', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'admin@coinburp.com',
          password: 'password'
        })
        .expect(200);
    });
    it('should reject incorrect login details', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'admin@coinburp.com',
          password: 'wrong'
        })
        .expect(403);
    });
  })

  describe('Roles', () => {
    const userToken = AuthService.login('user@coinburp.com', 'password');
    const adminToken = AuthService.login('admin@coinburp.com', 'password');

    it('should allow unauthenticated user to access open endpoint', () => {
      return request(app.getHttpServer())
        .get('/price')
        .expect(200);
    });

    it('should reject unauthenticated user from accessing endpoint', () => {
      return request(app.getHttpServer())
        .get('/trade')
        .expect(403);
    });

    it('should reject user from accessing admin endpoint', () => {
      return request(app.getHttpServer())
        .get('/users')
        .set({ 'x-access-token': userToken })
        .expect(403);
    });

    it('should allow admin user to access admin endpoint', () => {
      return request(app.getHttpServer())
        .get('/users')
        .set({ 'x-access-token': adminToken })
        .expect(200);
    });
  })

  describe('Rate Limiter', () => {
    const userToken = AuthService.login('user@coinburp.com', 'password');
    const adminToken = AuthService.login('admin@coinburp.com', 'password');

    it('should throw error when one user queries endpoint too many times', async () => {
      await request(app.getHttpServer())
        .get('/trade')
        .set({ 'x-access-token': adminToken })
        .expect(200);

      await request(app.getHttpServer())
        .get('/trade')
        .set({ 'x-access-token': adminToken })
        .expect(429);

      await request(app.getHttpServer())
        .get('/trade')
        .set({ 'x-access-token': userToken })
        .expect(200);
    });
  })

});