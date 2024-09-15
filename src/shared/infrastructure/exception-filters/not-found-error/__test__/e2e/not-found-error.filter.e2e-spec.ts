import { Controller, Get, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import request from 'supertest';
import { UserWithIdNotFoundError } from '@/user/infrastructure/errors/user-with-id-not-found-error';
import { NotFoundErrorFilter } from '@/shared/infrastructure/exception-filters/not-found-error/not-found-error.filter';
import { UserWithEmailNotFoundError } from '@/user/domain/errors/user-with-email-not-found-error';

const id = faker.string.uuid();
const email = faker.internet.email();

@Controller('/stub')
class StubController {
  @Get('/id')
  idException() {
    throw new UserWithIdNotFoundError(id);
  }

  @Get('/email')
  emailException() {
    throw new UserWithEmailNotFoundError(email);
  }
}

describe('ConflictErrorFilter', () => {
  let app: INestApplication;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [StubController],
    }).compile();
    app = module.createNestApplication();

    app.useGlobalFilters(new NotFoundErrorFilter());
    await app.init();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(new NotFoundErrorFilter()).toBeDefined();
  });

  it('should catch id error correctly', async () => {
    await request(app.getHttpServer())
      .get('/stub/id')
      .expect(404)
      .expect({
        statusCode: 404,
        error: 'Not Found',
        message: `User having id ${id} not found`,
      });
  });

  it('should catch email error correctly', async () => {
    await request(app.getHttpServer())
      .get('/stub/email')
      .expect(404)
      .expect({
        statusCode: 404,
        error: 'Not Found',
        message: `User with email ${email} not found`,
      });
  });
});
