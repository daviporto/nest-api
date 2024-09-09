import { UserInMemoryRepository } from '@/user/infrastructure/database/in-memory/repositories/user-in-memory.repository';
import { UserWithEmailNotFoundError } from '@/user/domain/errors/user-with-email-not-found-error';
import { faker } from '@faker-js/faker';
import { UserDataBuilder } from '@/user/domain/testing/helper/user-data-builder';
import { UserEntity, UserProps } from '@/user/domain/entities/user.entity';
import { EmailAlreadyInUseError } from '@/user/domain/errors/email-already-in-use-error';
import { SortOrderEnum } from '@/shared/domain/repositories/searchable-repository-contracts';

function createUserEntity(userProps: Partial<UserProps> = {}) {
  return new UserEntity(UserDataBuilder(userProps));
}

describe('user in memory repository', () => {
  let sut: UserInMemoryRepository;

  beforeEach(() => {
    sut = new UserInMemoryRepository();
  });

  it('should throw exception when using findByEmail without user', () => {
    expect(sut.findByEmail('non existent')).rejects.toThrow(UserWithEmailNotFoundError);
  });

  it('should throw exception when there users but none with the desired email', async () => {
    const user = createUserEntity();
    await sut.insert(user);

    expect(sut.findByEmail('non existent')).rejects.toThrow(UserWithEmailNotFoundError);
  });

  it('should return user when using findByEmail with user', async () => {
    const user = createUserEntity();
    await sut.insert(user);

    const result = await sut.findByEmail(user.email);

    expect(result).toStrictEqual(user);
  });

  it('should throw exception when using emailExists with user', async () => {
    const user = createUserEntity();
    await sut.insert(user);

    expect(sut.assureEmailIsAvailableToUse(user.email)).rejects.toThrow(EmailAlreadyInUseError);
  });

  it('should not throw exception when using emailExists without user', async () => {
    await sut.assureEmailIsAvailableToUse(faker.internet.email());
  });

  it('should not throw exception when using emailExists with different user', async () => {
    const user = createUserEntity();
    await sut.insert(user);

    await sut.assureEmailIsAvailableToUse(faker.internet.email());
  });

  describe('apply filters method', () => {
    it('should return item with null filter', async () => {
      const items = Array.from({ length: 3 }, () => createUserEntity());

      const spyFilter = jest.spyOn(items, 'filter');

      const result = await sut['applyFilters'](items, null);

      expect(result).toStrictEqual(items);
      expect(spyFilter).not.toHaveBeenCalled();
    });

    it('should return items filtered by name', async () => {
      const items = Array.from({ length: 3 }, () => createUserEntity());

      const spyFilter = jest.spyOn(items, 'filter');

      const result = await sut['applyFilters'](items, items[0].props.name);

      expect(result.length).toBe(1);
      expect(result[0].props.name).toBe(items[0].props.name);
      expect(spyFilter).toHaveBeenCalledTimes(1);
    });

    it('should return items filtered by name case insensitive', async () => {
      const items = Array.from({ length: 3 }, () => createUserEntity());

      const spyFilter = jest.spyOn(items, 'filter');

      const result = await sut['applyFilters'](
        items,
        items[0].props.name.toUpperCase(),
      );

      expect(result.length).toBe(1);
      expect(result[0].props.name).toBe(items[0].props.name);
      expect(spyFilter).toHaveBeenCalledTimes(1);
    });
  });

  describe('apply sort method', () => {
    it('should return items sorted by name in ascending order', async () => {
      const items = [
        createUserEntity({ name: 'John' }),
        createUserEntity({ name: 'Alice' }),
        createUserEntity({ name: 'Bob' }),
      ];

      const result = await sut['applySort'](items, 'name', SortOrderEnum.ASC);

      expect(result[0].props.name).toBe('Alice');
      expect(result[1].props.name).toBe('Bob');
      expect(result[2].props.name).toBe('John');
    });

    it('should return items sorted by name in descending order', async () => {
      const items = [
        createUserEntity({ name: 'John' }),
        createUserEntity({ name: 'Alice' }),
        createUserEntity({ name: 'Bob' }),
      ];

      const result = await sut['applySort'](items, 'name', SortOrderEnum.DESC);

      expect(result[0].props.name).toBe('John');
      expect(result[1].props.name).toBe('Bob');
      expect(result[2].props.name).toBe('Alice');
    });

    it('should return items sorted by createdAt in ascending order', async () => {
      const items = [
        createUserEntity({ createdAt: new Date('2023-01-03') }),
        createUserEntity({ createdAt: new Date('2023-01-01') }),
        createUserEntity({ createdAt: new Date('2023-01-02') }),
      ];

      const result = await sut['applySort'](items, 'createdAt', SortOrderEnum.ASC);

      expect(result[0].props.createdAt).toStrictEqual(new Date('2023-01-01'));
      expect(result[1].props.createdAt).toStrictEqual(new Date('2023-01-02'));
      expect(result[2].props.createdAt).toStrictEqual(new Date('2023-01-03'));
    });

    it('should return items sorted by createdAt in descending order by default', async () => {
      const items = [
        createUserEntity({ createdAt: new Date('2023-01-03') }),
        createUserEntity({ createdAt: new Date('2023-01-01') }),
        createUserEntity({ createdAt: new Date('2023-01-02') }),
      ];

      const result = await sut['applySort'](items, null, null);

      expect(result[0].props.createdAt).toStrictEqual(new Date('2023-01-03'));
      expect(result[1].props.createdAt).toStrictEqual(new Date('2023-01-02'));
      expect(result[2].props.createdAt).toStrictEqual(new Date('2023-01-01'));
    });
  });
});
