import { SignupUsecase } from '@/user/application/usecases/sign-up.usecase';
import { ListUsersUsecase } from '@/user/application/usecases/list-users.usecase';
import { SortOrderEnum } from '@/shared/domain/repositories/searchable-repository-contracts';
import { UserRepository } from '@/user/domain/repositories/user.repository';
import Filter = UserRepository.Filter;
import { IsIn, IsOptional } from 'class-validator';

export class ListUsersDto implements ListUsersUsecase.Input {
  @IsOptional()
  page?: number;

  @IsOptional()
  perPage?: number;

  @IsOptional()
  sort?: string | null;

  @IsOptional()
  // @IsIn([SortOrderEnum.ASC, SortOrderEnum.DESC])
  sortDir?: SortOrderEnum | null;

  @IsOptional()
  filter?: string | null;
}
