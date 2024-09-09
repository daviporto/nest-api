import { UserInMemoryRepository } from '@/user/infrastructure/database/in-memory/repositories/user-in-memory.repository';
import { UserEntity } from '@/user/domain/entities/user.entity';
import { UserDataBuilder } from '@/user/domain/testing/helper/user-data-builder';
import { UserWithIdNotFoundError } from '@/user/infrastructure/errors/user-with-id-not-found-error';
import { BadRequestError } from '@/shared/application/errors/bad-request-error';
import { UpdateUserUsecase } from '@/user/application/usecases/update-user.usecase';
import { faker } from '@faker-js/faker';

describe('Update user use case test', () => {
  let sut: UpdateUserUsecase.UseCase;
  let repository: UserInMemoryRepository;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    sut = new UpdateUserUsecase.UseCase(repository);
  });

  it('should throw UserWithIdNotFoundError if user does not exist', async () => {
    const input = { id: 'non-existent-id', name: faker.person.fullName() };

    await expect(sut.execute(input)).rejects.toThrow(
      new UserWithIdNotFoundError(input.id),
    );
  });

});
