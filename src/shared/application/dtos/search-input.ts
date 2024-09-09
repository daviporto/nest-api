import { SortOrderEnum } from '@/shared/domain/repositories/searchable-repository-contracts';

export type SearchInput<Filter = string> = {
  page?: number;
  perPage?: number;
  sort?: string | null;
  sortDir?: SortOrderEnum | null;
  filter?: Filter | null;
};
