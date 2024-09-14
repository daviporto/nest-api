import { SignInUsecase } from '@/user/application/usecases/sign-in.usecase';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInDto implements SignInUsecase.Input {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
