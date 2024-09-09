import { UserRepository } from '@/user/domain/repositories/user.repository';
import { UseCaseInterface } from '@/shared/application/use-cases/use-case';

export namespace DeleteUserUsecase {
  export type Input = {
    id: string;
  };

  export type Output = void;

  export class UseCase implements UseCaseInterface<Input, Output> {
    constructor(private repository: UserRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      await this.repository.delete(input.id);
    }
  }
}
