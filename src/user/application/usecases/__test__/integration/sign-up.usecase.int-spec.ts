import { PrismaClient } from '@prisma/client';
import { UserPrismaRepository } from '@/user/infrastructure/database/prisma/repositories/user-prisma.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { setUpPrismaTest } from '@/shared/infrastructure/database/prisma/testing/set-up-prisma-test';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { UserDataBuilder } from '@/user/domain/testing/helper/user-data-builder';
import { faker } from '@faker-js/faker';
import { UserWithIdNotFoundError } from '@/user/infrastructure/errors/user-with-id-not-found-error';
import { UpdateUserUsecase } from '@/user/application/usecases/update-user.usecase';
import { UpdatePasswordUsecase } from '@/user/application/usecases/update-password.usecase';
import { HashProvider } from '@/shared/application/providers/hash-provider';
import { BcryptjsHashProvider } from '@/user/infrastructure/providers/hash-provider/bcryptjs-hash.provider';
import { SignInUsecase } from '@/user/application/usecases/sign-in.usecase';
import { UserWithEmailNotFoundError } from '@/user/domain/errors/user-with-email-not-found-error';
import { InvalidCredentialsError } from '@/user/application/errors/invalid-credentials-error';

describe('Sign in usecase integration tests', () => {
  const prismaService = new PrismaClient();
  let repository: UserPrismaRepository;
  let sut: SignInUsecase.UseCase;
  let module: TestingModule;
  let hasProvider: HashProvider;

  beforeAll(async () => {
    setUpPrismaTest();

    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();

    repository = new UserPrismaRepository(prismaService as any);
    hasProvider = new BcryptjsHashProvider();
  });

  beforeEach(async () => {
    sut = new SignInUsecase.UseCase(repository, hasProvider);
    await prismaService.user.deleteMany();
  });

  afterAll(async () => {
    await prismaService.$disconnect();
    await module.close();
  });

  it('should throw error when user not found', () => {
    const email = faker.internet.email();
    expect(() =>
      sut.execute({
        email,
        password: faker.internet.password(),
      }),
    ).rejects.toThrowError(new UserWithEmailNotFoundError(email));
  });

  it('should test with different password', async () => {
    const user = await prismaService.user.create({
      data: UserDataBuilder({
        password: await hasProvider.generateHash(faker.internet.password()),
      }),
    });

    await expect(() =>
      sut.execute({
        email: user.email,
        password: faker.internet.password(),
      }),
    ).rejects.toThrowError(new InvalidCredentialsError());
  });

  it('should update a user password', async () => {
    const password = faker.internet.password();

    const user = await prismaService.user.create({
      data: UserDataBuilder({
        password: await hasProvider.generateHash(password),
      }),
    });

    const output = await sut.execute({
      email: user.email,
      password,
    });

    expect(output.id).toBe(user.id);
  });
});
