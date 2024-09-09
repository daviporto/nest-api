import { UserRepository } from '@/user/domain/repositories/user.repository';
import { HashProvider } from '@/shared/application/providers/hash-provider';
import {
  UserOutput,
  UserOutputMapper,
} from '@/user/application/dtos/user-output';
import { UseCaseInterface } from '@/shared/application/use-cases/use-case';
import { AbstractUseCase } from '@/shared/application/use-cases/abstract-use-case';
import { InvalidCredentialsError } from '@/user/application/errors/invalid-credentials-error';

export namespace SignInUsecase {
  export type Input = {
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

      const entity = await this.repository.findByEmail(input.email);

      const passwordMatch = await this.hashProvider.compareHash(
        input.password,
        entity.password,
      );

      if (!passwordMatch) {
        throw new InvalidCredentialsError();
      }

      return UserOutputMapper.toOutput(entity);
    }

    protected assureRequiredInputProvided(input: Input) {
      const requiredFields = ['email', 'password'];

      super.assureRequiredInputProvided(input, requiredFields);
    }
  }
}
