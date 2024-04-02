import { expect, describe, it, beforeEach } from 'vitest';
import { RegisterUseCase } from './register';
import { compare } from 'bcryptjs';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { UserAlreadyExistsError } from './errors/user-already-exists';

let usersRepository: InMemoryUsersRepository;
let registerUseCase: RegisterUseCase;
describe('UseCase: Register', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();

    registerUseCase = new RegisterUseCase(usersRepository);
  });
  it('should register a user registration', async () => {
    const registerUseCase = new RegisterUseCase(usersRepository);

    const { user } = await registerUseCase.execute({
      name: 'John Doe',
      password: 'test@123',
      email: 'john@doe.com'
    });

    expect(user.id).toEqual(expect.any(String));
  });
  it('should hash user password upon registration', async () => {
    const { user } = await registerUseCase.execute({
      name: 'John Doe',
      password: 'test@123',
      email: 'john@doe.com'
    });

    const isPasswordCorrectlyHashed = await compare(
      'test@123',
      user.password_hash
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it('should no be able to create a user with an already used email', async () => {
    await registerUseCase.execute({
      name: 'John Doe',
      password: 'test@123',
      email: 'john@doe.com'
    });

    await expect(
      registerUseCase.execute({
        name: 'John Doe',
        password: 'test@123',
        email: 'john@doe.com'
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
