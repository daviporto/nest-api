import { PrismaClient } from '@prisma/client';
import { UserPrismaRepository } from '@/user/infrastructure/database/prisma/repositories/user-prisma.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { setUpPrismaTest } from '@/shared/infrastructure/database/prisma/testing/set-up-prisma-test';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { UserDataBuilder } from '@/user/domain/testing/helper/user-data-builder';
import { faker } from '@faker-js/faker';
import { UserWithIdNotFoundError } from '@/user/infrastructure/errors/user-with-id-not-found-error';
import { UpdateUserUsecase } from '@/user/application/usecases/update-user.usecase';

describe('Update user usecase integration tests', () => {
  const prismaService = new PrismaClient();
  let repository: UserPrismaRepository;
  let sut: UpdateUserUsecase.UseCase;
  let module: TestingModule;

  beforeAll(async () => {
    setUpPrismaTest();

    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();

    repository = new UserPrismaRepository(prismaService as any);
  });

  beforeEach(async () => {
    sut = new UpdateUserUsecase.UseCase(repository);
    await prismaService.user.deleteMany();
  });

  afterAll(async () => {
    await prismaService.$disconnect();
    await module.close();
  });

  it('should throw error when user not found', () => {
    const id = faker.string.uuid();
    expect(() =>
      sut.execute({ id, name: faker.person.fullName() }),
    ).rejects.toThrowError(new UserWithIdNotFoundError(id));
  });

  it('should update a user', async () => {
    const user = await prismaService.user.create({ data: UserDataBuilder({}) });

    const newName = faker.person.fullName();
    const output = await sut.execute({ id: user.id, name: newName });

    expect(output.name).toBe(newName);
  });
});
