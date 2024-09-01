import { faker } from '@faker-js/faker';
import { UserEntity, UserProps } from '@/user/domain/entities/user.entity';

function commonAssertions(
  sut: UserEntity,
  props: UserProps,
) {
  expect(sut).toBeDefined();
  expect(sut).toBeInstanceOf(UserEntity);

  expect(sut.props.name).toBe(props.name);
  expect(sut.props.email).toBe(props.email);
  expect(sut.props.password).toBe(props.password);
}

describe('User entity unit tests', () => {
  let props: UserProps;
  let sut: UserEntity;

  it('test constructor without createdAt', () => {
    const props = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    sut = new UserEntity(props);

    commonAssertions(sut, props);

    expect(sut.props.createdAt).toBeDefined();
    expect(sut.props.createdAt).toBeInstanceOf(Date);
  });


  it('test constructor with createdAt', () => {
    const props = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      createdAt: new Date(),
    };

    sut = new UserEntity(props);

    commonAssertions(sut, props);

    expect(sut.props.createdAt).toBeDefined();
    expect(sut.props.createdAt).toBe(props.createdAt);
  });
});
