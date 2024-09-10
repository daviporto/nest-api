import { SignupUsecase } from '@/user/application/usecases/sign-up.usecase';

export class SignUpDto implements SignupUsecase.Input {
  name: string;
  email: string;
  password: string;
}
