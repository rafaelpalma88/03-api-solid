import { describe, it, beforeEach, expect, vi } from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { CheckinUseCase } from './check-in';
import { MoreThanOneCheckinOnTheSameDayError } from './errors/more-than-one-checkin-same-day-error';
import { afterEach } from 'node:test';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { Decimal } from '@prisma/client/runtime/library';
import { MaxDistanceError } from './errors/max-distance-error';

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let checkInUseCase: CheckinUseCase;
describe('UseCase: CheckIn', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    checkInUseCase = new CheckinUseCase(checkInsRepository, gymsRepository);

    gymsRepository.items.push({
      id: 'gym-id-1',
      title: 'title',
      description: 'description',
      latitude: new Decimal(-25.428543),
      longitude: new Decimal(-49.228618),
      phone: '99999999'
    });

    vi.useRealTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });
  it('should be able to do a checkin', async () => {
    const { checkIn } = await checkInUseCase.execute({
      gymId: 'gym-id-1',
      userId: 'user-id-1',
      userLatitude: -25.428543,
      userLongitude: -49.228618
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });
  it('should not be able to do a checkin twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await checkInUseCase.execute({
      gymId: 'gym-id-1',
      userId: 'user-id-1',
      userLatitude: -25.428543,
      userLongitude: -49.228618
    });

    await expect(() =>
      checkInUseCase.execute({
        gymId: 'gym-id-1',
        userId: 'user-id-1',
        userLatitude: -25.428543,
        userLongitude: -49.228618
      })
    ).rejects.toBeInstanceOf(MoreThanOneCheckinOnTheSameDayError);
  });
  it('should be able to checkin twice but in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await checkInUseCase.execute({
      gymId: 'gym-id-1',
      userId: 'user-id-1',
      userLatitude: -25.428543,
      userLongitude: -49.228618
    });

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

    const { checkIn } = await checkInUseCase.execute({
      gymId: 'gym-id-1',
      userId: 'user-id-1',
      userLatitude: -25.428543,
      userLongitude: -49.228618
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });
  it('should not be able to checkin on distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym-id-2',
      title: 'title',
      description: 'description',
      latitude: new Decimal(-25.362714),
      longitude: new Decimal(-49.162829),
      phone: '99999999'
    });

    await expect(() =>
      checkInUseCase.execute({
        gymId: 'gym-id-2',
        userId: 'user-id-1',
        userLatitude: -25.428543,
        userLongitude: -49.228618
      })
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
