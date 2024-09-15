import { SignupUsecase } from '@/user/application/usecases/sign-up.usecase';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignUpDto implements SignupUsecase.Input {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
