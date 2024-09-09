import { UserRepository } from '@/user/domain/repositories/user.repository';
import { UserEntity } from '@/user/domain/entities/user.entity';
import { HashProvider } from '@/shared/application/providers/hash-provider';
import {
  UserOutput,
  UserOutputMapper,
} from '@/user/application/dtos/user-output';
import { UseCaseInterface } from '@/shared/application/use-cases/use-case';
import { AbstractUseCase } from '@/shared/application/use-cases/abstract-use-case';

export namespace SignupUsecase {
  export type Input = {
    name: string;
    email: string;
    password: string;
  };

  export type Output = UserOutput;

  export class UseCase
    extends AbstractUseCase<Input, Output>
    implements UseCaseInterface<Input, Output>
  {
    constructor(
      private repository: UserRepository.Repository,
      private hashProvider: HashProvider,
    ) {
      super();
    }

    async execute(input: Input): Promise<Output> {
      this.assureRequiredInputProvided(input);

      await this.repository.assureEmailIsAvailableToUse(input.email);

      const entity = new UserEntity(
        Object.assign(input, {
          password: await this.hashProvider.generateHash(input.password),
        }),
      );

      await this.repository.insert(entity);

      return UserOutputMapper.toOutput(entity);
    }

    protected assureRequiredInputProvided(input: Input) {
      const requiredFields = ['name', 'email', 'password'];

      super.assureRequiredInputProvided(input, requiredFields);
    }
  }
}
