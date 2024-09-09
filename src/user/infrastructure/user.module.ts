import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SignupUsecase } from '@/user/application/usecases/sign-up.usecase';
import { UserInMemoryRepository } from '@/user/infrastructure/database/in-memory/repositories/user-in-memory.repository';
import { BcryptjsHashProvider } from '@/user/infrastructure/providers/hash-provider/bcryptjs-hash.provider';
import { UserRepository } from '@/user/domain/repositories/user.repository';
import { HashProvider } from '@/shared/application/providers/hash-provider';
import { SignInUsecase } from '@/user/application/usecases/sign-in.usecase';
import { GetUserUsecase } from '@/user/application/usecases/get-user.usecase';
import { ListUsersUsecase } from '@/user/application/usecases/list-users.usecase';
import { UpdateUserUsecase } from '@/user/application/usecases/update-user.usecase';
import { UpdatePasswordUsecase } from '@/user/application/usecases/update-password.usecase';
import { DeleteUserUsecase } from '@/user/application/usecases/delete-user.usecase';

@Module({
  controllers: [UserController],

  providers: [
    UserService,
    {
      provide: 'UserRepository',
      useClass: UserInMemoryRepository,
    },
    {
      provide: 'HashProvider',
      useClass: BcryptjsHashProvider,
    },
    {
      provide: SignupUsecase.UseCase,
      useFactory: (
        userRepository: UserRepository.Repository,
        hashProvider: HashProvider,
      ) => {
        return new SignupUsecase.UseCase(userRepository, hashProvider);
      },
      inject: ['UserRepository', 'HashProvider'],
    },
    {
      provide: SignInUsecase.UseCase,
      useFactory: (
        userRepository: UserRepository.Repository,
        hashProvider: HashProvider,
      ) => {
        return new SignInUsecase.UseCase(userRepository, hashProvider);
      },
      inject: ['UserRepository', 'HashProvider'],
    },
    {
      provide: GetUserUsecase.UseCase,
      useFactory: (userRepository: UserRepository.Repository) => {
        return new GetUserUsecase.UseCase(userRepository);
      },
      inject: ['UserRepository'],
    },
    {
      provide: ListUsersUsecase.UseCase,
      useFactory: (userRepository: UserRepository.Repository) => {
        return new ListUsersUsecase.UseCase(userRepository);
      },
      inject: ['UserRepository'],
    },
    {
      provide: UpdateUserUsecase.UseCase,
      useFactory: (userRepository: UserRepository.Repository) => {
        return new UpdateUserUsecase.UseCase(userRepository);
      },
      inject: ['UserRepository'],
    },
    {
      provide: UpdatePasswordUsecase.UseCase,
      useFactory: (
        userRepository: UserRepository.Repository,
        hashProvider: HashProvider,
      ) => {
        return new UpdatePasswordUsecase.UseCase(userRepository, hashProvider);
      },
      inject: ['UserRepository', 'HashProvider'],
    },
    {
      provide: DeleteUserUsecase.UseCase,
      useFactory: (userRepository: UserRepository.Repository) => {
        return new DeleteUserUsecase.UseCase(userRepository);
      },
      inject: ['UserRepository'],
    },
  ],
})
export class UserModule {}
