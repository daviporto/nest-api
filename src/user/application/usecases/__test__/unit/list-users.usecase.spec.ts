import {
  SearchResult,
  SortOrderEnum,
} from '@/shared/domain/repositories/searchable-repository-contracts';
import { PaginationOutputMapper } from '@/shared/application/dtos/pagination-output';
import { ListUsersUsecase } from '@/user/application/usecases/list-users.usecase';
import { UserInMemoryRepository } from '@/user/infrastructure/database/in-memory/repositories/user-in-memory.repository';
import { UserRepository } from '@/user/domain/repositories/user.repository';
import { UserEntity, UserProps } from '@/user/domain/entities/user.entity';
import { UserDataBuilder } from '@/user/domain/testing/helper/user-data-builder';

describe('List users use cases unit tests', () => {
  function createUserEntity(userProps: Partial<UserProps> = {}) {
    return new UserEntity(UserDataBuilder(userProps));
  }

  let sut: ListUsersUsecase.UseCase;
  let repository: UserInMemoryRepository;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    sut = new ListUsersUsecase.UseCase(repository);
  });

  describe('test to output', () => {
    it('should return empty result in output', () => {
      const result = new UserRepository.SearchResult({
        items: [],
        total: 1,
        currentPage: 1,
        perPage: 1,
        sort: null,
        sortDir: null,
        filter: null,
      });

      const output = sut['toOutput'](result);

      expect(output).toStrictEqual({
        items: [],
        total: 1,
        currentPage: 1,
        lastPage: 1,
        perPage: 1,
      });
    });

    it('should return user entity result in output', () => {
      const entity = new UserEntity(UserDataBuilder({}));
      const result = new UserRepository.SearchResult({
        items: [entity],
        total: 1,
        currentPage: 1,
        perPage: 1,
        sort: null,
        sortDir: null,
        filter: null,
      });

      const output = sut['toOutput'](result);

      expect(output).toStrictEqual({
        items: [entity.toJSON()],
        total: 1,
        currentPage: 1,
        lastPage: 1,
        perPage: 1,
      });
    });
  });

  it('should return sorted by created at by default', async () => {
    const initialDate = new Date();
    const users = [
      createUserEntity({ createdAt: initialDate }),
      createUserEntity({ createdAt: new Date(initialDate.getTime() + 1) }),
      createUserEntity({ createdAt: new Date(initialDate.getTime() + 2) }),
    ];
    repository.items = users;

    const result = await sut.execute({});

    expect(result.total).toBe(users.length);
    expect(result.currentPage).toBe(1);
    expect(result.lastPage).toBe(1);
    expect(result.perPage).toBe(10);

    expect(result.items[0].createdAt.getTime()).toStrictEqual(
      initialDate.getTime() + 2,
    );

    expect(result.items[1].createdAt.getTime()).toStrictEqual(
      initialDate.getTime() + 1,
    );
    expect(result.items[2].createdAt.getTime()).toStrictEqual(
      initialDate.getTime(),
    );
  });

  it('should return users filtered, paginated and sorted', async () => {
    const users = [
      createUserEntity({ name: 'a' }),
      createUserEntity({ name: 'A' }),
      createUserEntity({ name: 'b' }),
      createUserEntity({ name: 'c' }),
    ];
    repository.items = users;

    const result = await sut.execute({
      page: 1,
      perPage: 2,
      sort: 'name',
      sortDir: SortOrderEnum.ASC,
      filter: 'a',
    });

    expect(result.total).toBe(2);
    expect(result.currentPage).toBe(1);
    expect(result.lastPage).toBe(1);
    expect(result.perPage).toBe(2);

    expect(result.items[0].name).toBe('A');
    expect(result.items[1].name).toBe('a');
  });

  it('should return second page when empty in pagination', async () => {
    const users = [
      createUserEntity({ name: 'a' }),
      createUserEntity({ name: 'A' }),
      createUserEntity({ name: 'b' }),
      createUserEntity({ name: 'c' }),
    ];
    repository.items = users;

    const result = await sut.execute({
      page: 2,
      perPage: 2,
      sort: 'name',
      sortDir: SortOrderEnum.ASC,
      filter: 'a',
    });

    expect(result.items.length).toBe(0);
    expect(result.total).toBe(2);
    expect(result.currentPage).toBe(2);
    expect(result.lastPage).toBe(1);
    expect(result.perPage).toBe(2);
  });

  it('should return items in second page when having them', async () => {
    const users = [
      createUserEntity({ name: 'a' }),
      createUserEntity({ name: 'A' }),
      createUserEntity({ name: 'Aa' }),
      createUserEntity({ name: 'c' }),
    ];
    repository.items = users;

    const result = await sut.execute({
      page: 2,
      perPage: 2,
      sort: 'name',
      sortDir: SortOrderEnum.ASC,
      filter: 'a',
    });

    expect(result.items.length).toBe(1);
    expect(result.total).toBe(3);
    expect(result.currentPage).toBe(2);
    expect(result.lastPage).toBe(2);
    expect(result.perPage).toBe(2);

    expect(result.items[0].name).toBe('a');
  });

  it('should return empty result when no filter found', async () => {
    const users = [
      createUserEntity({ name: 'a' }),
      createUserEntity({ name: 'A' }),
      createUserEntity({ name: 'b' }),
      createUserEntity({ name: 'c' }),
    ];
    repository.items = users;

    const result = await sut.execute({
      page: 1,
      perPage: 2,
      sort: 'name',
      sortDir: SortOrderEnum.ASC,
      filter: 'd',
    });

    expect(result.items.length).toBe(0);
    expect(result.total).toBe(0);
    expect(result.currentPage).toBe(1);
    expect(result.lastPage).toBe(0);
    expect(result.perPage).toBe(2);
  });
  
  
});
