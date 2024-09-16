import { UpdatePasswordUsecase } from '@/user/application/usecases/update-password.usecase';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto implements Omit<UpdatePasswordUsecase.Input, 'id'> {
  @ApiProperty({ description: 'The old password of the user' })
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({ description: 'The new password of the user' })
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
