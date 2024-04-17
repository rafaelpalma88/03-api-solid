import { describe, it, beforeEach, expect, vi, afterEach } from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { MoreThanOneCheckinOnTheSameDayError } from './errors/more-than-one-checkin-same-day-error';
import { Decimal } from '@prisma/client/runtime/library';
import { MaxDistanceError } from './errors/max-distance-error';
import { ValidateCheckinUseCase } from './validate-checkin';

let checkInsRepository: InMemoryCheckInsRepository;
let validateCheckInUseCase: ValidateCheckinUseCase;
describe('UseCase: Validate CheckIn', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    validateCheckInUseCase = new ValidateCheckinUseCase(checkInsRepository);
  });
  afterEach(() => {
    vi.useRealTimers();
  });
  it('should be able to validate a checkin', async () => {
    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym-id-1',
      user_id: 'user-id-1'
    });

    const { checkIn } = await validateCheckInUseCase.execute({
      checkinId: createdCheckIn.id,
      userId: 'user-id-1'
    });

    expect(checkIn.validated_at).toBeInstanceOf(Date);
  });
  it('should be not able to validate a checkin after 20 minutes', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym-id-1',
      user_id: 'user-id-1'
    });

    const twentyOneMinutesInMs = 1000 * 60 * 21;

    vi.advanceTimersByTime(twentyOneMinutesInMs);

    await expect(() =>
      validateCheckInUseCase.execute({
        checkinId: createdCheckIn.id,
        userId: 'user-id-1'
      })
    ).rejects.toBeInstanceOf(Error);
  });
});
