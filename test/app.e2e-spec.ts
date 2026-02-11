import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { TestService } from './test.service';
import { TestModule } from './test.module';
import * as jwt from 'jsonwebtoken';

describe('E2E Tests', () => {
  let app: INestApplication<App>;
  let testService: TestService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    testService = app.get(TestService);
  });

  describe('UserController', () => {
    describe('POST /api/users', () => {
      it('should be rejected if request is invalid', async () => {
        const response = await request(app.getHttpServer())
          .post('/api/users')
          .send({
            email: '',
            firstName: '',
            lastName: '',
            username: '',
            password: '',
          });

        expect(response.status).toBe(400);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(response.body.data).toBeDefined();
      });
    });

    describe('POST /api/users', () => {
      beforeEach(async () => {
        await testService.deleteAll();
      });

      it('should be able to register', async () => {
        const response = await request(app.getHttpServer())
          .post('/api/users')
          .send({
            email: 'test@test.com',
            firstName: 'Test',
            lastName: null,
            username: 'test',
            password: '123',
          });

        expect(response.status).toBe(201);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(typeof response.body.data).toBe('string');
      });
    });

    describe('POST /api/users', () => {
      it('should be Username already exists', async () => {
        const response = await request(app.getHttpServer())
          .post('/api/users')
          .send({
            email: 'test@test.com',
            firstName: 'Test',
            lastName: null,
            username: 'test',
            password: '123',
          });

        expect(response.status).toBe(400);
      });
    });

    describe('POST /api/users/login', () => {
      it('should be rejected if request is invalid', async () => {
        const response = await request(app.getHttpServer())
          .post('/api/users/login')
          .send({
            username: '',
            password: '',
          });

        expect(response.status).toBe(400);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(response.body.data).toBeDefined();
      });
    });

    describe('POST /api/users/login', () => {
      it('should be able to login', async () => {
        const response = await request(app.getHttpServer())
          .post('/api/users/login')
          .send({
            username: 'test',
            password: '123',
          });

        expect(response.status).toBe(200);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(typeof response.body.data).toBe('string');
      });
    });

    describe('POST /api/users/login', () => {
      it('should be Username or password is invalid mean user not found', async () => {
        const response = await request(app.getHttpServer())
          .post('/api/users/login')
          .send({
            username: 'testing',
            password: '123',
          });

        expect(response.status).toBe(401);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(response.body.data).toBeDefined();
      });
    });

    describe('POST /api/users/login', () => {
      it('should be Username or password is invalid mean password wrong', async () => {
        const response = await request(app.getHttpServer())
          .post('/api/users/login')
          .send({
            username: 'test',
            password: '1233',
          });

        expect(response.status).toBe(401);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(response.body.data).toBeDefined();
      });
    });
  });

  describe('PostController', () => {
    it('should need to be login', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/posts')
        .send({
          post_text: '',
          visibility: 'publish',
        });

      expect(response.status).toBe(401);
    });

    it('should not be able to post cause validation error', async () => {
      const responseUser = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          username: 'test',
          password: '123',
        });

      expect(responseUser.status).toBe(200);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
      const token = responseUser.body.data;

      const responsePost = await request(app.getHttpServer())
        .post('/api/posts')
        .set('authorization', `Bearer ${token}`)
        .send({
          post_text: '',
          visibility: '',
        });

      expect(responsePost.status).toBe(400);
    });

    it('should be able to post', async () => {
      const responseUser = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          username: 'test',
          password: '123',
        });

      expect(responseUser.status).toBe(200);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
      const token = responseUser.body.data;

      const responsePost = await request(app.getHttpServer())
        .post('/api/posts')
        .set('authorization', `Bearer ${token}`)
        .send({
          post_text: 'test status',
          visibility: 'publish',
        });

      expect(responsePost.status).toBe(201);
    });

    it('should be able to get all posts', async () => {
      const dataUser = await getCurrentUser();

      const responsePost = await request(app.getHttpServer())
        .get('/api/posts')
        .set('authorization', `Bearer ${dataUser.token}`);

      expect(responsePost.status).toBe(200);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(responsePost.body.data).toBeInstanceOf(Array);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(responsePost.body.data.length).toBeGreaterThan(0);
    });

    it('should be able to get post by user id', async () => {
      const responseUser = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          username: 'test',
          password: '123',
        });

      expect(responseUser.status).toBe(200);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
      const token = responseUser.body.data;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
        userId: number;
        accessToken: string;
      };
      const userId = payload.userId;

      const responsePost = await request(app.getHttpServer())
        .get(`/api/posts/users/${userId}`)
        .set('authorization', `Bearer ${token}`);

      expect(responsePost.status).toBe(200);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(responsePost.body.data).toBeInstanceOf(Array);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(responsePost.body.data.length).toBeGreaterThan(0);
    });

    it('should be able to update post', async () => {
      const dataUser = await getCurrentUser();

      const responsePost = await request(app.getHttpServer())
        .get(`/api/posts/users/${dataUser.userId}`)
        .set('authorization', `Bearer ${dataUser.token}`);

      expect(responsePost.status).toBe(200);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(responsePost.body.data).toBeInstanceOf(Array);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(responsePost.body.data.length).toBeGreaterThan(0);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
      const postId = responsePost.body.data[0].postId;

      const responseUpdatePost = await request(app.getHttpServer())
        .patch(`/api/posts/${postId}`)
        .set('authorization', `Bearer ${dataUser.token}`)
        .send({
          post_text: 'test status',
          visibility: 'archive',
        });

      expect(responseUpdatePost.status).toBe(200);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(typeof responseUpdatePost.body.data).toBe('object');
    });

    it('should not be able to delete post', async () => {
      const dataUser = await getCurrentUser();

      const responseUpdatePost = await request(app.getHttpServer())
        .delete(`/api/posts/0`)
        .set('authorization', `Bearer ${dataUser.token}`);

      expect(responseUpdatePost.status).toBe(400);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(typeof responseUpdatePost.body.data).toBe('string');
    });

    it('should be able to delete post', async () => {
      const dataUser = await getCurrentUser();

      const responsePost = await request(app.getHttpServer())
        .get(`/api/posts/users/${dataUser.userId}`)
        .set('authorization', `Bearer ${dataUser.token}`);

      expect(responsePost.status).toBe(200);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(responsePost.body.data).toBeInstanceOf(Array);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(responsePost.body.data.length).toBeGreaterThan(0);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
      const postId = responsePost.body.data[0].postId;

      const responseUpdatePost = await request(app.getHttpServer())
        .delete(`/api/posts/${postId}`)
        .set('authorization', `Bearer ${dataUser.token}`);

      expect(responseUpdatePost.status).toBe(200);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(typeof responseUpdatePost.body.data).toBe('string');
    });
  });

  const getCurrentUser = async (): Promise<{
    userId: number;
    token: string;
  }> => {
    const responseUser = await request(app.getHttpServer())
      .post('/api/users/login')
      .send({
        username: 'test',
        password: '123',
      });

    expect(responseUser.status).toBe(200);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const token = responseUser.body.data as string;

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
      accessToken: string;
    };

    return {
      userId: payload.userId,
      token,
    };
  };
});
