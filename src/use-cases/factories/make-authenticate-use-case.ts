import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { AuthenticateUseCase } from '../authenticate';

export function makeAuthenticateUseCase() {
  const authenticateRepository = new PrismaUsersRepository();
  const authenticateUseCase = new AuthenticateUseCase(authenticateRepository);

  return authenticateUseCase;
}
