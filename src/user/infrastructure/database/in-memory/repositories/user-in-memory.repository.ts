import { UserEntity } from '@/user/domain/entities/user.entity';
import { UserRepository } from '@/user/domain/repositories/user.repository';
import { UserWithEmailNotFoundError } from '@/user/domain/errors/user-with-email-not-found-error';
import { EmailAlreadyInUseError } from '@/user/domain/errors/email-already-in-use-error';
import { InMemorySearchableRepository } from '@/shared/domain/repositories/in-memory-searchable.repository';
import { SortOrderEnum } from '@/shared/domain/repositories/searchable-repository-contracts';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { UserWithIdNotFoundError } from '@/user/infrastructure/errors/user-with-id-not-found-error';

export class UserInMemoryRepository
  extends InMemorySearchableRepository<UserEntity>
  implements UserRepository.Repository
{
  sortableFields = ['name', 'createdAt'];

  async findByEmail(email: string): Promise<UserEntity> {
    const user = this.items.find((user) => user.email === email);
    if (!user) {
      throw new UserWithEmailNotFoundError(email);
    }

    return user;
  }

  async assureEmailIsAvailableToUse(email: string): Promise<void> {
    const user = this.items.find((user) => user.email === email);
    if (user) {
      throw new EmailAlreadyInUseError(email);
    }
  }

  protected async applyFilters(
    items: UserEntity[],
    filter: string | null,
  ): Promise<UserEntity[]> {
    if (!filter) return items;

    return items.filter((item) =>
      item.props.name.toLowerCase().includes(filter.toLowerCase()),
    );
  }

  protected async applySort(
    items: UserEntity[],
    sort: string | null,
    sortDir: SortOrderEnum | null,
  ): Promise<UserEntity[]> {
    if (!sort) {
      sort = 'createdAt';
    }

    if (!sortDir) {
      sortDir = SortOrderEnum.DESC;
    }

    return super.applySort(items, sort, sortDir);
  }

  protected async _get(id: string): Promise<UserEntity> {
    const item = this.items.find((item) => item.id === id);

    if (!item) {
      throw new UserWithIdNotFoundError(id);
    }

    return item;
  }

  protected async _getIndex(id: string): Promise<number> {
    const index = this.items.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new UserWithIdNotFoundError(id);
    }

    return index;
  }
}
