import { FetchUserCheckInsHistoryUseCase } from '../fetch-user-checkins-history';
import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-checkins-repository';

export function makeFetchUserCheckinsHistoryUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository();
  const useCase = new FetchUserCheckInsHistoryUseCase(checkInsRepository);

  return useCase;
}
