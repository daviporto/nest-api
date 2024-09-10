import { UpdatePasswordUsecase } from '@/user/application/usecases/update-password.usecase';

export class UpdatePasswordDto implements Omit<UpdatePasswordUsecase.Input, 'id'> {
  oldPassword: string;
  newPassword: string;
}
