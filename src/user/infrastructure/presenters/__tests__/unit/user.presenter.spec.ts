import { UserDataBuilder } from '@/user/domain/testing/helper/user-data-builder';
import {
  UserCollectionPresenter,
  UserPresenter,
} from '@/user/infrastructure/presenters/user.presenter';
import { faker } from '@faker-js/faker';
import { instanceToPlain } from 'class-transformer';
import { PaginationPresenter } from '@/shared/infrastructure/presenters/pagination.presenter';

describe('User presenter unit tests', () => {
  const id = faker.string.uuid();
  let props = { ...UserDataBuilder({}), id };
  let sut: UserPresenter;

  beforeEach(() => {
    sut = new UserPresenter(props);
  });

  it('Constructor', () => {
    expect(sut).toBeDefined();
    expect(sut.id).toEqual(props.id);
    expect(sut.name).toEqual(props.name);
    expect(sut.email).toEqual(props.email);
    expect(sut.createdAt).toEqual(props.createdAt);
  });

  it('Should present the date as expected', () => {
    const output = instanceToPlain(sut);

    expect(output).toBeDefined();
    expect(output.id).toEqual(id);
    expect(output.name).toEqual(props.name);
    expect(output.email).toEqual(props.email);
    expect(output.createdAt).toEqual(props.createdAt.toISOString());
  });

  describe('UserCollectionPresenter', () => {
    let sut: UserCollectionPresenter;

    it('Constructor', () => {
      const sut = new UserCollectionPresenter({
        items: [props],
        currentPage: 2,
        lastPage: 3,
        perPage: 10,
        total: 30,
      });

      expect(sut).toBeDefined();
      expect(sut).toBeInstanceOf(UserCollectionPresenter);
      expect(sut.data).toHaveLength(1);
      expect(sut.data[0]).toBeInstanceOf(UserPresenter);
      expect(sut.meta).toBeDefined();
      expect(sut.meta).toBeInstanceOf(PaginationPresenter);
    });

    it('Should present the date as expected', () => {
      const sut = new UserCollectionPresenter({
        items: [props],
        currentPage: 2,
        lastPage: 3,
        perPage: 10,
        total: 30,
      });

      const output = instanceToPlain(sut);

      expect(output).toBeDefined();
      expect(output.data).toBeDefined();
      expect(output.data[0].id).toEqual(id);
      expect(output.data[0].name).toEqual(props.name);
      expect(output.data[0].email).toEqual(props.email);
      expect(output.data[0].createdAt).toEqual(props.createdAt.toISOString());

      expect(output.meta).toBeDefined();
      expect(output.meta.currentPage).toEqual(2);
      expect(output.meta.lastPage).toEqual(3);
      expect(output.meta.perPage).toEqual(10);
      expect(output.meta.total).toEqual(30);
    });
  });
});
