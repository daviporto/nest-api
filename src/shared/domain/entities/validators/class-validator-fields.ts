import {
  FieldsErrors,
  ValidatorFieldsInterface,
} from '@/shared/domain/entities/validators/validator-fields.interface';
import { validateSync } from 'class-validator';

export abstract class ClassValidatorFields<propsValidated>
  implements ValidatorFieldsInterface<propsValidated>
{
  public errors: FieldsErrors = null;
  public validatedData: propsValidated = null;

  validate(data: any): boolean {
    const errors = validateSync(data);

    if (errors.length) {
      this.errors = errors.reduce((acc, error) => {
        const { property, constraints } = error;
        acc[property] = Object.values(constraints);

        return acc;
      }, {} as FieldsErrors);

      return false;
    }

    this.validatedData = data;
    return true;
  }
}
