import { RepositoryInterface } from '@/shared/domain/repositories/repository-contracts';
import { Entity } from '@/shared/domain/entities/entity';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import {
  SearchableRepositoryInterface,
  SearchParams,
  SearchResult,
  SortOrderEnum,
} from '@/shared/domain/repositories/searchable-repository-contracts';
import { InMemoryRepository } from '@/shared/domain/repositories/in-memory.repository';

export abstract class InMemorySearchableRepository<E extends Entity>
  extends InMemoryRepository<E>
  implements SearchableRepositoryInterface<E, any, any>
{
  sortableFields: string[];

  async search(params: SearchParams): Promise<SearchResult<E>> {
    const itemFiltered = await this.applyFilters(this.items, params.filter);

    const itemSorted = await this.applySort(
      itemFiltered,
      params.sort,
      params.sortDir,
    );

    const itemsPaginated = await this.applyPagination(
      itemSorted,
      params.page,
      params.perPage,
    );

    return new SearchResult({
      items: itemsPaginated,
      total: itemFiltered.length,
      currentPage: params.page,
      perPage: params.perPage,
      sort: params.sort,
      sortDir: params.sortDir,
      filter: params.filter,
    });
  }

  protected abstract applyFilters(
    items: E[],
    filter: string | null,
  ): Promise<E[]>;

  protected async applySort(
    items: E[],
    sort: string | null,
    sortDir: SortOrderEnum | null,
  ): Promise<E[]> {
    if (!sort || !this.sortableFields.includes(sort)) {
      return items;
    }

    return [...items].sort((a, b) => {
      if (a.props[sort] > b.props[sort]) {
        return sortDir === SortOrderEnum.ASC ? 1 : -1;
      }

      if (a.props[sort] < b.props[sort]) {
        return sortDir === SortOrderEnum.ASC ? -1 : 1;
      }

      return 0;
    });
  }

  protected async applyPagination(
    items: E[],
    page: SearchParams['page'],
    perPage: SearchParams['perPage'],
  ): Promise<E[]> {
    const start = (page - 1) * perPage;
    const end = start + perPage;

    return items.slice(start, end);
  }
}
