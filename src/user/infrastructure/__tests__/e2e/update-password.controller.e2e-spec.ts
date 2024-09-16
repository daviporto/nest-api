import { SignUpDto } from '@/user/infrastructure/dtos/sign-up.dto';
import { en, faker } from '@faker-js/faker';
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
import { UpdateUserDto } from '@/user/infrastructure/dtos/update-user.dto';
import { UserEntity } from '@/user/domain/entities/user.entity';
import { UserDataBuilder } from '@/user/domain/testing/helper/user-data-builder';
import { UpdatePasswordDto } from '@/user/infrastructure/dtos/update-password.dto';
import { HashProvider } from '@/shared/application/providers/hash-provider';
import { BcryptjsHashProvider } from '@/user/infrastructure/providers/hash-provider/bcryptjs-hash.provider';

describe('Update user e2e tests', () => {
  let app: INestApplication;
  let module: TestingModule;
  let repository: UserRepository.Repository;
  let updatePasswordDto: UpdatePasswordDto;
  const prismaService = new PrismaClient();
  const hashProvider: HashProvider = new BcryptjsHashProvider();
  let entity: UserEntity;
  const oldPassword = faker.internet.password();
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
  });

  beforeEach(async () => {
    updatePasswordDto = {
      oldPassword: oldPassword,
      newPassword: faker.internet.password(),
    };

    await prismaService.user.deleteMany();

    entity = new UserEntity(
      UserDataBuilder({
        password: await hashProvider.generateHash(oldPassword),
      }),
    );

    await prismaService.user.create({ data: entity.toJSON() });

    const loginResponse = await request(app.getHttpServer())
      .post('/user/login')
      .send({
        email: entity.email,
        password: oldPassword,
      })
      .expect(200);

    accessToken = loginResponse.body.data.token;
  });

  it('should throw unauthorized when no token sent', async () => {
    await request(app.getHttpServer())
      .patch(`/user/${entity.id}/password`)
      .expect(401)
      .expect({
        statusCode: 401,
        message: 'Unauthorized',
      });
  });

  it('should update a user password', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/user/${entity.id}/password`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(updatePasswordDto)
      .expect(200);

    expect(response.body).toHaveProperty('data');

    expect(Object.keys(response.body.data)).toStrictEqual([
      'id',
      'name',
      'email',
      'createdAt',
    ]);

    const user = await repository.findById(response.body.data.id);

    expect(user.password).not.toBe(entity.password);
    expect(
      await hashProvider.compareHash(
        updatePasswordDto.newPassword,
        user.password,
      ),
    ).toBeTruthy();

    const presenter = UserController.userToResponse(user.toJSON());
    const serialized = instanceToPlain(presenter);

    expect(response.body.data).toStrictEqual(serialized);
  });

  it('should return error when parameters are empty', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/user/${entity.id}/password`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()
      .expect(422);

    expect(response.body).toHaveProperty('error');

    expect(response.body).toMatchObject({
      error: 'Unprocessable Entity',
      message: [
        'oldPassword should not be empty',
        'oldPassword must be a string',
        'newPassword should not be empty',
        'newPassword must be a string',
      ],
    });
  });

  it('should return error when parameter are in wrong format', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/user/${entity.id}/password`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ oldPassword: 123, newPassword: 123 })
      .expect(422);

    expect(response.body).toHaveProperty('error');

    expect(response.body).toMatchObject({
      error: 'Unprocessable Entity',
      message: ['oldPassword must be a string', 'newPassword must be a string'],
    });
  });

  it('should return error when user not found', async () => {
    const id = faker.string.uuid();

    const response = await request(app.getHttpServer())
      .patch(`/user/${id}/password`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(updatePasswordDto)
      .expect(404);

    expect(response.body).toHaveProperty('error');

    expect(response.body).toMatchObject({
      error: 'Not Found',
      message: `User having id ${id} not found`,
    });
  });

  it('should return error when old password is not right', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/user/${entity.id}/password`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        oldPassword: faker.string.uuid(),
        newPassword: updatePasswordDto.newPassword,
      })
      .expect(422);

    expect(response.body).toHaveProperty('error');

    expect(response.body).toMatchObject({
      error: 'Unprocessable Entity',
      message: `Old password invalid`,
    });
  });
});
