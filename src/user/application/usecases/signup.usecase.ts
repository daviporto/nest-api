import { BadRequestError } from '@/user/application/errors/bad-request-error';
import { UserRepository } from '@/user/domain/repositories/user.repository';
import { UserEntity } from '@/user/domain/entities/user.entity';
import { HashProvider } from '@/shared/application/providers/hash-provider';

export namespace SignupUsecase {
  export type Input = {
    name: string;
    email: string;
    password: string;
  };

  export type Output = {
    id: string;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
  };

  export class UseCase {
    constructor(
      private repository: UserRepository.Repository,
      private hashProvider: HashProvider,
    ) {}

    async execute(input: Input): Promise<Output> {
      this.assureRequiredInputProvided(input);

      await this.repository.assureEmailIsAvailableToUse(input.email);

      const entity = new UserEntity(
        Object.assign(input, {
          password: await this.hashProvider.generateHash(input.password),
        }),
      );

      await this.repository.insert(entity);

      return entity.toJSON();
    }

    private assureRequiredInputProvided(input: Input) {
      const requiredFields = ['name', 'email', 'password'];

      requiredFields.forEach((field) => {
        if (!input[field]) {
          throw new BadRequestError(`${field} is required`);
        }
      });
    }
  }
}
