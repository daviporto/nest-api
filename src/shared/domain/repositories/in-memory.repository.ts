import { RepositoryInterface } from '@/shared/domain/repositories/repository-contracts';
import { Entity } from '@/shared/domain/entities/entity';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';

export abstract class InMemoryRepository<E extends Entity>
  implements RepositoryInterface<E>
{
  items: E[] = [];

  insert(entity: E): Promise<void> {
    this.items.push(entity);

    return Promise.resolve();
  }

  findById(id: string): Promise<E> {
    return this._get(id);
  }

  findAll(): Promise<E[]> {
    return Promise.resolve(this.items);
  }

  async update(entity: E): Promise<void> {
    const index = await this._getIndex(entity.id);

    this.items[index] = entity;
  }

  async delete(id: string): Promise<void> {
    const index = await this._getIndex(id);

    this.items.splice(index, 1);
  }

  protected async _get(id: string): Promise<E> {
    const item = this.items.find((item) => item.id === id);

    if (!item) {
      throw new NotFoundError('Item not found');
    }

    return item;
  }

  protected async _getIndex(id: string): Promise<number> {
    const index = this.items.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new NotFoundError('Item not found');
    }

    return index;
  }
}
