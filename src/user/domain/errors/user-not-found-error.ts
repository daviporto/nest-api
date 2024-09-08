export class UserNotFoundError extends Error {
  constructor(public email: string) {
    super(`User with email ${email} not found`);
    this.name = 'UserNotFoundError';
  }
}
