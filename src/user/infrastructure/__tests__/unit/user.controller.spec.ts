import { UserController } from '@/user/infrastructure/user.controller';
import { UserOutput } from '@/user/application/dtos/user-output';
import { UserDataBuilder } from '@/user/domain/testing/helper/user-data-builder';
import { SignupUsecase } from '@/user/application/usecases/sign-up.usecase';
import { SignUpDto } from '@/user/infrastructure/dtos/sign-up.dto';
import { SignInDto } from '@/user/infrastructure/dtos/sign-in.dto';
import { ListUsersDto } from '@/user/infrastructure/dtos/list-users.dto';
import { UpdateUserDto } from '@/user/infrastructure/dtos/update-user.dto';
import { faker } from '@faker-js/faker';
import { UpdatePasswordDto } from '@/user/infrastructure/dtos/update-password.dto';
import {
  UserCollectionPresenter,
  UserPresenter,
} from '@/user/infrastructure/presenters/user.presenter';
import { ListUsersUsecase } from '@/user/application/usecases/list-users.usecase';
import { LogInUserPresenter } from '@/user/infrastructure/presenters/log-in-user.presenter';

describe('UserController unit tests', () => {
  let sut: UserController;
  let id: string;
  let props: UserOutput;

  beforeEach(() => {
    sut = new UserController();
    props = {
      id: '5ea0320a-3483-42d4-be62-48e29b9a631d',
      ...UserDataBuilder({}),
    };
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should create a user', async () => {
    const output: SignupUsecase.Output = props;
    const mockSignUpUseCase = {
      execute: jest.fn().mockResolvedValue(Promise.resolve(output)),
    };

    sut['signUpUseCase'] = mockSignUpUseCase as any;

    const input: SignUpDto = {
      name: props.name,
      email: props.email,
      password: props.password,
    };

    const presenter = await sut.create(input);
    expect(presenter).toBeInstanceOf(UserPresenter);
    expect(presenter).toMatchObject(new UserPresenter(output));
    expect(mockSignUpUseCase.execute).toHaveBeenCalledWith(input);
  });

  it('should log in a user', async () => {
    const token = faker.string.alphanumeric();

    const mockSignInUseCase = {
      execute: jest.fn().mockResolvedValue(Promise.resolve(props)),
    };

    const mockAuthService = {
      generateJwt: jest
        .fn()
        .mockResolvedValue(Promise.resolve({ accessToken: token })),
    };

    sut['singInUseCase'] = mockSignInUseCase as any;
    sut['authService'] = mockAuthService as any;

    const input: SignInDto = { email: props.email, password: 'password123' };

    const presenter = await sut.login(input);
    expect(presenter).toBeInstanceOf(LogInUserPresenter);
    expect(presenter).toMatchObject(new LogInUserPresenter(props, token));
    expect(mockSignInUseCase.execute).toHaveBeenCalledWith(input);
    expect(mockAuthService.generateJwt).toHaveBeenCalled();
  });

  it('should list users', async () => {
    const users = [props];
    const output: ListUsersUsecase.Output = {
      items: users,
      currentPage: 1,
      lastPage: 1,
      perPage: 10,
      total: 1,
    };

    const mockListUsersUseCase = {
      execute: jest.fn().mockResolvedValue(Promise.resolve(output)),
    };

    sut['listUsersUseCase'] = mockListUsersUseCase as any;

    const input: ListUsersDto = {};
    const presenter = await sut.search(input);
    expect(presenter).toBeInstanceOf(UserCollectionPresenter);
    expect(presenter).toEqual(new UserCollectionPresenter(output));
    expect(mockListUsersUseCase.execute).toHaveBeenCalledWith(input);
  });

  it('should return a single user by ID', async () => {
    const mockGetUserUseCase = {
      execute: jest.fn().mockResolvedValue(Promise.resolve(props)),
    };

    sut['getUserUseCase'] = mockGetUserUseCase as any;

    const presenter = await sut.findOne(id);
    expect(presenter).toBeInstanceOf(UserPresenter);
    expect(presenter).toMatchObject(new UserPresenter(props));
  });

  it('should update user data', async () => {
    const updatedProps = { ...props, name: faker.person.fullName() };
    const mockUpdateUserUseCase = {
      execute: jest.fn().mockResolvedValue(Promise.resolve(updatedProps)),
    };

    sut['updateUserUseCase'] = mockUpdateUserUseCase as any;

    const input: UpdateUserDto = { name: updatedProps.name };

    const presenter = await sut.update(id, input);
    expect(presenter).toBeInstanceOf(UserPresenter);
    expect(presenter).toMatchObject(new UserPresenter(updatedProps));
    expect(mockUpdateUserUseCase.execute).toHaveBeenCalledWith(input);
  });

  it('should update user password', async () => {
    const mockUpdatePasswordUseCase = {
      execute: jest.fn().mockResolvedValue(Promise.resolve(props)),
    };

    sut['updatePasswordUseCase'] = mockUpdatePasswordUseCase as any;

    const input: UpdatePasswordDto = {
      oldPassword: 'old-password',
      newPassword: 'new-password',
    };

    const presenter = await sut.updatePassword(id, input);
    expect(presenter).toBeInstanceOf(UserPresenter);
    expect(presenter).toMatchObject(new UserPresenter(props));
    expect(mockUpdatePasswordUseCase.execute).toHaveBeenCalledWith(input);
  });

  it('should delete a user by ID', async () => {
    const mockDeleteUserUseCase = {
      execute: jest.fn().mockResolvedValue(Promise.resolve()),
    };

    sut['deleteUserUseCase'] = mockDeleteUserUseCase as any;

    await sut.remove(id);
    expect(mockDeleteUserUseCase.execute).toHaveBeenCalledWith({ id });
  });
});
