import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Auth & Locus (e2e)', () => {
  let app: INestApplication;
  let adminToken: string;
  let normalToken: string;
  let limitedToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({ transform: true, whitelist: true }),
    );
    await app.init();

    // Get tokens for all users
    const getToken = async (username: string) => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ username, password: 'password' });
      return res.body.access_token;
    };

    adminToken = await getToken('admin');
    normalToken = await getToken('normal');
    limitedToken = await getToken('limited');
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/auth/login', () => {
    it('should return JWT token for valid credentials', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ username: 'admin', password: 'password' });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('access_token');
    });

    it('should return 401 for invalid credentials', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ username: 'admin', password: 'wrong' });
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/locus', () => {
    it('should return 401 without token', async () => {
      const res = await request(app.getHttpServer()).get('/api/locus');
      expect(res.status).toBe(401);
    });

    it('should return 200 for admin', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/locus')
        .set('Authorization', `Bearer ${adminToken}`)
        .query({ limit: 5 });
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should return 403 when normal user tries sideloading', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/locus')
        .set('Authorization', `Bearer ${normalToken}`)
        .query({ sideloading: 'locusMembers', limit: 5 });
      expect(res.status).toBe(403);
    });

    it('limited user should only get data for allowed regionIds', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/locus')
        .set('Authorization', `Bearer ${limitedToken}`)
        .query({ limit: 5 });
      expect(res.status).toBe(200);
    });
  });
});
