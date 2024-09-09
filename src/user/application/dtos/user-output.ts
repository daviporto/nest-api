import { UserEntity } from '@/user/domain/entities/user.entity';
import { en } from '@faker-js/faker';

export type UserOutput = {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
};

export class UserOutputMapper {
  static toOutput(entity: UserEntity): UserOutput {
    return entity.toJSON();
  }
}
