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
import { ListUsersDto } from '@/user/infrastructure/dtos/list-users.dto';
import { SortOrderEnum } from '@/shared/domain/repositories/searchable-repository-contracts';
import { HashProvider } from '@/shared/application/providers/hash-provider';
import { BcryptjsHashProvider } from '@/user/infrastructure/providers/hash-provider/bcryptjs-hash.provider';

describe('List user e2e tests', () => {
  let app: INestApplication;
  let module: TestingModule;
  let repository: UserRepository.Repository;
  let ListUsersDto: ListUsersDto;
  const prismaService = new PrismaClient();
  let hasProvider: HashProvider;
  let hashPassword: string;
  let accessToken: string;

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
    hasProvider = new BcryptjsHashProvider();
    hashPassword = await hasProvider.generateHash('password');
  });

  beforeEach(async () => {
    await prismaService.user.deleteMany();

    const entity = new UserEntity(
      UserDataBuilder({
        name: 'ZZ',
        password: hashPassword,
      }),
    );

    await prismaService.user.create({ data: entity.toJSON() });

    const loginResponse = await request(app.getHttpServer())
      .post('/user/login')
      .send({
        email: entity.email,
        password: 'password',
      })
      .expect(200);

    accessToken = loginResponse.body.data.token;
  });

  it('should throw unauthorized when no token sent', async () => {
    await request(app.getHttpServer()).get(`/user`).expect(401).expect({
      statusCode: 401,
      message: 'Unauthorized',
    });
  });

  it('should return users in first page with default sorting', async () => {
    const createdAtTime = new Date().getTime();
    const entities = [];
    for (let i = 0; i < 11; i++) {
      const entity = new UserEntity(
        UserDataBuilder({
          createdAt: new Date(createdAtTime - i),
          name: `${i}`,
        }),
      );

      await prismaService.user.create({ data: entity.toJSON() });
      entities.push(entity);
    }

    const response = await request(app.getHttpServer())
      .get(`/user`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    const users = response.body.data;
    const meta = response.body.meta;

    expect(users).toHaveLength(10);
    expect(meta.total).toBe(11 + 1); // + 1used to log in

    for (let i = 0; i < 11; i++) {
      const referenceUser = users.find(
        (user) => user.email === entities[i].email,
      );

      if (i < 10) {
        expect(referenceUser.name).toBe(`${i}`);
        expect(referenceUser).not.toBeNull();
        expect(referenceUser.id).toStrictEqual(entities[i].id);
      } else {
        expect(referenceUser).toBeUndefined();
      }
    }
  });

  it('should filter, sort and paginate', async () => {
    const users = [
      new UserEntity(UserDataBuilder({ name: 'AA' })),
      new UserEntity(UserDataBuilder({ name: 'AB' })),
      new UserEntity(UserDataBuilder({ name: 'AC' })),
      new UserEntity(UserDataBuilder({ name: 'DD' })),
    ];

    for (const user of users) {
      await prismaService.user.create({ data: user.toJSON() });
    }

    const queryParams = {
      filter: 'A',
      sort: 'name',
      sortDir: SortOrderEnum.DESC,
      page: 1,
      perPage: 2,
    };

    const response = await request(app.getHttpServer())
      .get(`/user`)
      .set('Authorization', `Bearer ${accessToken}`)
      .query(queryParams)
      .expect(200);

    const responseUsers = response.body.data;

    expect(responseUsers).toHaveLength(2);
    expect(responseUsers[0].name).toBe('AC');
    expect(responseUsers[1].name).toBe('AB');

    const meta = response.body.meta;
    expect(meta.currentPage).toBe(1);
    expect(meta.lastPage).toBe(2);
    expect(meta.perPage).toBe(2);
    expect(meta.total).toBe(3);
  });

  it('should return a error with invalid fields', async () => {
    const res = await request(app.getHttpServer())
      .get('/user')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ invalid: 'invalid' })
      .expect(422);

    expect(res.body.error).toBe('Unprocessable Entity');
    expect(res.body.message).toEqual(['property invalid should not exist']);
  });
});
