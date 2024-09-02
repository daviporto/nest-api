import { UserProps } from '@/user/domain/entities/user.entity';
import { faker } from '@faker-js/faker';

export function UserDataBuilder(props: Partial<UserProps>) {
  return {
    name: props.name || faker.person.fullName(),
    email: props.email || faker.internet.email(),
    password: props.password || faker.internet.password(),
    createdAt: props.createdAt || new Date(),
  };
}
