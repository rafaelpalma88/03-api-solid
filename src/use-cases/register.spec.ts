import { expect, describe, it } from 'vitest';
import { RegisterUseCase } from './register';
import { compare } from 'bcryptjs';

describe('UseCase: Register', () => {
  it('should hash user password upon registration', async () => {
    const registerUseCase = new RegisterUseCase({
      async findByEmail(email) {
        return null;
      },

      async create(data) {
        return {
          id: 'user-1',
          name: data.name,
          email: data.email,
          password_hash: data.password_hash,
          created_at: new Date()
        };
      }
    });

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
});
