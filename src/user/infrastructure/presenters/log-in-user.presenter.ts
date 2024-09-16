import { UserOutput } from '@/user/application/dtos/user-output';
import { UserPresenter } from '@/user/infrastructure/presenters/user.presenter';
import { ApiProperty } from '@nestjs/swagger';

export class LogInUserPresenter extends UserPresenter {
  @ApiProperty({ description: 'The token of the user' })
  token: string;

  constructor(output: UserOutput, token: string) {
    super(output);

    this.token = token;
  }
}
