import { Prisma } from '@prisma/client';
import { UserEntity } from '@/user/domain/entities/user.entity';
import { UserRepository } from '@/user/domain/repositories/user.repository';
import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service';
import { UserWithIdNotFoundError } from '@/user/infrastructure/errors/user-with-id-not-found-error';
import { UserModelMapper } from '@/user/infrastructure/database/prisma/models/user-model.mapper';
import { SortOrderEnum } from '@/shared/domain/repositories/searchable-repository-contracts';
import { UserWithEmailNotFoundError } from '@/user/domain/errors/user-with-email-not-found-error';
import { EmailAlreadyInUseError } from '@/user/domain/errors/email-already-in-use-error';

export class UserPrismaRepository implements UserRepository.Repository {
  sortableFields: string[] = ['name', 'createdAt'];

  constructor(private prismaService: PrismaService) {}

  async findByEmail(email: string): Promise<UserEntity> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { email },
      });

      return UserModelMapper.toEntity(user);
    } catch {
      throw new UserWithEmailNotFoundError(email);
    }
  }

  async assureEmailIsAvailableToUse(email: string): Promise<void> {
    if ((await this.prismaService.user.count({ where: { email } })) !== 0) {
      throw new EmailAlreadyInUseError(email);
    }
  }

  async search(
    searchInput: UserRepository.SearchParams,
  ): Promise<UserRepository.SearchResult> {
    const sortable = this.sortableFields.includes(searchInput.sort) || false;
    const field = sortable ? searchInput.sort : 'createdAt';

    const orderBy = sortable ? searchInput.sortDir : SortOrderEnum.DESC;

    const hasFilter = searchInput.filter ? searchInput.filter : null;

    const filter = hasFilter
      ? {
          where: {
            name: {
              contains: searchInput.filter,
              mode: Prisma.QueryMode.insensitive,
            },
          },
        }
      : undefined;

    const { count, models } = await this.executeQueries(
      filter,
      searchInput,
      field,
      orderBy,
    );

    return new UserRepository.SearchResult({
      items: models.map(UserModelMapper.toEntity),
      total: count,
      currentPage:
        searchInput.page && searchInput.page > 0 ? searchInput.page : 1,
      perPage:
        searchInput.perPage && searchInput.perPage > 0
          ? searchInput.perPage
          : 10,
      sort: searchInput.sort,
      sortDir: searchInput.sortDir,
      filter: searchInput.filter,
    });
  }

  private async executeQueries(
    filter: any,
    searchInput: UserRepository.SearchParams,
    field: string,
    orderBy: SortOrderEnum,
  ) {
    const [count, models] = await Promise.all([
      this.prismaService.user.count(filter),
      this.prismaService.user.findMany({
        skip:
          (searchInput.page && searchInput.page > 0
            ? searchInput.page - 1
            : 0) *
          (searchInput.perPage && searchInput.perPage > 0
            ? searchInput.perPage
            : 10),
        take:
          searchInput.perPage && searchInput.perPage > 0
            ? searchInput.perPage
            : 10,
        orderBy: {
          [field]: orderBy,
        },
        ...(filter ? filter : {}),
      }),
    ]);
    return { count, models };
  }

  async insert(entity: UserEntity): Promise<void> {
    await this.prismaService.user.create({
      data: entity.toJSON(),
    });
  }

  findById(id: string): Promise<UserEntity> {
    return this._get(id);
  }

  async findAll(): Promise<UserEntity[]> {
    const models = await this.prismaService.user.findMany();

    return models.map(UserModelMapper.toEntity);
  }

  async update(entity: UserEntity): Promise<void> {
    await this._assureUserExists(entity.id);

    await this.prismaService.user.update({
      where: { id: entity.id },
      data: entity.toJSON(),
    });
  }

  async delete(id: string): Promise<void> {
    await this._assureUserExists(id);

    await this.prismaService.user.delete({
      where: { id },
    });
  }

  protected async _get(id: string): Promise<UserEntity> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id },
      });

      return UserModelMapper.toEntity(user);
    } catch {
      throw new UserWithIdNotFoundError(id);
    }
  }

  private async _assureUserExists(id: string) {
    if ((await this.prismaService.user.count({ where: { id } })) === 0) {
      throw new UserWithIdNotFoundError(id);
    }
  }
}
