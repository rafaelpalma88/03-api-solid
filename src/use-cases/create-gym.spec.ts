import { expect, describe, it, beforeEach } from 'vitest';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { CreateGymUseCase } from './create-gym';

let gymsRepository: InMemoryGymsRepository;
let gymsUseCase: CreateGymUseCase;
describe('UseCase: Create Gym', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();

    gymsUseCase = new CreateGymUseCase(gymsRepository);
  });
  it('should create a gym', async () => {
    const { gym } = await gymsUseCase.create({
      title: 'Gym Example',
      description: 'Gym Description Example',
      phone: '123456789',
      latitude: -25.428543,
      longitude: -49.228618
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
