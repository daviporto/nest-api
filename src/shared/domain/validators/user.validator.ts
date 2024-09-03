import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { UserProps } from '@/user/domain/entities/user.entity';
import { ClassValidatorFields } from '@/shared/domain/entities/validators/class-validator-fields';

class UserRules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string;

  @MaxLength(255)
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @MaxLength(100)
  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsDate()
  createdAt: Date;

  constructor(data: UserProps) {
    Object.assign(this, data);
  }
}

export class UserValidator extends ClassValidatorFields<UserRules> {
  validate(data: UserProps): boolean {
    return super.validate(new UserRules(data));
  }
}

export class UserValidatorFactory{
  static create(): UserValidator{
    return new UserValidator();
  }
}
