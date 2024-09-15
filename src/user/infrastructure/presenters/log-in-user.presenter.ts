import { UserOutput } from '@/user/application/dtos/user-output';
import { UserPresenter } from '@/user/infrastructure/presenters/user.presenter';

export class LogInUserPresenter extends UserPresenter {
  token: string;

  constructor(output: UserOutput, token: string) {
    super(output);

    this.token = token;
  }
}
