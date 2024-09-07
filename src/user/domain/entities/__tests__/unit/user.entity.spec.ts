import { faker } from '@faker-js/faker';
import { UserEntity, UserProps } from '@/user/domain/entities/user.entity';
import { UserDataBuilder } from '@/user/domain/testing/helper/user-data-builder';

function commonAssertions(sut: UserEntity, props: UserProps) {
  expect(sut).toBeDefined();
  expect(sut).toBeInstanceOf(UserEntity);
  expect(UserEntity.validate).toHaveBeenCalled()

  expect(sut.props.name).toBe(props.name);
  expect(sut.props.email).toBe(props.email);
  expect(sut.props.password).toBe(props.password);
}

describe('User entity unit tests', () => {
  let sut: UserEntity;

  beforeEach(() => {
    UserEntity.validate = jest.fn();
  })

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

    sut = new UserEntity(UserDataBuilder({ name }));

    expect(sut.name).toBeDefined();
    expect(typeof sut.name).toBe('string');
    expect(sut.name).toBe(name);
  });

  it('test update name' , () => {
    sut = new UserEntity(UserDataBuilder({}));

    const name = faker.person.fullName();

    sut.update(name);

    expect(sut.name).toBe(name);
  });

  it('test update password' , () => {
    sut = new UserEntity(UserDataBuilder({}));

    const password = faker.internet.password();

    sut.updatePassword(password);

    expect(sut.password).toBe(password);
  });

  it('test email getter', () => {
    const email = faker.internet.email();
    sut = new UserEntity(UserDataBuilder({ email }));

    expect(sut.email).toBeDefined();
    expect(typeof sut.email).toBe('string');
    expect(sut.email).toBe(email);
  });

  it('test password getter', () => {
    const password = faker.internet.password();
    sut = new UserEntity(UserDataBuilder({ password }));

    expect(sut.password).toBeDefined();
    expect(typeof sut.password).toBe('string');
    expect(sut.password).toBe(password);
  });

  it('test createdAt getter', () => {
    const createdAt = new Date();
    sut = new UserEntity(UserDataBuilder({ createdAt }));

    expect(sut.createdAt).toBeDefined();
    expect(sut.createdAt).toBeInstanceOf(Date);
    expect(sut.createdAt).toBe(createdAt);
  });
});
