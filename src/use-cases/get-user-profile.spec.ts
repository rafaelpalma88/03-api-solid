import { describe, it, beforeEach, expect } from 'vitest';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { GetUserProfileUseCase } from './get-user-profile';
import { RegisterUseCase } from './register';

let usersRepository: InMemoryUsersRepository;
let getUserProfileUseCase: GetUserProfileUseCase;
let registerUseCase: RegisterUseCase;
describe('UseCase: Get User Profile', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();

    getUserProfileUseCase = new GetUserProfileUseCase(usersRepository);

    registerUseCase = new RegisterUseCase(usersRepository);
  });
  it('should get a user by userId', async () => {
    const response = await registerUseCase.execute({
      name: 'John Doe',
      password: 'test@123',
      email: 'john@doe.com'
    });

    const getUserProfileUseCase = new GetUserProfileUseCase(usersRepository);

    const { user } = await getUserProfileUseCase.execute({
      userId: 'user-1'
    });

    expect(user.name).toEqual('John Doe');
  });
});
