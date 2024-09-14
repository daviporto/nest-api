import { faker } from '@faker-js/faker';
import { UserDataBuilder } from '@/user/domain/testing/helper/user-data-builder';
import { UserPresenter } from '@/user/infrastructure/presenters/user.presenter';
import { instanceToPlain } from 'class-transformer';
import {
  PaginationPresenter,
  PaginationPresenterProps,
} from '@/shared/infrastructure/presenters/pagination.presenter';
import { CollectionPresenter } from '@/shared/infrastructure/presenters/collection.presenter';

class StubCollectionPresenter extends CollectionPresenter {
  data = [1, 2, 3];
}

describe('Pagination presenter unit tests', () => {
  let sut: StubCollectionPresenter;
  const props: PaginationPresenterProps = {
    currentPage: faker.number.int(),
    perPage: faker.number.int(),
    lastPage: faker.number.int(),
    total: faker.number.int(),
  };

  beforeEach(() => {
    sut = new StubCollectionPresenter(props);
  });

  it('Constructor', () => {
    expect(sut['paginationPresenter']).toBeDefined();
    expect(sut['paginationPresenter']).toBeInstanceOf(PaginationPresenter);
    expect(sut['paginationPresenter'].currentPage).toEqual(props.currentPage);
    expect(sut['paginationPresenter'].perPage).toEqual(props.perPage);
    expect(sut['paginationPresenter'].lastPage).toEqual(props.lastPage);
    expect(sut['paginationPresenter'].total).toEqual(props.total);
  });

  it('should format response', () => {
    const output = instanceToPlain(sut);

    expect(output).toBeDefined();
    expect(output.meta).toBeDefined();
    expect(output.meta).toMatchObject(props);
    expect(output.data).toBeDefined();
    expect(output.data).toEqual([1, 2, 3]);
  });
});
