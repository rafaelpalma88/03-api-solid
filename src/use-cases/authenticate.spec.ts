import { expect, describe, it, beforeEach } from 'vitest';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { AuthenticateUseCase } from './authenticate';
import { hash } from 'bcryptjs';
import { InvalidCredentialError } from './errors/invalid-credentials-user';

let usersRepository: InMemoryUsersRepository;
let authenticateUseCase: AuthenticateUseCase;

describe('UseCase: Authenticate', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();

    authenticateUseCase = new AuthenticateUseCase(usersRepository);
  });
  it('should be able to authenticate', async () => {
    await usersRepository.create({
      name: 'John Doe',
      password_hash: await hash('test@123', 6),
      email: 'john@doe.com'
    });

    const { user } = await authenticateUseCase.execute({
      password: 'test@123',
      email: 'john@doe.com'
    });

    expect(user.id).toEqual(expect.any(String));
  });
  it('should not be able to authenticate with wrong email', async () => {
    await usersRepository.create({
      name: 'John Doe',
      password_hash: await hash('test@123', 6),
      email: 'john@doe.com'
    });

    await expect(
      authenticateUseCase.execute({
        password: 'test@123',
        email: 'thelma@doe.com'
      })
    ).rejects.toBeInstanceOf(InvalidCredentialError);
  });
  it('should not be able to authenticate with wrong password', async () => {
    await usersRepository.create({
      name: 'John Doe',
      password_hash: await hash('test@123', 6),
      email: 'john@doe.com'
    });

    await expect(
      authenticateUseCase.execute({
        password: 'test@000',
        email: 'john@doe.com'
      })
    ).rejects.toBeInstanceOf(InvalidCredentialError);
  });
});
