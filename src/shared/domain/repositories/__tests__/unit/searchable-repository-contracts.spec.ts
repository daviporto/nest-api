import {
  SearchParams,
  SearchResult,
  SortOrderEnum,
} from '@/shared/domain/repositories/searchable-repository-contracts';
import { Entity } from '@/shared/domain/entities/entity';

describe('SearchParams', () => {
  it('should set page to 1 if the page is invalid', () => {
    const params = [
      { page: {}, expected: 1 },
      { page: true, expected: 1 },
      { page: false, expected: 1 },
      { page: 1, expected: 1 },
      { page: 1.5, expected: 1 },
      { page: NaN, expected: 1 },
      { page: Infinity, expected: 1 },
      { page: [], expected: 1 },
    ];

    params.forEach((param) => {
      const searchParams = new SearchParams({ page: param.page as any });
      expect(searchParams.page).toBe(param.expected);
    });
  });

  it('should set perPage to 10 if the perPage is invalid', () => {
    const params = [
      { perPage: {}, expected: 10 },
      { perPage: true, expected: 10 },
      { perPage: false, expected: 10 },
      { perPage: -1, expected: 10 },
      { perPage: 1.5, expected: 10 },
      { perPage: NaN, expected: 10 },
      { perPage: Infinity, expected: 10 },
      { perPage: [], expected: 10 },
    ];

    params.forEach((param) => {
      const searchParams = new SearchParams({ perPage: param.perPage as any });
      expect(searchParams.perPage).toBe(param.expected);
    });
  });
  it('should allow valid page and perPage values', () => {
    const searchParams = new SearchParams({ page: 3, perPage: 5 });
    expect(searchParams.page).toBe(3);
    expect(searchParams.perPage).toBe(5);
  });

  it('should set sort and sortDir to null if no sort is provided', () => {
    const searchParams = new SearchParams({});
    expect(searchParams.sort).toBeNull();
    expect(searchParams.sortDir).toBeNull();
  });

  it('should allow valid sort and sortDir values', () => {
    const searchParams = new SearchParams({
      sort: 'price',
      sortDir: SortOrderEnum.ASC,
    });
    expect(searchParams.sort).toBe('price');
    expect(searchParams.sortDir).toBe(SortOrderEnum.ASC);

    const searchParamsDesc = new SearchParams({
      sort: 'price',
      sortDir: SortOrderEnum.DESC,
    });
    expect(searchParamsDesc.sortDir).toBe(SortOrderEnum.DESC);
  });

  it('should ignore sortDir if sort is not provided', () => {
    const searchParams = new SearchParams({ sortDir: SortOrderEnum.ASC });
    expect(searchParams.sortDir).toBeNull();
  });

  it('should set filter to null if no filter is provided', () => {
    const searchParams = new SearchParams({});
    expect(searchParams.filter).toBeNull();
  });

  it('should allow setting a filter value', () => {
    const searchParams = new SearchParams({ filter: 'test' });
    expect(searchParams.filter).toBe('test');
  });

  it('should correctly handle all parameters', () => {
    const searchParams = new SearchParams({
      page: 2,
      perPage: 20,
      sort: 'name',
      sortDir: SortOrderEnum.DESC,
      filter: 'some filter',
    });

    expect(searchParams.page).toBe(2);
    expect(searchParams.perPage).toBe(20);
    expect(searchParams.sort).toBe('name');
    expect(searchParams.sortDir).toBe(SortOrderEnum.DESC);
    expect(searchParams.filter).toBe('some filter');
  });
});

describe('SearchResults', () => {
  class StubEntity extends Entity<{ name: string }> {
    constructor(name: string) {
      super({ name });
    }

    toJSON(): Required<{ id: string; name: string }> {
      return {
        ...super.toJSON(),
        name: this.props.name,
      };
    }
  }

  const makeFakeEntities = (count: number): StubEntity[] => {
    return Array.from(
      { length: count },
      (_, index) => new StubEntity(`Entity ${index + 1}`),
    );
  };

  it('should construct properly with required fields', () => {
    const items = makeFakeEntities(10);
    const result = new SearchResult({
      items,
      total: 10,
      currentPage: 1,
      perPage: 5,
    });

    expect(result.items).toBe(items);
    expect(result.total).toBe(10);
    expect(result.currentPage).toBe(1);
    expect(result.perPage).toBe(5);
    expect(result.lastPage).toBe(2);
    expect(result.sort).toBeNull();
    expect(result.sortDir).toBeNull();
    expect(result.filter).toBeNull();
  });

  it('should calculate lastPage correctly when total is not perfectly divisible by perPage', () => {
    const result = new SearchResult({
      items: makeFakeEntities(1),
      total: 45,
      currentPage: 1,
      perPage: 10,
    });

    expect(result.lastPage).toBe(5); // 45 total / 10 perPage = 4.5 => round up to 5
  });

  it('should handle optional sort and filter parameters', () => {
    const result = new SearchResult({
      items: makeFakeEntities(10),
      total: 10,
      currentPage: 2,
      perPage: 5,
      sort: 'name',
      sortDir: SortOrderEnum.ASC,
      filter: 'test filter',
    });

    expect(result.sort).toBe('name');
    expect(result.sortDir).toBe(SortOrderEnum.ASC);
    expect(result.filter).toBe('test filter');
  });

  it('should default sort, sortDir, and filter to null', () => {
    const result = new SearchResult({
      items: makeFakeEntities(5),
      total: 25,
      currentPage: 1,
      perPage: 5,
    });

    expect(result.sort).toBeNull();
    expect(result.sortDir).toBeNull();
    expect(result.filter).toBeNull();
  });

  it('should return items as entities in toJSON when forceEntities is false', () => {
    const items = makeFakeEntities(2);
    const result = new SearchResult({
      items,
      total: 2,
      currentPage: 1,
      perPage: 10,
    });

    const json = result.toJSON(false);
    expect(json.items).toBe(items);
  });

  it('should return items as JSON objects in toJSON when forceEntities is true', () => {
    const items = makeFakeEntities(2);
    const result = new SearchResult({
      items,
      total: 2,
      currentPage: 1,
      perPage: 10,
    });

    const json = result.toJSON(true);
    expect(json.items).toStrictEqual(items.map((item) => item.toJSON()));
  });

  it('should return correct structure in toJSON', () => {
    const result = new SearchResult({
      items: makeFakeEntities(3),
      total: 30,
      currentPage: 1,
      perPage: 10,
      sort: 'name',
      sortDir: SortOrderEnum.DESC,
      filter: 'sample filter',
    });

    const json = result.toJSON();
    expect(json).toEqual({
      items: result.items,
      total: 30,
      currentPage: 1,
      lastPage: 3,
      perPage: 10,
      sort: 'name',
      sortDir: SortOrderEnum.DESC,
      filter: 'sample filter',
    });
  });
});
