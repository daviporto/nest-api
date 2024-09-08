import { Entity } from '@/shared/domain/entities/entity';
import { InMemoryRepository } from '@/shared/domain/repositories/in-memory.repository';
import { faker } from '@faker-js/faker';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';

type StubEntityProps = {
  price: number;
  name: string;
};

class StubEntity extends Entity<StubEntityProps> {}

class StubMemoryRepository extends InMemoryRepository<StubEntity> {}

let sut = new StubMemoryRepository();

describe('InMemoryRepository', () => {
  beforeEach(() => {
    sut = new StubMemoryRepository();
  });

  it('should insert an entity', async () => {
    const entity = new StubEntity({ price: 10, name: 'test' });

    await sut.insert(entity);

    expect(sut.items.length).toBe(1);
    expect(entity.toJSON()).toStrictEqual(sut.items[0].toJSON());
  });

  it('should find an entity by id with one entity', async () => {
    const entity = new StubEntity({ price: 10, name: 'test' });

    sut.items = [entity];

    const result = await sut.findById(entity.id);

    expect(result).toStrictEqual(entity);
  });

  it('should find entity by id with multiple', async () => {
    const entity = new StubEntity({ price: 10, name: 'test' });

    sut.items = [
      new StubEntity({ price: 5, name: 'test1' }),
      entity,
      new StubEntity({ price: 15, name: 'test2' }),
    ];

    const result = await sut.findById(entity.id);

    expect(result).toStrictEqual(entity);
  });

  it('should throw error with non existent entity', () => {
    expect(sut.findById('non existent')).rejects.toThrow(
      new NotFoundError('Item not found'),
    );
  });

  it('should find all entities', async () => {
    const entities = [
      new StubEntity({ price: 5, name: 'test1' }),
      new StubEntity({ price: 10, name: 'test2' }),
      new StubEntity({ price: 15, name: 'test3' }),
    ];

    sut.items = entities;

    const result = await sut.findAll();

    expect(result).toStrictEqual(entities);
  });

  it('should update an entity', async () => {
    const entity = new StubEntity({ price: 10, name: 'test' });

    sut.items = [entity];

    const other = new StubEntity({ price: 15, name: 'test 2' }, entity.id);

    await sut.update(other);

    expect(other.toJSON()).toStrictEqual(sut.items[0].toJSON());
  });

  it('should throw error when trying to update non existent entity', () => {
    const entity = new StubEntity({ price: 10, name: 'test' });

    expect(sut.update(entity)).rejects.toThrow(
      new NotFoundError('Item not found'),
    )
  });

  it('should delete an entity', async () => {
    const entity = new StubEntity({ price: 10, name: 'test' });

    sut.items = [entity];

    await sut.delete(entity.id);

    expect(sut.items.length).toBe(0);
  });
});
