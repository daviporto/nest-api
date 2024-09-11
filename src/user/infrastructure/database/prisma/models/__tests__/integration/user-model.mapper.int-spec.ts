import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service';
import { execSync } from 'node:child_process';
import { User } from '@prisma/client';
import { UserModelMapper } from '@/user/infrastructure/database/prisma/models/user-model.mapper';
import { ValidationErrors } from '@/shared/domain/errors/validation-errors';

describe('User model mapper integration tests', () => {
  let prismaService: PrismaService;
  let props: any;

  beforeAll(async () => {
    execSync('npm run prisma:migrate-test');

    prismaService = new PrismaService();
    await prismaService.$connect();
  });

  beforeEach(() => {
    prismaService.user.deleteMany();
  });

  afterAll(async () => {
    await prismaService.$disconnect();
  });

  it('should throw error when user model is invalid', () => {
    const model: User = Object.assign({}, props, { name: null });

    expect(() => UserModelMapper.toEntity(model)).toThrowError(
      new ValidationErrors('Could not load user having id undefined'),
    );
  });
});
