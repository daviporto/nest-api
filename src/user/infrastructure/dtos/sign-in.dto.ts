import { SignInUsecase } from '@/user/application/usecases/sign-in.usecase';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto implements SignInUsecase.Input {
  @ApiProperty({ description: 'The email of the user' })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'The password of the user' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
