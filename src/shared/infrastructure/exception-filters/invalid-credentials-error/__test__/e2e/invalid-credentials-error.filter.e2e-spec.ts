import { Controller, Get, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { InvalidCredentialsError } from '@/user/application/errors/invalid-credentials-error';
import { InvalidCredentialsErrorFilter } from '@/shared/infrastructure/exception-filters/invalid-credentials-error/invalid-credentials-error.filter';

@Controller('/stub')
class StubController {
  @Get()
  index() {
    throw new InvalidCredentialsError();
  }
}

describe('InvalidCredentialsErrorFilter', () => {
  let app: INestApplication;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [StubController],
    }).compile();
    app = module.createNestApplication();

    app.useGlobalFilters(new InvalidCredentialsErrorFilter());
    await app.init();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(new InvalidCredentialsErrorFilter()).toBeDefined();
  });

  it('should catch error correctly', async () => {
    await request(app.getHttpServer()).get('/stub').expect(400).expect({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Invalid credentials',
    });
  });
});
