import { faker } from '@faker-js/faker';
import { UserEntity } from '@/user/domain/entities/user.entity';
import { Entity } from '@/shared/domain/entities/entity';
import { validate } from 'uuid';

export type StubProps = {
  propA: string;
  propB: Date;
};

class StubEntity extends Entity<StubProps> {}

describe('User entity unit tests', () => {
  it('should create a new entity setting props + id', () => {
    const props = {
      propA: faker.word.noun(),
      propB: new Date(),
    };

    const sut = new StubEntity(props);

    expect(sut).toBeDefined();
    expect(sut).toBeInstanceOf(StubEntity);

    expect(sut.props).toBeDefined();
    expect(sut.props).toStrictEqual(props);

    expect(sut.id).not.toBeNull();
    expect(typeof sut.id).toBe('string');
    expect(validate(sut.id)).toBeTruthy();
  });

  it('should create a new entity setting props + id', () => {
    const props = {
      propA: faker.word.noun(),
      propB: new Date(),
    };
    const id = 'e7b28acb-ee6c-4a7d-8cc9-ed0a2be3bf8b';

    const sut = new StubEntity(props, id);

    expect(sut).toBeDefined();
    expect(sut).toBeInstanceOf(StubEntity);
    expect(sut.id).toBe(id);
  });

  it('should return a JSON representation of the entity', () => {
    const props = {
      propA: faker.word.noun(),
      propB: new Date(),
    };

    const sut = new StubEntity(props);

    const result = sut.toJSON();

    expect(result).toBeDefined();
    expect(result).toStrictEqual({
      id: sut.id,
      ...props,
    });
  });
});
