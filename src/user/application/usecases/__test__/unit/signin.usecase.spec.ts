import { SignInUsecase } from '@/user/application/usecases/sign-in.usecase';
import { UserInMemoryRepository } from '@/user/infrastructure/database/in-memory/repositories/user-in-memory.repository';
import { BcryptjsHashProvider } from '@/user/infrastructure/providers/hash-provider/bcryptjs-hash.provider';
import { UserEntity } from '@/user/domain/entities/user.entity';
import { UserDataBuilder } from '@/user/domain/testing/helper/user-data-builder';
import { InvalidCredentialsError } from '@/user/application/errors/invalid-credentials-error';
import { BadRequestError } from '@/shared/application/errors/bad-request-error';
import { faker } from '@faker-js/faker';
import { UserWithEmailNotFoundError } from '@/user/domain/errors/user-with-email-not-found-error';

describe('SignInUsecase', () => {
  let sut: SignInUsecase.UseCase;
  let repository: UserInMemoryRepository;
  let hashProvider: BcryptjsHashProvider;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    hashProvider = new BcryptjsHashProvider();
    sut = new SignInUsecase.UseCase(repository, hashProvider);
  });

  it('should throw BadRequestError if email is not provided', async () => {
    const input = { email: '', password: faker.internet.password() };

    await expect(sut.execute(input)).rejects.toThrow(BadRequestError);
  });

  it('should throw BadRequestError if password is not provided', async () => {
    const input = { email: faker.internet.email(), password: '' };

    await expect(sut.execute(input)).rejects.toThrow(BadRequestError);
  });

  it('should throw UserWithEmailNotFoundError if the email is not found', async () => {
    const input = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    await expect(sut.execute(input)).rejects.toThrow(
      UserWithEmailNotFoundError,
    );
  });

  it('should throw InvalidCredentialsError if the password is incorrect', async () => {
    const user = new UserEntity(
      UserDataBuilder({
        password: await hashProvider.generateHash('correct-password'),
      }),
    );
    await repository.insert(user);

    const input = { email: user.email, password: faker.internet.password() };

    await expect(sut.execute(input)).rejects.toThrow(InvalidCredentialsError);
  });

  it('should return the user on successful sign-in', async () => {
    const user = new UserEntity(
      UserDataBuilder({
        password: await hashProvider.generateHash('correct-password'),
      }),
    );
    await repository.insert(user);

    const input = { email: user.email, password: 'correct-password' };

    const result = await sut.execute(input);

    expect(result).toEqual({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      password: user.password,
    });
  });
});
