import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-checkins-repository';
import { ValidateCheckinUseCase } from '../validate-checkin';

export function makeValidateCheckinUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository();
  const useCase = new ValidateCheckinUseCase(checkInsRepository);

  return useCase;
}
