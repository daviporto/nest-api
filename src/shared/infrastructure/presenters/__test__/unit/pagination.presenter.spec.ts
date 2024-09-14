import { faker } from '@faker-js/faker';
import { UserDataBuilder } from '@/user/domain/testing/helper/user-data-builder';
import { UserPresenter } from '@/user/infrastructure/presenters/user.presenter';
import { instanceToPlain } from 'class-transformer';
import {
  PaginationPresenter,
  PaginationPresenterProps,
} from '@/shared/infrastructure/presenters/pagination.presenter';

describe('Pagination presenter unit tests', () => {
  let sut: PaginationPresenter;

  it('Constructor', () => {
    const props: PaginationPresenterProps = {
      currentPage: faker.number.int(),
      perPage: faker.number.int(),
      lastPage: faker.number.int(),
      total: faker.number.int(),
    };

    const sut = new PaginationPresenter(props);
    expect(sut).toBeDefined();
    expect(sut.currentPage).toEqual(props.currentPage);
    expect(sut.perPage).toEqual(props.perPage);
    expect(sut.lastPage).toEqual(props.lastPage);
    expect(sut.total).toEqual(props.total);
  });

  it('Should present the date as string', () => {
    const props: PaginationPresenterProps = {
      currentPage: '2' as any,
      perPage: '3' as any,
      lastPage: '4' as any,
      total: '5' as any,
    };

    const sut = new PaginationPresenter(props);
    expect(sut).toBeDefined();
    expect(sut.currentPage).toEqual('2');
    expect(sut.perPage).toEqual('3');
    expect(sut.lastPage).toEqual('4');
    expect(sut.total).toEqual('5');
  });

  it('Should present the date as expected when setting values as string', () => {
    const props: PaginationPresenterProps = {
      currentPage: '2' as any,
      perPage: '3' as any,
      lastPage: '4' as any,
      total: '5' as any,
    };

    const sut = new PaginationPresenter(props);
    const output = instanceToPlain(sut);
    expect(output).toBeDefined();
    expect(output.currentPage).toEqual(2);
    expect(output.perPage).toEqual(3);
    expect(output.lastPage).toEqual(4);
    expect(output.total).toEqual(5);
  });
});
