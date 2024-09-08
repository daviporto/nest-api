import { UserRepository } from '@/user/domain/repositories/user.repository';
import { UserOutput } from '@/user/application/dtos/user-output';

export namespace GetUserUsecase {
  export type Input = {
    id: string;
  };

  export type Output = UserOutput;

  export class UseCase {
    constructor(private repository: UserRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const entity = await this.repository.findById(input.id);

      return entity.toJSON();
    }
  }
}
