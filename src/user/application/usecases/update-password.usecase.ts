import { UserRepository } from '@/user/domain/repositories/user.repository';
import {
  UserOutput,
  UserOutputMapper,
} from '@/user/application/dtos/user-output';
import { UseCaseInterface } from '@/shared/application/use-cases/use-case';
import { AbstractUseCase } from '@/shared/application/use-cases/abstract-use-case';
import { HashProvider } from '@/shared/application/providers/hash-provider';
import { InvalidPasswordError } from '@/user/application/errors/invalid-password-error';
import { UserEntity } from '@/user/domain/entities/user.entity';

export namespace UpdatePasswordUsecase {
  export type Input = {
    id: string;
    oldPassword: string;
    newPassword: string;
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
      this.assureRequiredInputProvided(input, [
        'id',
        'oldPassword',
        'newPassword',
      ]);

      const entity = await this.repository.findById(input.id);

      await this.assurePasswordMatch(input, entity);

      entity.updatePassword(
        await this.hashProvider.generateHash(input.newPassword),
      );

      await this.repository.update(entity);

      return UserOutputMapper.toOutput(entity);
    }

    private async assurePasswordMatch(
      input: UpdatePasswordUsecase.Input,
      entity: UserEntity,
    ) {
      const checkOldPassword = await this.hashProvider.compareHash(
        input.oldPassword,
        entity.password,
      );

      if (!checkOldPassword) {
        throw new InvalidPasswordError();
      }
    }
  }
}
