import { describe, it, beforeEach, expect } from 'vitest';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { GetUserProfileUseCase } from './get-user-profile';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { hash } from 'bcryptjs';

let usersRepository: InMemoryUsersRepository;
let getUserProfileUseCase: GetUserProfileUseCase;
describe('UseCase: Get User Profile', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();

    getUserProfileUseCase = new GetUserProfileUseCase(usersRepository);
  });
  it('should be able to get user profile', async () => {
    const createdUser = await usersRepository.create({
      name: 'John Doe',
      password_hash: await hash('test@123', 6),
      email: 'john@doe.com'
    });

    const getUserProfileUseCase = new GetUserProfileUseCase(usersRepository);

    const { user } = await getUserProfileUseCase.execute({
      userId: createdUser.id
    });

    expect(user.id).toEqual(expect.any(String));
    expect(user.name).toEqual('John Doe');
  });
  it('should not be able to get user profile if used a wrong id', async () => {
    await expect(() =>
      getUserProfileUseCase.execute({
        userId: 'wrong-user-id'
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
