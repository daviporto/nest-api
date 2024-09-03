import { ClassValidatorFields } from '@/shared/domain/entities/validators/class-validator-fields';
import * as classValidatorLib from 'class-validator';
import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

class StubRules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  constructor(data: any) {
    Object.assign(this, data);
  }
}

class StubClassValidatorFields extends ClassValidatorFields<StubRules> {
  validate(data: any): boolean {
    return super.validate(new StubRules(data));
  }
}

describe('ClassValidatorFields Integration Tests', () => {
  it('Should validate with errors', () => {
    const validator = new StubClassValidatorFields();

    expect(validator.validate(null)).toBeFalsy();
    expect(validator.validatedData).toBeNull();

    expect(validator.errors).toBeDefined();
    expect(validator.errors).toStrictEqual({
      name: [
        'name should not be empty',
        'name must be a string',
        'name must be shorter than or equal to 255 characters',
      ],
      price: [
        'price should not be empty',
        'price must be a number conforming to the specified constraints',
      ],
    });
  });

  it('should not return error with correct info', () => {
    const validator = new StubClassValidatorFields();
    const data = {
      name: 'name',
      price: 10,
    };

    expect(validator.validate(data)).toBeTruthy();
    expect(validator.errors).toBeDefined();
    expect(validator.errors).toBeNull();

    expect(validator.validatedData).toBeDefined();
    expect(validator.validatedData).toStrictEqual(new StubRules(data));
  });
});
