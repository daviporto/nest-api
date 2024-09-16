import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from '@/user/domain/repositories/user.repository';
import { PrismaClient } from '@prisma/client';
import { setUpPrismaTest } from '@/shared/infrastructure/database/prisma/testing/set-up-prisma-test';
import { UserModule } from '@/user/infrastructure/user.module';
import { EnvConfigModule } from '@/shared/infrastructure/env-config/env-config.module';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import request from 'supertest';
import { instanceToPlain } from 'class-transformer';
import { applyGlobalConfig } from '@/global-config';
import { HashProvider } from '@/shared/application/providers/hash-provider';
import { SignInDto } from '@/user/infrastructure/dtos/sign-in.dto';
import { BcryptjsHashProvider } from '@/user/infrastructure/providers/hash-provider/bcryptjs-hash.provider';
import { UserDataBuilder } from '@/user/domain/testing/helper/user-data-builder';
import { LogInUserPresenter } from '@/user/infrastructure/presenters/log-in-user.presenter';

describe('Log in user e2e tests', () => {
  let app: INestApplication;
  let module: TestingModule;
  let repository: UserRepository.Repository;
  let signInDto: SignInDto;
  let hasProvider: HashProvider;
  const prismaService = new PrismaClient();
  const user = UserDataBuilder({});
  let hashedPassword: string;

  beforeAll(async () => {
    hasProvider = new BcryptjsHashProvider();

    setUpPrismaTest();
    module = await Test.createTestingModule({
      imports: [
        UserModule,
        EnvConfigModule,
        DatabaseModule.forTest(prismaService),
      ],
    }).compile();

    app = module.createNestApplication();
    applyGlobalConfig(app);
    await app.init();

    repository = module.get<UserRepository.Repository>('UserRepository');
  });

  beforeEach(async () => {
    await prismaService.user.deleteMany();
    hashedPassword = await hasProvider.generateHash(user.password);
    await prismaService.user.create({
      data: { ...user, password: hashedPassword },
    });

    signInDto = {
      email: user.email,
      password: user.password,
    };
  });

  it('should log in a user', async () => {
    const response = await request(app.getHttpServer())
      .post('/user/login')
      .send(signInDto)
      .expect(200);

    expect(response.body).toHaveProperty('data');

    expect(Object.keys(response.body.data)).toStrictEqual([
      'id',
      'name',
      'email',
      'createdAt',
      'token',
    ]);

    const data = response.body.data;
    expect(data.email).toBe(signInDto.email);
    expect(data.token).toBeDefined();

    expect(data.token.length > 1).toBeTruthy();

    const user = await repository.findById(response.body.data.id);

    const presenter = new LogInUserPresenter(user.toJSON(), data.token);
    const serialized = instanceToPlain(presenter);

    expect(response.body.data).toStrictEqual(serialized);
  });

  it('should return error when no parameter in body', async () => {
    const response = await request(app.getHttpServer())
      .post('/user/login')
      .send()
      .expect(422);

    expect(response.body).toHaveProperty('error');

    expect(response.body).toMatchObject({
      error: 'Unprocessable Entity',
      message: [
        'email must be an email',
        'email should not be empty',
        'email must be a string',
        'password should not be empty',
        'password must be a string',
      ],
      statusCode: 422,
    });
  });

  it('should return error when email is not valid', async () => {
    const response = await request(app.getHttpServer())
      .post('/user/login')
      .send({
        ...signInDto,
        email: 'invalid-email',
      })
      .expect(422);

    expect(response.body).toHaveProperty('error');
    expect(response.body).toMatchObject({
      error: 'Unprocessable Entity',
      message: ['email must be an email'],
      statusCode: 422,
    });
  });

  it('should return error when password is not a string', async () => {
    const response = await request(app.getHttpServer())
      .post('/user/login')
      .send({
        ...signInDto,
        password: {} as any,
      })
      .expect(422);

    expect(response.body).toHaveProperty('error');
    expect(response.body).toMatchObject({
      error: 'Unprocessable Entity',
      message: ['password must be a string'],
      statusCode: 422,
    });
  });

  it('should return error with invalid propriety', async () => {
    const response = await request(app.getHttpServer())
      .post('/user/login')
      .send({
        ...signInDto,
        invalid: 'invalid',
      })
      .expect(422);

    expect(response.body).toHaveProperty('error');
    expect(response.body).toMatchObject({
      error: 'Unprocessable Entity',
      message: ['property invalid should not exist'],
      statusCode: 422,
    });
  });

  it('should return error when user not found', async () => {
    const email = faker.internet.email();
    const response = await request(app.getHttpServer())
      .post('/user/login')
      .send({
        email,
        password: signInDto.password,
      })
      .expect(404);

    expect(response.body).toHaveProperty('error');

    expect(response.body).toMatchObject({
      error: 'Not Found',
      message: `User with email ${email} not found`,
    });
  });

  it('should return error when password is not right', async () => {
    const response = await request(app.getHttpServer())
      .post('/user/login')
      .send({
        email: signInDto.email,
        password: faker.string.uuid(),
      })
      .expect(400);

    expect(response).toHaveProperty('error');

    expect(response.body).toMatchObject({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Invalid credentials',
    });
  });
});
