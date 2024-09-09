export class InvalidPasswordError extends Error {
  constructor() {
    super('Old password invalid');
    this.name = 'InvalidPasswordError';
  }
}
