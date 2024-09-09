import { BadRequestError } from '@/shared/application/errors/bad-request-error';
import { UseCaseInterface } from '@/shared/application/use-cases/use-case';

export abstract class AbstractUseCase<Input, Output>
  implements UseCaseInterface<Input, Output>
{
  abstract execute(input: Input): Promise<Output> | Output;

  protected assureRequiredInputProvided(input: Input, requiredFields: string[]) {
    requiredFields.forEach((field) => {
      if (!input[field]) {
        throw new BadRequestError(`${field} is required`);
      }
    });
  }
}
