import { PrismaClient } from '@prisma/client';
import { UserPrismaRepository } from '@/user/infrastructure/database/prisma/repositories/user-prisma.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { setUpPrismaTest } from '@/shared/infrastructure/database/prisma/testing/set-up-prisma-test';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { UserDataBuilder } from '@/user/domain/testing/helper/user-data-builder';
import { DeleteUserUsecase } from '@/user/application/usecases/delete-user.usecase';
import { faker } from '@faker-js/faker';
import { UserWithIdNotFoundError } from '@/user/infrastructure/errors/user-with-id-not-found-error';
import { GetUserUsecase } from '@/user/application/usecases/get-user.usecase';
import { UserEntity } from '@/user/domain/entities/user.entity';

describe('Get user usecase integration tests', () => {
  const prismaService = new PrismaClient();
  let repository: UserPrismaRepository;
  let sut: GetUserUsecase.UseCase;
  let module: TestingModule;

  beforeAll(async () => {
    setUpPrismaTest();

    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();

    repository = new UserPrismaRepository(prismaService as any);
  });

  beforeEach(async () => {
    sut = new GetUserUsecase.UseCase(repository);
    await prismaService.user.deleteMany();
  });

  afterAll(async () => {
    await prismaService.$disconnect();
    await module.close();
  });

  it('should throw error when user not found', () => {
    const id = faker.string.uuid();
    expect(() => sut.execute({ id })).rejects.toThrowError(
      new UserWithIdNotFoundError(id),
    );
  });

  it('should retrieve a user', async () => {
    const user = await prismaService.user.create({ data: UserDataBuilder({}) });

    const output = await sut.execute({ id: user.id });

    expect(output).toBeDefined();
    expect(output).toMatchObject(user);
  });
});
