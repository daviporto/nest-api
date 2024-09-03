export type FieldsErrors = {
  [field: string]: string[];
};

export interface ValidatorFieldsInterface<propsValidated> {
  errors: FieldsErrors;
  validatedData: propsValidated;

  validate(date: any): boolean;
}
