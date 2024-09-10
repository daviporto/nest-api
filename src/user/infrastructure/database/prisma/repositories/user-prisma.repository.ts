import { UserEntity } from '@/user/domain/entities/user.entity';
import { UserRepository } from '@/user/domain/repositories/user.repository';
import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service';
import { UserWithIdNotFoundError } from '@/user/infrastructure/errors/user-with-id-not-found-error';
import { UserModelMapper } from '@/user/infrastructure/database/prisma/models/user-model.mapper';

export class UserPrismaRepository implements UserRepository.Repository {
  sortableFields: string[];

  constructor(private prismaService: PrismaService) {}

  findByEmail(email: string): Promise<UserEntity> {
    throw new Error('Method not implemented.');
  }

  assureEmailIsAvailableToUse(email: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  search(
    searchInput: UserRepository.SearchParams,
  ): Promise<UserRepository.SearchResult> {
    throw new Error('Method not implemented.');
  }

  insert(entity: UserEntity): Promise<void> {
    throw new Error('Method not implemented.');
  }

  findById(id: string): Promise<UserEntity> {
    return this._get(id);
  }

  findAll(): Promise<UserEntity[]> {
    throw new Error('Method not implemented.');
  }

  update(entity: UserEntity): Promise<void> {
    throw new Error('Method not implemented.');
  }

  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
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
}
