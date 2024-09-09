import { UserRepository } from '@/user/domain/repositories/user.repository';
import {
  UserOutput,
  UserOutputMapper,
} from '@/user/application/dtos/user-output';
import { UseCaseInterface } from '@/shared/application/use-cases/use-case';
import { BadRequestError } from '@/shared/application/errors/bad-request-error';

export namespace UpdateUserUsecase {
  export type Input = {
    id: string;
    name: string;
  };

  export type Output = UserOutput;

  export class UseCase implements UseCaseInterface<Input, Output> {
    constructor(private repository: UserRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      if (!input.name) {
        throw new BadRequestError('Name is required');
      }

      const entity = await this.repository.findById(input.id);

      entity.update(input.name);
      await this.repository.update(entity);

      return UserOutputMapper.toOutput(entity);
    }
  }
}
