import { UserDataBuilder } from '@/user/domain/testing/helper/user-data-builder';
import {
  UserCollectionPresenter,
  UserPresenter,
} from '@/user/infrastructure/presenters/user.presenter';
import { faker } from '@faker-js/faker';
import { instanceToPlain } from 'class-transformer';
import { PaginationPresenter } from '@/shared/infrastructure/presenters/pagination.presenter';
import { LogInUserPresenter } from '@/user/infrastructure/presenters/log-in-user.presenter';

describe('User presenter unit tests', () => {
  const id = faker.string.uuid();
  let props = { ...UserDataBuilder({}), id };
  let token = faker.string.alphanumeric();
  let sut: LogInUserPresenter;

  beforeEach(() => {
    sut = new LogInUserPresenter(props, token);
  });

  it('Constructor', () => {
    expect(sut).toBeDefined();
    expect(sut.token).toEqual(token);
    expect(sut.id).toEqual(props.id);
    expect(sut.name).toEqual(props.name);
    expect(sut.email).toEqual(props.email);
    expect(sut.createdAt).toEqual(props.createdAt);
  });

  it('Should present the date as expected', () => {
    const output = instanceToPlain(sut);

    expect(output).toBeDefined();
    expect(sut.token).toEqual(token);
    expect(output.id).toEqual(id);
    expect(output.name).toEqual(props.name);
    expect(output.email).toEqual(props.email);
    expect(output.createdAt).toEqual(props.createdAt.toISOString());
  });
});
