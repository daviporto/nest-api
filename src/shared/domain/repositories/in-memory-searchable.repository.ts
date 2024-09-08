import { RepositoryInterface } from '@/shared/domain/repositories/repository-contracts';
import { Entity } from '@/shared/domain/entities/entity';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { SearchableRepositoryInterface } from '@/shared/domain/repositories/searchable-repository-contracts';
import { InMemoryRepository } from '@/shared/domain/repositories/in-memory.repository';

export abstract class InMemorySearchableRepository<E extends Entity>
  extends InMemoryRepository<E>
  implements SearchableRepositoryInterface<E, any, any>
{
  async search(searchInput: any): Promise<any> {
    throw new Error('Method not implemented.');
  }

}
