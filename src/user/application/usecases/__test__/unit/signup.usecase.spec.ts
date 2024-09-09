import { SignupUsecase } from '@/user/application/usecases/sign-up.usecase';
import { UserInMemoryRepository } from '@/user/infrastructure/database/in-memory/repositories/user-in-memory.repository';
import { HashProvider } from '@/shared/application/providers/hash-provider';
import { BcryptjsHashProvider } from '@/user/infrastructure/providers/hash-provider/bcryptjs-hash.provider';
import { BadRequestError } from '@/shared/application/errors/bad-request-error';

describe('Signup use case test', () => {
  let sut: SignupUsecase.UseCase;
  let repository: UserInMemoryRepository;
  let hashProvider: HashProvider;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    hashProvider = new BcryptjsHashProvider();
    sut = new SignupUsecase.UseCase(repository, hashProvider);
  });

  describe('Bad request errors', () => {
    it('should throw a BadRequestError if name is not provided', async () => {
      const input = { name: '', email: 'test@example.com', password: '123456' };

      await expect(sut.execute(input)).rejects.toThrow(BadRequestError);
    });

    it('should throw a BadRequestError if email is not provided', async () => {
      const input = { name: 'Test', email: '', password: '123456' };

      await expect(sut.execute(input)).rejects.toThrow(BadRequestError);
    });

    it('should throw a BadRequestError if password is not provided', async () => {
      const input = { name: 'Test', email: 'test@example.com', password: '' };

      await expect(sut.execute(input)).rejects.toThrow(BadRequestError);
    });
  });

  it('should ensure email is available before signup', async () => {
    const input = {
      name: 'Test',
      email: 'test@example.com',
      password: '123456',
    };

    const spyAssureEmail = jest.spyOn(
      repository,
      'assureEmailIsAvailableToUse',
    );

    await sut.execute(input);

    expect(spyAssureEmail).toHaveBeenCalledWith(input.email);
  });

  it('should hash the password before storing the user', async () => {
    const input = {
      name: 'Test',
      email: 'test@example.com',
      password: '123456',
    };

    const spyGenerateHash = jest.spyOn(hashProvider, 'generateHash');

    await sut.execute(input);

    expect(spyGenerateHash).toHaveBeenCalledWith('123456');
  });

  it('should store the user with the hashed password', async () => {
    const input = {
      name: 'Test',
      email: 'test@example.com',
      password: '123456',
    };

    const spyInsert = jest.spyOn(repository, 'insert');

    await sut.execute(input);

    expect(spyInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        props: expect.objectContaining({
          email: input.email,
          name: input.name,
          password: expect.any(String),
        }),
      }),
    );
  });

  it('should return the correct output after successful signup', async () => {
    const input = {
      name: 'Test',
      email: 'test@example.com',
      password: '123456',
    };

    const result = await sut.execute(input);

    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('createdAt');
    expect(result.name).toBe(input.name);
    expect(result.email).toBe(input.email);
    expect(result.password).not.toBe('123456');
  });
});
