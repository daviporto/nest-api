import { ClassValidatorFields } from '@/shared/domain/entities/validators/class-validator-fields';
import * as classValidatorLib from 'class-validator';

class StubClassValidatorFields extends ClassValidatorFields<{
  field: string;
}> {}

describe('ClassValidatorFields Unit tests', () => {
  it('should create a new instance of ClassValidatorFields with null values as default ', () => {
    const sut = new StubClassValidatorFields();

    expect(sut).toBeDefined();
    expect(sut.errors).toBeNull();
    expect(sut.validatedData).toBeNull();
  });

  it('should validate with errors', () => {
    const spyValidateSync = jest.spyOn(classValidatorLib, 'validateSync');
    spyValidateSync.mockReturnValue([
      {
        property: 'field',
        constraints: {
          isRequired: 'field is required',
        },
      },
    ]);
    const sut = new StubClassValidatorFields();

    expect(sut).toBeDefined();
    expect(sut.validate(null)).toBeFalsy();
    expect(spyValidateSync).toHaveBeenCalledTimes(1);
    expect(sut.validatedData).toBeNull();

    expect(sut.errors).toBeDefined();
    expect(sut.errors).toStrictEqual({
      field: ['field is required'],
    });
  });

  it('should validate without errors', () => {
    const spyValidateSync = jest.spyOn(classValidatorLib, 'validateSync');
    spyValidateSync.mockReturnValue([]);
    const sut = new StubClassValidatorFields();

    expect(sut).toBeDefined();
    expect(sut.validate({ field: 'string' })).toBeTruthy();
    expect(spyValidateSync).toHaveBeenCalled();
    expect(sut.errors).toBeNull();
    expect(sut.validatedData).toStrictEqual({ field: 'string' });
  });
});
