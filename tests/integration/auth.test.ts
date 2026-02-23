import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import request from 'supertest';
import app from '../src/app.js';
import { AppDataSource } from '../src/config/db.js';
import { hashPassword } from '../src/utils/password.js';
import { User } from '../src/module/user/User.entity.js';

describe('Authentication', () => {
  beforeAll(async () => {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
  });

  afterAll(async () => {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  });

  beforeEach(async () => {
    const repository = AppDataSource.getRepository(User);
    await repository.clear();
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login with valid credentials', async () => {
      const userRepository = AppDataSource.getRepository(User);
      const hashedPassword = await hashPassword('password123');
      
      await userRepository.save({
        email: 'test@example.com',
        password: hashedPassword,
        role: 'MEMBER',
        isActive: true
      });

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body.user.email).toBe('test@example.com');
    });

    it('should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toContain('Invalid credentials');
    });

    it('should reject inactive users', async () => {
      const userRepository = AppDataSource.getRepository(User);
      const hashedPassword = await hashPassword('password123');
      
      await userRepository.save({
        email: 'inactive@example.com',
        password: hashedPassword,
        role: 'MEMBER',
        isActive: false
      });

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'inactive@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toContain('deactivated');
    });
  });
});
