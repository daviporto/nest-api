export class EmailAlreadyInUseError extends Error {
  constructor(public email: string) {
    super(`User with email ${email} already exists`);
    this.name = 'EmailAlreadyInUseError';
  }
}
