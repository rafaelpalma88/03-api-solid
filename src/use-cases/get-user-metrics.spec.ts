import { describe, it, beforeEach, expect } from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { FetchUserCheckInsHistoryUseCase } from './fetch-user-checkins-history';
import { GetUserMetricsUseCase } from './get-user-metrics';

let checkInsRepository: InMemoryCheckInsRepository;
let getUserMetricsUseCase: GetUserMetricsUseCase;
describe('UseCase: Get User Metrics', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    getUserMetricsUseCase = new GetUserMetricsUseCase(checkInsRepository);
  });

  it('should be able to get a number of checkins', async () => {
    await checkInsRepository.create({
      gym_id: 'gym-id-1',
      user_id: 'user-id-1'
    });

    await checkInsRepository.create({
      gym_id: 'gym-id-2',
      user_id: 'user-id-1'
    });

    const { checkInsCount } = await getUserMetricsUseCase.execute({
      userId: 'user-id-1'
    });

    expect(checkInsCount).toEqual(2);
  });

  it('should be able to get a zero number of checkins', async () => {
    const { checkInsCount } = await getUserMetricsUseCase.execute({
      userId: 'user-id-1'
    });

    expect(checkInsCount).toEqual(0);
  });
});
