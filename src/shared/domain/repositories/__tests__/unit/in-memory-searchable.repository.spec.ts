import { InMemorySearchableRepository } from '@/shared/domain/repositories/in-memory-searchable.repository';
import { Entity } from '@/shared/domain/entities/entity';
import {
  SearchParams,
  SortOrderEnum,
} from '@/shared/domain/repositories/searchable-repository-contracts';

type StubEntityProps = {
  price: number;
  name: string;
};

class StubEntity extends Entity<StubEntityProps> {}

class StubMemoryRepository extends InMemorySearchableRepository<StubEntity> {
  protected async applyFilters(
    items: StubEntity[],
    filter: string | null,
  ): Promise<StubEntity[]> {
    if (!filter) return items;

    return items.filter((item) =>
      item.props.name.toLowerCase().includes(filter.toLowerCase()),
    );
  }
}

let sut = new StubMemoryRepository();

const makeFakeEntities = (count: number): StubEntity[] => {
  return Array.from(
    { length: count },
    (_, index) => new StubEntity({ price: index, name: `name${index}` }),
  );
};

describe('InMemorySearchableRepository', () => {
  beforeEach(() => {
    sut = new StubMemoryRepository();
    sut.sortableFields = ['name', 'price'];
  });

  describe('apply filters method', () => {
    it('should return item with null filter', async () => {
      const items = makeFakeEntities(3);

      const spyFilter = jest.spyOn(items, 'filter');

      const result = await sut['applyFilters'](items, null);

      expect(result).toStrictEqual(items);
      expect(spyFilter).not.toHaveBeenCalled();
    });

    it('should return items filtered by name', async () => {
      const items = makeFakeEntities(3);

      const spyFilter = jest.spyOn(items, 'filter');

      const result = await sut['applyFilters'](items, 'name1');

      expect(result.length).toBe(1);
      expect(result[0].props.name).toBe('name1');
      expect(spyFilter).toHaveBeenCalledTimes(1);
    });

    it('should return items filtered by name case insensitive', async () => {
      const items = makeFakeEntities(3);

      const spyFilter = jest.spyOn(items, 'filter');

      const result = await sut['applyFilters'](items, 'NAME1');

      expect(result.length).toBe(1);
      expect(result[0].props.name).toBe('name1');
      expect(spyFilter).toHaveBeenCalledTimes(1);
    });
  });

  describe('apply sort method', () => {
    beforeEach(() => {
      sut = new StubMemoryRepository();
      sut.sortableFields = ['name'];
    });

    it('should return items without sorting when sort field is null', async () => {
      const items = makeFakeEntities(3);

      const result = await sut['applySort'](items, null, null);

      expect(result).toStrictEqual(items);
    });

    it('should return items without sorting when sort field is not in sortableFields', async () => {
      const items = makeFakeEntities(3);

      const result = await sut['applySort'](items, 'price', SortOrderEnum.ASC);

      expect(result).toStrictEqual(items);
    });

    it('should return items sorted by name in ascending order', async () => {
      const items = [
        new StubEntity({ price: 10, name: 'C' }),
        new StubEntity({ price: 5, name: 'A' }),
        new StubEntity({ price: 15, name: 'B' }),
      ];

      const result = await sut['applySort'](items, 'name', SortOrderEnum.ASC);

      expect(result[0].props.name).toBe('A');
      expect(result[1].props.name).toBe('B');
      expect(result[2].props.name).toBe('C');
    });

    it('should return items sorted by name in descending order', async () => {
      const items = [
        new StubEntity({ price: 10, name: 'C' }),
        new StubEntity({ price: 5, name: 'A' }),
        new StubEntity({ price: 15, name: 'B' }),
      ];

      const result = await sut['applySort'](items, 'name', SortOrderEnum.DESC);

      expect(result[0].props.name).toBe('C');
      expect(result[1].props.name).toBe('B');
      expect(result[2].props.name).toBe('A');
    });
  });

  describe('applyPagination method', () => {
    it('should return paginated items based on the given page and perPage', async () => {
      const items = makeFakeEntities(10); // 10 items

      const result = await sut['applyPagination'](items, 1, 5);

      expect(result.length).toBe(5); // Only 5 items per page
      expect(result[0].props.name).toBe('name0');
      expect(result[4].props.name).toBe('name4'); // Last item on the first page
    });

    it('should return the correct items on the second page', async () => {
      const items = makeFakeEntities(10); // 10 items

      const result = await sut['applyPagination'](items, 2, 5);

      expect(result.length).toBe(5); // Only 5 items per page
      expect(result[0].props.name).toBe('name5'); // First item on the second page
      expect(result[4].props.name).toBe('name9'); // Last item on the second page
    });

    it('should return the remaining items if the page exceeds total items', async () => {
      const items = makeFakeEntities(7); // 7 items

      const result = await sut['applyPagination'](items, 2, 5);

      expect(result.length).toBe(2); // Only 2 remaining items on the second page
      expect(result[0].props.name).toBe('name5');
      expect(result[1].props.name).toBe('name6');
    });

    it('should return an empty array if the page is beyond the available items', async () => {
      const items = makeFakeEntities(5); // 5 items

      const result = await sut['applyPagination'](items, 3, 5); // 3rd page should have no items

      expect(result.length).toBe(0); // No items on the 3rd page
    });
  });

  describe('search method', () => {
    it('should return items with default params', async () => {
      const items = makeFakeEntities(11);

      sut.items = items;
      const result = await sut.search(new SearchParams());

      expect(result.items.length).toBe(10);
      expect(result.items).toStrictEqual(items.slice(0, 10));

      expect(result.total).toBe(11);
      expect(result.currentPage).toBe(1);
      expect(result.perPage).toBe(10);
      expect(result.sort).toBeNull();
      expect(result.sortDir).toBeNull();
      expect(result.filter).toBeNull();
    });

    it('should apply filters, sorting, and pagination correctly', async () => {
      sut.items = makeFakeEntities(10);

      const searchParams = new SearchParams({
        filter: 'name1',
        sort: 'name',
        sortDir: SortOrderEnum.ASC,
        page: 1,
        perPage: 2,
      });

      const result = await sut.search(searchParams);

      expect(result.items.length).toBe(1);
      expect(result.items[0].props.name).toBe('name1');
      expect(result.total).toBe(1);
      expect(result.currentPage).toBe(1);
      expect(result.perPage).toBe(2);
    });

    it('should return sorted items by name in ascending order', async () => {
      const items = [
        new StubEntity({ price: 10, name: 'C' }),
        new StubEntity({ price: 5, name: 'A' }),
        new StubEntity({ price: 15, name: 'B' }),
      ];
      sut.items = items;

      const searchParams = new SearchParams({
        sort: 'name',
        sortDir: SortOrderEnum.ASC,
        page: 1,
        perPage: 3,
      });

      const result = await sut.search(searchParams);

      expect(result.items[0].props.name).toBe('A');
      expect(result.items[1].props.name).toBe('B');
      expect(result.items[2].props.name).toBe('C');
    });

    it('should paginate results correctly', async () => {
      const items = makeFakeEntities(10);
      sut.items = items;

      const searchParams = new SearchParams({
        page: 2,
        perPage: 3,
      });

      const result = await sut.search(searchParams);

      expect(result.items.length).toBe(3);
      expect(result.items[0].props.name).toBe('name3');
      expect(result.items[2].props.name).toBe('name5');
      expect(result.currentPage).toBe(2);
      expect(result.perPage).toBe(3);
    });

    it('should return an empty result if the page exceeds the total items', async () => {
      const items = makeFakeEntities(5);
      sut.items = items;

      const searchParams = new SearchParams({
        page: 3,
        perPage: 5,
      });

      const result = await sut.search(searchParams);

      expect(result.items.length).toBe(0);
      expect(result.currentPage).toBe(3);
      expect(result.total).toBe(5);
    });
  });
});
