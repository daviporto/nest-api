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
import { applyGlobalConfig } from '@/global-config';
import { UserEntity } from '@/user/domain/entities/user.entity';
import { UserDataBuilder } from '@/user/domain/testing/helper/user-data-builder';

describe('Delete user e2e tests', () => {
  let app: INestApplication;
  let module: TestingModule;
  let repository: UserRepository.Repository;
  const prismaService = new PrismaClient();
  let entity: UserEntity;

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
    applyGlobalConfig(app);
    await app.init();

    repository = module.get<UserRepository.Repository>('UserRepository');
  });

  beforeEach(async () => {
    await prismaService.user.deleteMany();

    entity = new UserEntity(UserDataBuilder({}));

    await prismaService.user.create({ data: entity.toJSON() });
  });

  it('should delete a user', async () => {
    await request(app.getHttpServer())
      .delete(`/user/${entity.id}`)
      .expect(204)
      .expect({});

    const count = await prismaService.user.count();

    expect(count).toBe(0);
  });

  it('should return error when user not found', async () => {
    const id = faker.string.uuid();

    const response = await request(app.getHttpServer())
      .delete(`/user/${id}`)
      .send()
      .expect(404);

    expect(response.body).toHaveProperty('error');

    expect(response.body).toMatchObject({
      error: 'Not Found',
      message: `User having id ${id} not found`,
    });
  });
});
