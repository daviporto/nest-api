import { UserEntity } from '@/user/domain/entities/user.entity';
import { UserDataBuilder } from '@/user/domain/testing/helper/user-data-builder';
import { UserOutputMapper } from '@/user/application/dtos/user-output';

describe('User output unit tests', () => {
  it('should convert a user in output', () => {
    const user = new UserEntity(UserDataBuilder({}));
    const spyJson = jest.spyOn(user, 'toJSON');
    const sut = UserOutputMapper.toOutput(user);

    expect(spyJson).toHaveBeenCalled();
    expect(sut).toStrictEqual(user.toJSON());
  });
});
