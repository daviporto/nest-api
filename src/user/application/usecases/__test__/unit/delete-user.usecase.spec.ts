import { UserInMemoryRepository } from '@/user/infrastructure/database/in-memory/repositories/user-in-memory.repository';
import { GetUserUsecase } from '@/user/application/usecases/get-user.usecase';
import { UserEntity } from '@/user/domain/entities/user.entity';
import { UserDataBuilder } from '@/user/domain/testing/helper/user-data-builder';
import { UserWithIdNotFoundError } from '@/user/infrastructure/errors/user-with-id-not-found-error';
import { DeleteUserUsecase } from '@/user/application/usecases/delete-user.usecase';

describe('Delete use case test', () => {
  let sut: DeleteUserUsecase.UseCase;
  let repository: UserInMemoryRepository;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    sut = new DeleteUserUsecase.UseCase(repository);
  });

  it('should throw exception if user does not exist', async () => {
    const input = { id: 'non-existent-id' };

    await expect(sut.execute(input)).rejects.toThrow(
      new UserWithIdNotFoundError(input.id),
    );
  });


  it('should call repository delete with correct ID', async () => {
    const user = new UserEntity(UserDataBuilder({}));
    await repository.insert(user);

    const spyDelete = jest.spyOn(repository, 'delete');

    const input = { id: user.id };

    expect(repository.items).toHaveLength(1)
    await sut.execute(input);

    expect(spyDelete).toHaveBeenCalledWith(user.id);

    expect(repository.items).toHaveLength(0)
  });
});
