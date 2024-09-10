import { UpdateUserUsecase } from '@/user/application/usecases/update-user.usecase';

export class UpdateUserDto implements Omit<UpdateUserUsecase.Input, 'id'> {
  name: string;
}
