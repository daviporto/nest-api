import {
  UserValidator,
  UserValidatorFactory,
} from '@/shared/domain/validators/user.validator';
import { UserDataBuilder } from '@/user/domain/testing/helper/user-data-builder';

let sut: UserValidator;

describe('ClassValidatorFields Integration Tests', () => {
  beforeEach(() => {
    sut = UserValidatorFactory.create();
  });

  describe('name validation', () => {
    it('should return true with valid name', () => {
      const data = UserDataBuilder({});
      const isValid = sut.validate(data);

      expect(isValid).toBeTruthy();
      expect(sut.errors).toBeNull();
      expect(sut.validatedData.name).toStrictEqual(data.name);
    });

    it('Should validate without data', () => {
      const isValid = sut.validate(null);

      expect(isValid).toBeFalsy();
      expect(sut.errors).toBeDefined();
      expect(sut.errors['name']).toStrictEqual([
        'name should not be empty',
        'name must be a string',
        'name must be shorter than or equal to 255 characters',
      ]);
    });

    it('Should validate name being null', () => {
      const isValid = sut.validate({ ...UserDataBuilder({}), name: null });

      expect(isValid).toBeFalsy();
      expect(sut.errors).toBeDefined();
      expect(sut.errors['name']).toStrictEqual([
        'name should not be empty',
        'name must be a string',
        'name must be shorter than or equal to 255 characters',
      ]);
    });

    it('Should validate name empty string', () => {
      const isValid = sut.validate({ ...UserDataBuilder({}), name: '' });

      expect(isValid).toBeFalsy();
      expect(sut.errors).toBeDefined();
      expect(sut.errors['name']).toStrictEqual(['name should not be empty']);
    });

    it('Should validate name being date instead of string', () => {
      const isValid = sut.validate({
        ...UserDataBuilder({}),
        name: new Date() as any,
      });

      expect(isValid).toBeFalsy();
      expect(sut.errors).toBeDefined();
      expect(sut.errors['name']).toStrictEqual([
        'name must be a string',
        'name must be shorter than or equal to 255 characters',
      ]);
    });

    it('Should validate name being greater than 255', () => {
      const isValid = sut.validate({
        ...UserDataBuilder({}),
        name: 'a'.repeat(256),
      });

      expect(isValid).toBeFalsy();
      expect(sut.errors).toBeDefined();
      expect(sut.errors['name']).toStrictEqual([
        'name must be shorter than or equal to 255 characters',
      ]);
    });
  });

  describe('password validation', () => {
    it('should return true with valid password', () => {
      const data = UserDataBuilder({});
      const isValid = sut.validate(data);

      expect(isValid).toBeTruthy();
      expect(sut.errors).toBeNull();
      expect(sut.validatedData.password).toStrictEqual(data.password);
    });

    it('Should validate without data', () => {
      const isValid = sut.validate(null);

      expect(isValid).toBeFalsy();
      expect(sut.errors).toBeDefined();
      expect(sut.errors['password']).toStrictEqual([
        'password must be a string',
        'password should not be empty',
        'password must be shorter than or equal to 100 characters',
      ]);
    });

    it('Should validate password being null', () => {
      const isValid = sut.validate({ ...UserDataBuilder({}), password: null });

      expect(isValid).toBeFalsy();
      expect(sut.errors).toBeDefined();
      expect(sut.errors['password']).toStrictEqual([
        'password must be a string',
        'password should not be empty',
        'password must be shorter than or equal to 100 characters',
      ]);
    });

    it('Should validate password empty string', () => {
      const isValid = sut.validate({ ...UserDataBuilder({}), password: '' });

      expect(isValid).toBeFalsy();
      expect(sut.errors).toBeDefined();
      expect(sut.errors['password']).toStrictEqual([
        'password should not be empty',
      ]);
    });

    it('Should validate password being date instead of string', () => {
      const isValid = sut.validate({
        ...UserDataBuilder({}),
        password: new Date() as any,
      });

      expect(isValid).toBeFalsy();
      expect(sut.errors).toBeDefined();
      expect(sut.errors['password']).toStrictEqual([
        'password must be a string',
        'password must be shorter than or equal to 100 characters',
      ]);
    });

    it('Should validate password being greater than 100', () => {
      const isValid = sut.validate({
        ...UserDataBuilder({}),
        password: 'a'.repeat(101),
      });

      expect(isValid).toBeFalsy();
      expect(sut.errors).toBeDefined();
      expect(sut.errors['password']).toStrictEqual([
        'password must be shorter than or equal to 100 characters',
      ]);
    });
  });

  describe('email validation', () => {
    it('should return true with valid email', () => {
      const data = UserDataBuilder({});
      const isValid = sut.validate(data);

      expect(isValid).toBeTruthy();
      expect(sut.errors).toBeNull();
      expect(sut.validatedData.email).toStrictEqual(data.email);
    });

    it('Should validate without data', () => {
      const isValid = sut.validate(null);

      expect(isValid).toBeFalsy();
      expect(sut.errors).toBeDefined();
      expect(sut.errors['email']).toStrictEqual([
        'email must be an email',
        'email should not be empty',
        'email must be shorter than or equal to 255 characters',
      ]);
    });

    it('Should validate email being null', () => {
      const isValid = sut.validate({ ...UserDataBuilder({}), email: null });

      expect(isValid).toBeFalsy();
      expect(sut.errors).toBeDefined();
      expect(sut.errors['email']).toStrictEqual([
        'email must be an email',
        'email should not be empty',
        'email must be shorter than or equal to 255 characters',
      ]);
    });

    it('Should validate email empty string', () => {
      const isValid = sut.validate({ ...UserDataBuilder({}), email: '' });

      expect(isValid).toBeFalsy();
      expect(sut.errors).toBeDefined();
      expect(sut.errors['email']).toStrictEqual([
        'email must be an email',
        'email should not be empty',
      ]);
    });

    it('Should validate email being date instead of string', () => {
      const isValid = sut.validate({
        ...UserDataBuilder({}),
        email: new Date() as any,
      });

      expect(isValid).toBeFalsy();
      expect(sut.errors).toBeDefined();
      expect(sut.errors['email']).toStrictEqual([
        'email must be an email',
        'email must be shorter than or equal to 255 characters',
      ]);
    });

    it('Should validate email being greater than 255', () => {
      const isValid = sut.validate({
        ...UserDataBuilder({}),
        email: 'a'.repeat(256),
      });

      expect(isValid).toBeFalsy();
      expect(sut.errors).toBeDefined();
      expect(sut.errors['email']).toStrictEqual([
        'email must be an email',
        'email must be shorter than or equal to 255 characters',
      ]);
    });
  });

  describe('createdAt validation', () => {
    it('should return true with valid date', () => {
      const data = UserDataBuilder({});
      const isValid = sut.validate(data);

      expect(isValid).toBeTruthy();
      expect(sut.errors).toBeNull();
      expect(sut.validatedData.createdAt).toStrictEqual(data.createdAt);
    });

    it('Should validate true without data', () => {
      const isValid = sut.validate({ ...UserDataBuilder({}), createdAt: null });

      expect(isValid).toBeTruthy();
      expect(sut.errors).toBeNull();
      expect(sut.validatedData.createdAt).toBeNull();
    });

    it('Should validate email being not an instanceOf date', () => {
      const isValid = sut.validate({
        ...UserDataBuilder({}),
        createdAt: 123 as any,
      });

      expect(isValid).toBeFalsy();
      expect(sut.errors).toBeDefined();
      expect(sut.errors['createdAt']).toStrictEqual([
        'createdAt must be a Date instance',
      ]);
    });
  });
});
