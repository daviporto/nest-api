import { BadRequestError } from '@/user/application/errors/bad-request-error';
import { UserRepository } from '@/user/domain/repositories/user.repository';
import { UserEntity } from '@/user/domain/entities/user.entity';
import { HashProvider } from '@/shared/application/providers/hash-provider';

export namespace SignupUsecase {
  export type Input = {
    id: string;
  };

  export type Output = {
    id: string;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
  };

  export class UseCase {
    constructor(private repository: UserRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const entity = await this.repository.findById(input.id);

      return entity.toJSON();
    }
  }
}
