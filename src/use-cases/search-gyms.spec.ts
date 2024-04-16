import { expect, describe, it, beforeEach } from 'vitest';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { SearchGymsUseCase } from './search-gyms';

let gymsRepository: InMemoryGymsRepository;
let searchGymsUseCase: SearchGymsUseCase;
describe('UseCase: Search Gyms', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();

    searchGymsUseCase = new SearchGymsUseCase(gymsRepository);
  });
  it('should be able to search for gyms', async () => {
    await gymsRepository.create({
      title: 'Gym Example',
      description: 'Gym Description Example 1',
      phone: '123456789',
      latitude: -25.428543,
      longitude: -49.228618
    });

    await gymsRepository.create({
      title: 'Another Gym',
      description: 'Gym Description Example 2',
      phone: '123456789',
      latitude: -25.428543,
      longitude: -49.228618
    });

    const { gyms } = await searchGymsUseCase.execute({
      query: 'Gym Example',
      page: 1
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: 'Gym Example' })]);
  });
  it('should be able to fetch paginated gyms search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `Gym Example ${i}`,
        description: `Gyms description example ${i}`,
        phone: '123456789',
        latitude: -25.428543,
        longitude: -49.228618
      });
    }

    const { gyms } = await searchGymsUseCase.execute({
      query: 'Gym Example',
      page: 2
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Gym Example 21' }),
      expect.objectContaining({ title: 'Gym Example 22' })
    ]);
  });
});
