import { UpdateUserUsecase } from '@/user/application/usecases/update-user.usecase';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDto implements Omit<UpdateUserUsecase.Input, 'id'> {
  @IsString()
  @IsNotEmpty()
  name: string;
}
