import { UpdateUserUsecase } from '@/user/application/usecases/update-user.usecase';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto implements Omit<UpdateUserUsecase.Input, 'id'> {
  @ApiProperty({ description: 'The name of the user' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
