import { UserInMemoryRepository } from '@/user/infrastructure/database/in-memory/repositories/user-in-memory.repository';
import { GetUserUsecase } from '@/user/application/usecases/get-user.usecase';
import { UserEntity } from '@/user/domain/entities/user.entity';
import { UserDataBuilder } from '@/user/domain/testing/helper/user-data-builder';
import { UserWithIdNotFoundError } from '@/user/infrastructure/errors/user-with-id-not-found-error';

describe('Signup use case test', () => {
  let sut: GetUserUsecase.UseCase;
  let repository: UserInMemoryRepository;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    sut = new GetUserUsecase.UseCase(repository);
  });

  it('should throw UserWithEmailNotFoundError if user does not exist', async () => {
    const input = { id: 'non-existent-id' };

    await expect(sut.execute(input)).rejects.toThrow(
      new UserWithIdNotFoundError(input.id),
    );
  });

  it('should return user details if user exists', async () => {
    const user = new UserEntity(UserDataBuilder({}));
    await repository.insert(user);

    const input = { id: user.id };

    const result = await sut.execute(input);

    expect(result).toStrictEqual(user.toJSON());
  });

  it('should call repository findById with correct ID', async () => {
    const user = new UserEntity(UserDataBuilder({}));
    await repository.insert(user);

    const spyFindById = jest.spyOn(repository, 'findById');

    const input = { id: user.id };

    await sut.execute(input);

    expect(spyFindById).toHaveBeenCalledWith(user.id);
  });
});
