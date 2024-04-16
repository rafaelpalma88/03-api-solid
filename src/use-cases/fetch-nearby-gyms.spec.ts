import { expect, describe, it, beforeEach } from 'vitest';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms';

let gymsRepository: InMemoryGymsRepository;
let fetchNearbyGymsUseCase: FetchNearbyGymsUseCase;
describe('UseCase: Find Nearby Gyms', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();

    fetchNearbyGymsUseCase = new FetchNearbyGymsUseCase(gymsRepository);
  });
  it('should create a gym', async () => {
    await gymsRepository.create({
      title: 'Gym Example 1',
      description: 'Gym Description Example 1',
      phone: '123456789',
      latitude: -25.428543,
      longitude: -49.228618
    });

    await gymsRepository.create({
      title: 'Gym Example 2',
      description: 'Gym Description Example 1',
      phone: '123456789',
      latitude: -24.96006619785084,
      longitude: -47.871806475583945
    });

    const { gyms } = await fetchNearbyGymsUseCase.execute({
      userLatitude: -25.428543,
      userLongitude: -49.228618
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: 'Gym Example 1' })]);
  });
});
