import {
  SearchResult,
  SortOrderEnum,
} from '@/shared/domain/repositories/searchable-repository-contracts';
import { PaginationOutputMapper } from '@/shared/application/dtos/pagination-output';

describe('Pagination output unit tests', () => {
  it('should convert a search result in output', () => {
    const result = new SearchResult({
      items: [],
      total: 1,
      currentPage: 1,
      perPage: 1,
      sort: 'name',
      sortDir: SortOrderEnum.DESC,
      filter: 'filter',
    });

    const sut = PaginationOutputMapper.toOutput(result.items, result);

    expect(sut).toEqual({
      items: [],
      total: 1,
      currentPage: 1,
      lastPage: 1,
      perPage: 1,
    });
  });
});
