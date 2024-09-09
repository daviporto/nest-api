export class UserWithIdNotFoundError extends Error {
  constructor(public id: string) {
    super(`User having id ${id} not found`);
    this.name = 'UserWithIdNotFoundError';
  }
}
