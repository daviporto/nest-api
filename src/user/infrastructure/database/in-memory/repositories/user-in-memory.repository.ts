import { InMemoryRepository } from '@/shared/domain/repositories/in-memory.repository';
import { UserEntity } from '@/user/domain/entities/user.entity';
import { UserRepository } from '@/user/application/user.repository';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { UserNotFoundError } from '@/user/domain/errors/user-not-found-error';
import { EmailAlreadyInUseError } from '@/user/domain/errors/email-already-in-use-error';

export class UserInMemoryRepository
  extends InMemoryRepository<UserEntity>
  implements UserRepository
{
  async findByEmail(email: string): Promise<UserEntity> {
    const user = this.items.find((user) => user.email === email);
    if (!user) {
      throw new UserNotFoundError(email);
    }

    return user;
  }

  async emailExists(email: string): Promise<void> {
    const user = this.items.find((user) => user.email === email);
    if (user) {
      throw new EmailAlreadyInUseError(email);
    }
  }
}
