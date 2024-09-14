import { SignUpDto } from '@/user/infrastructure/dtos/sign-up.dto';
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
import { UserController } from '@/user/infrastructure/user.controller';
import { instanceToPlain } from 'class-transformer';
import { applyGlobalConfig } from '@/global-config';

describe('UserController e2e tests', () => {
  let app: INestApplication;
  let module: TestingModule;
  let repository: UserRepository.Repository;
  let signUpDto: SignUpDto;
  const prismaService = new PrismaClient();

  beforeAll(async () => {
    setUpPrismaTest();
    module = await Test.createTestingModule({
      imports: [
        UserModule,
        EnvConfigModule,
        DatabaseModule.forTest(prismaService),
      ],
    }).compile();

    app = module.createNestApplication();
    applyGlobalConfig(app)
    await app.init();

    repository = module.get<UserRepository.Repository>('UserRepository');
  });

  beforeEach(async () => {
    signUpDto = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    await prismaService.user.deleteMany();
  });

  it('should create a user', async () => {
    const response = await request(app.getHttpServer())
      .post('/user')
      .send(signUpDto)
      .expect(201);

    expect(response.body).toHaveProperty('data')

    expect(Object.keys(response.body.data)).toStrictEqual([
      'id',
      'name',
      'email',
      'createdAt',
    ]);

    expect(response.body.data).toMatchObject({
      id: expect.any(String),
      name: signUpDto.name,
      email: signUpDto.email,
      createdAt: expect.any(String),
    });

    const user = await repository.findById(response.body.data.id);

    const presenter = UserController.userToResponse(user.toJSON());
    const serialized = instanceToPlain(presenter);

    expect(response.body.data).toStrictEqual(serialized);
  });
});
