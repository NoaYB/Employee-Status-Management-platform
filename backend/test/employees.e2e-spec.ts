import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { App } from 'supertest/types';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { EmployeeStatus } from '../src/employees/employee-status.enum';

describe('Employees (e2e)', () => {
  let app: INestApplication<App>;
  let createdEmployeeId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /employees', () => {
    it('should create a new employee', () => {
      return request(app.getHttpServer())
        .post('/employees')
        .send({
          name: 'Test Employee',
          status: EmployeeStatus.Working,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.name).toBe('Test Employee');
          expect(res.body.status).toBe(EmployeeStatus.Working);
          createdEmployeeId = res.body.id;
        });
    });

    it('should create employee with optional title', () => {
      return request(app.getHttpServer())
        .post('/employees')
        .send({
          name: 'Test Employee 2',
          title: 'Software Engineer',
          status: EmployeeStatus.Working,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.title).toBe('Software Engineer');
        });
    });

    it('should fail with invalid status', () => {
      return request(app.getHttpServer())
        .post('/employees')
        .send({
          name: 'Test Employee',
          status: 'InvalidStatus',
        })
        .expect(400);
    });

    it('should fail without name', () => {
      return request(app.getHttpServer())
        .post('/employees')
        .send({
          status: EmployeeStatus.Working,
        })
        .expect(400);
    });
  });

  describe('GET /employees', () => {
    it('should return an array of employees', () => {
      return request(app.getHttpServer())
        .get('/employees')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });
  });

  describe('PATCH /employees/:id/status', () => {
    it('should update employee status', () => {
      return request(app.getHttpServer())
        .patch(`/employees/${createdEmployeeId}/status`)
        .send({
          status: EmployeeStatus.OnVacation,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe(EmployeeStatus.OnVacation);
        });
    });

    it('should return 404 for non-existent employee', () => {
      return request(app.getHttpServer())
        .patch('/employees/99999/status')
        .send({
          status: EmployeeStatus.Working,
        })
        .expect(404);
    });

    it('should fail with invalid status', () => {
      return request(app.getHttpServer())
        .patch(`/employees/${createdEmployeeId}/status`)
        .send({
          status: 'InvalidStatus',
        })
        .expect(400);
    });
  });

  describe('DELETE /employees/:id', () => {
    it('should delete an employee', () => {
      return request(app.getHttpServer())
        .delete(`/employees/${createdEmployeeId}`)
        .expect(200);
    });

    it('should return 404 for non-existent employee', () => {
      return request(app.getHttpServer())
        .delete('/employees/99999')
        .expect(404);
    });
  });

  describe('POST /employees/:id/avatar', () => {
    let testEmployeeId: number;

    beforeAll(async () => {
      // Create a test employee for avatar upload
      const response = await request(app.getHttpServer())
        .post('/employees')
        .send({
          name: 'Avatar Test Employee',
          status: EmployeeStatus.Working,
        });
      testEmployeeId = response.body.id;
    });

    it('should upload avatar image', () => {
      // Create a mock image file
      const mockImage = Buffer.from('fake-image-content');
      return request(app.getHttpServer())
        .post(`/employees/${testEmployeeId}/avatar`)
        .attach('file', mockImage, 'test.jpg')
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('avatarUrl');
          expect(res.body.avatarUrl).toContain('/uploads/');
        });
    });

    it('should return 404 for non-existent employee', () => {
      const mockImage = Buffer.from('fake-image-content');
      return request(app.getHttpServer())
        .post('/employees/99999/avatar')
        .attach('file', mockImage, 'test.jpg')
        .expect(404);
    });

    afterAll(async () => {
      // Clean up test employee
      if (testEmployeeId) {
        await request(app.getHttpServer()).delete(
          `/employees/${testEmployeeId}`,
        );
      }
    });
  });
});
