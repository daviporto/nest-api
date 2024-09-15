import { PrismaClient } from '@prisma/client';
import { UserPrismaRepository } from '@/user/infrastructure/database/prisma/repositories/user-prisma.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { setUpPrismaTest } from '@/shared/infrastructure/database/prisma/testing/set-up-prisma-test';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { UserDataBuilder } from '@/user/domain/testing/helper/user-data-builder';
import { UserEntity } from '@/user/domain/entities/user.entity';
import { ListUsersUsecase } from '@/user/application/usecases/list-users.usecase';
import { SortOrderEnum } from '@/shared/domain/repositories/searchable-repository-contracts';

describe('List users usecase integration tests', () => {
  const prismaService = new PrismaClient();
  let repository: UserPrismaRepository;
  let sut: ListUsersUsecase.UseCase;
  let module: TestingModule;

  beforeAll(async () => {
    setUpPrismaTest();

    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();

    repository = new UserPrismaRepository(prismaService as any);
  });

  beforeEach(async () => {
    sut = new ListUsersUsecase.UseCase(repository);
    await prismaService.user.deleteMany();
  });

  afterAll(async () => {
    await prismaService.$disconnect();
    await module.close();
  });

  it('should retrieve users orderedBy createdAt as default', async () => {
    const entities = [];
    for (let i = 0; i < 11; i++) {
      const entity = new UserEntity(UserDataBuilder({}));

      await prismaService.user.create({ data: entity.toJSON() });
      entities.push(entity);
    }

    const output = await sut.execute({});

    expect(output).not.toBeNull();
    expect(output.items).toHaveLength(10);
    expect(output.total).toBe(11);
    expect(output.currentPage).toBe(1);
    expect(output.lastPage).toBe(2);
  });

  it('should returns output using filter, sort and paginate', async () => {
    const createdAt = new Date();
    const entities: UserEntity[] = [];
    const arrange = ['test', 'a', 'TEST', 'b', 'TeSt'];
    for (const element of arrange) {
      const index = arrange.indexOf(element);
      const entity = new UserEntity({
        ...UserDataBuilder({ name: element }),
        createdAt: new Date(createdAt.getTime() + index),
      });

      entities.push(entity);
      await prismaService.user.create({ data: entity.toJSON() });
    }

    let output = await sut.execute({
      page: 1,
      perPage: 2,
      sort: 'name',
      sortDir: SortOrderEnum.ASC,
      filter: 'TEST',
    });

    expect(output).toMatchObject({
      items: [entities[0].toJSON(), entities[4].toJSON()],
      total: 3,
      currentPage: 1,
      perPage: 2,
      lastPage: 2,
    });

    output = await sut.execute({
      page: 2,
      perPage: 2,
      sort: 'name',
      sortDir: SortOrderEnum.ASC,
      filter: 'TEST',
    });

    expect(output).toMatchObject({
      items: [entities[2].toJSON()],
      total: 3,
      currentPage: 2,
      perPage: 2,
      lastPage: 2,
    });
  });
});
