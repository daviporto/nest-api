import { UpdatePasswordUsecase } from '@/user/application/usecases/update-password.usecase';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePasswordDto implements Omit<UpdatePasswordUsecase.Input, 'id'> {
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
