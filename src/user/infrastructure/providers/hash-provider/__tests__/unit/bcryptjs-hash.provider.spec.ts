import { BcryptjsHashProvider } from '@/user/infrastructure/providers/hash-provider/bcryptjs-hash.provider';
import { fa, faker } from '@faker-js/faker';

describe('BcryptjsHashProvider', () => {
  let sut: BcryptjsHashProvider;

  beforeEach(() => {
    sut = new BcryptjsHashProvider();
  });

  describe('generateHash', () => {
    it('should generate a valid hash for a given string', async () => {
      const payload = faker.internet.password();

      const hashed = await sut.generateHash(payload);

      expect(typeof hashed).toBe('string');
      expect(hashed).not.toBe(payload);
    });
  });

  describe('compareHash', () => {
    it('should return true when comparing a valid payload with the correct hash', async () => {
      const payload = faker.internet.password();
      const hashed = await sut.generateHash(payload);

      const isValid = await sut.compareHash(payload, hashed);

      expect(isValid).toBeTruthy();
    });

    it('should return false when comparing an invalid payload with the hash', async () => {
      const payload = faker.internet.password();
      const hashed = await sut.generateHash(payload);

      const isValid = await sut.compareHash('wrongPassword', hashed);

      expect(isValid).toBeFalsy();
    });
  });
});
