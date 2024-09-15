import { Entity } from '@/shared/domain/entities/entity';
import { RepositoryInterface } from '@/shared/domain/repositories/repository-contracts';

export enum SortOrderEnum {
  ASC = 'asc',
  DESC = 'desc',
}

export type SearchProps<Filter> = {
  page?: number;
  perPage?: number;
  sort?: string | null;
  sortDir?: SortOrderEnum | null;
  filter?: Filter | null;
};

export type SearchResultProps<E extends Entity, Filter> = {
  items: E[];
  total: number;
  currentPage: number;
  perPage: number;
  sort?: string | null;
  sortDir?: SortOrderEnum | null;
  filter?: Filter | null;
};

export class SearchResult<E extends Entity, Filter = string> {
  readonly items: E[];
  readonly total: number;
  readonly currentPage: number;
  readonly lastPage: number;
  readonly perPage: number;
  readonly sort: string | null;
  readonly sortDir: SortOrderEnum | null;
  readonly filter: Filter | null;

  constructor(props: SearchResultProps<E, Filter>) {
    this.items = props.items;
    this.total = props.total;
    this.currentPage = props.currentPage;
    this.lastPage = Math.ceil(props.total / props.perPage);
    this.perPage = props.perPage;
    this.sort = props.sort ?? null;
    this.sortDir = props.sortDir ?? null;
    this.filter = props.filter ?? null;
  }

  toJSON(forceEntities: boolean = false) {
    return {
      items: forceEntities
        ? this.items.map((item) => item.toJSON())
        : this.items,
      total: this.total,
      currentPage: this.currentPage,
      lastPage: this.lastPage,
      perPage: this.perPage,
      sort: this.sort,
      sortDir: this.sortDir,
      filter: this.filter,
    };
  }
}

const defaultInitialPage = 1;

const defaultPerPage = 10;

export class SearchParams<Filter = string> {
  protected _page: number;
  protected _perPage: number;
  protected _sort: string | null;
  protected _sortDir: SortOrderEnum | null;
  protected _filter: Filter | null;

  constructor(pros: SearchProps<Filter> = {}) {
    this.setPage(pros.page || defaultInitialPage);
    this.setPerPage(pros.perPage || defaultPerPage);
    this.setSort(pros.sort || null);
    this.setSortDir(pros.sortDir || null);
    this.setFilter(pros.filter || null);
  }

  get page(): number {
    return this._page;
  }

  private setPage(page: number): void {
    let _page = page;

    if (
      _page === (true as any) ||
      Number.isNaN(_page) ||
      _page < 1 ||
      parseInt(_page as any) !== _page
    ) {
      _page = defaultInitialPage;
    }

    if (typeof _page == 'string') {
      _page = parseInt(_page as any);
    }

    this._page = _page;
  }

  get perPage(): number {
    return this._perPage;
  }

  private setPerPage(perPage: number): void {
    let _perPage = perPage;

    if (
      Number.isNaN(_perPage) ||
      _perPage < 1 ||
      parseInt(_perPage as any) != _perPage
    ) {
      _perPage = defaultPerPage;
    }

    if (typeof perPage === 'string') {
      _perPage = parseInt(_perPage as any);
    }

    this._perPage = _perPage;
  }

  get sort(): string | null {
    return this._sort;
  }

  private setSort(sort: string | null): void {
    this._sort = sort || null;
  }

  get sortDir(): SortOrderEnum | null {
    return this._sortDir;
  }

  private setSortDir(sortDir: SortOrderEnum | null | string): void {
    if (!sortDir || this.sort === null) {
      this._sortDir = null;
    } else {
      if (typeof sortDir === 'string') {
        this._sortDir =
          sortDir === 'asc' ? SortOrderEnum.ASC : SortOrderEnum.DESC;
      } else {
        this._sortDir = sortDir;
      }
    }
  }

  get filter(): Filter | null {
    return this._filter;
  }

  private setFilter(filter: Filter | null): void {
    this._filter = filter === null || filter === undefined ? null : filter;
  }
}

export interface SearchableRepositoryInterface<
  E extends Entity,
  Filter = string,
  SearchInput = SearchParams<Filter>,
  SearchOutput = SearchResult<E, Filter>,
> extends RepositoryInterface<E> {
  sortableFields: string[];

  search(searchInput: SearchInput): Promise<SearchOutput>;
}
