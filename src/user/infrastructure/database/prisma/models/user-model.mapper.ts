import { User } from '@prisma/client';
import { UserEntity } from '@/user/domain/entities/user.entity';
import { ValidationErrors } from '@/shared/domain/errors/validation-errors';

export class UserModelMapper {
  static toEntity(model: User): UserEntity {
    const data = {
      name: model.name,
      email: model.email,
      password: model.password,
      createdAt: model.createdAt,
    };
    try {
      return new UserEntity(data, model.id);
    } catch {
      throw new ValidationErrors(`Could not load user having id ${model.id}`);
    }
  }
}
