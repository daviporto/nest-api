import { PrismaClient } from '@prisma/client';
import { UserPrismaRepository } from '@/user/infrastructure/database/prisma/repositories/user-prisma.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { setUpPrismaTest } from '@/shared/infrastructure/database/prisma/testing/set-up-prisma-test';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { HashProvider } from '@/shared/application/providers/hash-provider';
import { BcryptjsHashProvider } from '@/user/infrastructure/providers/hash-provider/bcryptjs-hash.provider';
import { faker } from '@faker-js/faker';
import { SignInUsecase } from '@/user/application/usecases/sign-in.usecase';
import { UserDataBuilder } from '@/user/domain/testing/helper/user-data-builder';

describe('Sign up usecase integration tests', () => {
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

  it('should sign in a user', async () => {
    const password = faker.internet.password();
    const user = UserDataBuilder({
      password: await hasProvider.generateHash(password),
    });

    await prismaService.user.create({ data: user });
    const props = {
      email: user.email,
      password: password,
    };

    const output = await sut.execute(props);

    expect(output.id).toBeDefined();
    expect(output.createdAt).toBeInstanceOf(Date);
  });
});
