import { UserEntity } from '@/user/domain/entities/user.entity';
import { UserRepository } from '@/user/domain/repositories/user.repository';
import { UserNotFoundError } from '@/user/domain/errors/user-not-found-error';
import { EmailAlreadyInUseError } from '@/user/domain/errors/email-already-in-use-error';
import { InMemorySearchableRepository } from '@/shared/domain/repositories/in-memory-searchable.repository';
import { SortOrderEnum } from '@/shared/domain/repositories/searchable-repository-contracts';

export class UserInMemoryRepository
  extends InMemorySearchableRepository<UserEntity>
  implements UserRepository.Repository
{
  sortableFields = ['name', 'createdAt'];
  async findByEmail(email: string): Promise<UserEntity> {
    const user = this.items.find((user) => user.email === email);
    if (!user) {
      throw new UserNotFoundError(email);
    }

    return user;
  }

  async emailExists(email: string): Promise<void> {
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
    if(!sort) {
      sort = 'createdAt';
    }

    if(!sortDir){
      sortDir = SortOrderEnum.DESC;
    }

    return super.applySort(items, sort, sortDir);
  }
}
