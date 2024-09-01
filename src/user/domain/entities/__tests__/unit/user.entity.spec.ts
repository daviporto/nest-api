import { faker } from '@faker-js/faker';
import { UserEntity, UserProps } from '@/user/domain/entities/user.entity';

function commonAssertions(sut: UserEntity, props: UserProps) {
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

  it('test name getter', () => {
    const name = faker.person.fullName();
    const props = {
      name,
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    sut = new UserEntity(props);

    expect(sut.name).toBeDefined();
    expect(typeof sut.name).toBe('string');
    expect(sut.name).toBe(name);
  });

  it('test email getter', () => {
    const email = faker.internet.email();
    const props = {
      name: faker.person.fullName(),
      email,
      password: faker.internet.password(),
    };

    sut = new UserEntity(props);

    expect(sut.email).toBeDefined();
    expect(typeof sut.email).toBe('string');
    expect(sut.email).toBe(email);
  });

  it('test password getter', () => {
    const password = faker.internet.password();
    const props = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password,
    };

    sut = new UserEntity(props);

    expect(sut.password).toBeDefined();
    expect(typeof sut.password).toBe('string');
    expect(sut.password).toBe(password);
  });

  it('test createdAt getter', () => {
    const createdAt = new Date();
    const props = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      createdAt,
    };

    sut = new UserEntity(props);

    expect(sut.createdAt).toBeDefined();
    expect(sut.createdAt).toBeInstanceOf(Date);
    expect(sut.createdAt).toBe(createdAt);
  });
});
