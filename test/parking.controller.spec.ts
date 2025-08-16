import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';   // ✅ FIXED
import { AppModule } from '../src/app.module';

describe('ParkingController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    await app.init();
  });

  it('POST /parking_lot should initialize lot', async () => {
    return request(app.getHttpServer())
      .post('/parking_lot')
      .send({ no_of_slot: 2 })
      .expect(201)
      .expect({ total_slot: 2 });
  });

  it('POST /park should allocate slot', async () => {
    return request(app.getHttpServer())
      .post('/park')
      .send({ car_reg_no: 'KA-01', car_color: 'White' })
      .expect(201)
      .expect({ allocated_slot_number: 1 });
  });

  it('GET /status should return occupied slots', async () => {
    return request(app.getHttpServer())
      .get('/status')
      .expect(200)
      .expect(res => {
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty('slot_no');
        expect(res.body[0]).toHaveProperty('registration_no');
      });
  });

  it('GET /registration_numbers/:color should filter by color', async () => {
    return request(app.getHttpServer())
      .get('/registration_numbers/white')
      .expect(200)
      .expect(res => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body).toContain('KA-01');
      });
  });

  it('POST /clear should free slot by reg no', async () => {
    return request(app.getHttpServer())
      .post('/clear')
      .send({ car_registration_no: 'KA-01' })
      .expect(201)
      .expect({ freed_slot_number: 1 });
  });

  afterAll(async () => {
    await app.close();
  });
});
