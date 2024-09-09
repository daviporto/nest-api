import { UserRepository } from '@/user/domain/repositories/user.repository';
import {
  UserOutput,
  UserOutputMapper,
} from '@/user/application/dtos/user-output';
import { UseCaseInterface } from '@/shared/application/use-cases/use-case';

export namespace GetUserUsecase {
  export type Input = {
    id: string;
  };

  export type Output = UserOutput;

  export class UseCase implements UseCaseInterface<Input, Output> {
    constructor(private repository: UserRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const entity = await this.repository.findById(input.id);

      return UserOutputMapper.toOutput(entity);
    }
  }
}
