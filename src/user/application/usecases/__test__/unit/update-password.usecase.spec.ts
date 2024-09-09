import { UserInMemoryRepository } from '@/user/infrastructure/database/in-memory/repositories/user-in-memory.repository';
import { UserEntity } from '@/user/domain/entities/user.entity';
import { UserDataBuilder } from '@/user/domain/testing/helper/user-data-builder';
import { UserWithIdNotFoundError } from '@/user/infrastructure/errors/user-with-id-not-found-error';
import { BadRequestError } from '@/shared/application/errors/bad-request-error';
import { faker } from '@faker-js/faker';
import { BcryptjsHashProvider } from '@/user/infrastructure/providers/hash-provider/bcryptjs-hash.provider';
import { UpdatePasswordUsecase } from '@/user/application/usecases/update-password.usecase';
import { InvalidPasswordError } from '@/user/application/errors/invalid-password-error';

describe('Update user use case test', () => {
  let sut: UpdatePasswordUsecase.UseCase;
  let repository: UserInMemoryRepository;
  let hashProvider: BcryptjsHashProvider;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    hashProvider = new BcryptjsHashProvider();
    sut = new UpdatePasswordUsecase.UseCase(repository, hashProvider);
  });

  it('should throw UserWithIdNotFoundError if user does not exist', async () => {
    const input = {
      id: 'non-existent-id',
      oldPassword: faker.internet.password(),
      newPassword: faker.internet.password(),
    };

    await expect(sut.execute(input)).rejects.toThrow(
      new UserWithIdNotFoundError(input.id),
    );
  });

  it('should throw a BadRequestError if new password is not provided', async () => {
    const input = { id: '1', oldPassword: 'aaa', newPassword: '' };

    await expect(sut.execute(input as any)).rejects.toThrow(BadRequestError);
  });

  it('should throw a BadRequestError if old password is not provided', async () => {
    const input = { id: '1', oldPassword: '', newPassword: 'aaa' };

    await expect(sut.execute(input as any)).rejects.toThrow(BadRequestError);
  });

  it('should throw InvalidPasswordError if old password does not match', async () => {
    const user = new UserEntity(
      UserDataBuilder({
        password: await hashProvider.generateHash('correct-password'),
      }),
    );
    await repository.insert(user);

    const input = {
      id: user.id,
      oldPassword: 'wrong-password',
      newPassword: faker.internet.password(),
    };

    await expect(sut.execute(input)).rejects.toThrow(InvalidPasswordError);
  });

  it('should update the user password correctly', async () => {
    const user = new UserEntity(
      UserDataBuilder({
        password: await hashProvider.generateHash('old-password'),
      }),
    );
    await repository.insert(user);

    const spyUpdate = jest.spyOn(repository, 'update');

    const input = {
      id: user.id,
      oldPassword: 'old-password',
      newPassword: 'new-password',
    };

    const result = await sut.execute(input);

    const isPasswordUpdated = await hashProvider.compareHash(
      'new-password',
      result.password,
    );

    expect(spyUpdate).toHaveBeenCalledWith(user);
    expect(isPasswordUpdated).toBe(true);
  });
});
