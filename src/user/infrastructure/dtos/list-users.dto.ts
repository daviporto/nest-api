import { SignupUsecase } from '@/user/application/usecases/sign-up.usecase';
import { ListUsersUsecase } from '@/user/application/usecases/list-users.usecase';
import { SortOrderEnum } from '@/shared/domain/repositories/searchable-repository-contracts';
import { UserRepository } from '@/user/domain/repositories/user.repository';
import Filter = UserRepository.Filter;

export class ListUsersDto implements ListUsersUsecase.Input {
  page?: number;
  perPage?: number;
  sort?: string | null;
  sortDir?: SortOrderEnum | null;
  filter?: string | null;
}
