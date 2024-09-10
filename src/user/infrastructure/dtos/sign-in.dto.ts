import { SignInUsecase } from '@/user/application/usecases/sign-in.usecase';

export class SignInDto implements SignInUsecase.Input {
  email: string;
  password: string;
}
