import { UserOutput } from '@/user/application/dtos/user-output';
import { Transform } from 'class-transformer';
import { CollectionPresenter } from '@/shared/infrastructure/presenters/collection.presenter';
import { ListUsersUsecase } from '@/user/application/usecases/list-users.usecase';
import { ApiProperty } from '@nestjs/swagger';

export class UserPresenter {
  @ApiProperty({ description: 'The id of the user' })
  id: string;
  @ApiProperty({ description: 'The name of the user' })
  name: string;
  @ApiProperty({ description: 'The email of the user' })
  email: string;

  @ApiProperty({ description: 'The date when the user was created' })
  @Transform(({ value }: { value: Date }) => value.toISOString())
  createdAt: Date;

  constructor(output: UserOutput) {
    this.id = output.id;
    this.name = output.name;
    this.email = output.email;
    this.createdAt = output.createdAt;
  }
}

export class UserCollectionPresenter extends CollectionPresenter {
  data: UserPresenter[];

  constructor(output: ListUsersUsecase.Output) {
    const { items, ...pagination } = output;
    super(pagination);
    this.data = items.map((item) => new UserPresenter(item));
  }
}
