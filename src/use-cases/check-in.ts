import { CheckIn, User } from '@prisma/client';
import { CheckInsRepository } from '@/repositories/check-ins-repository';
import { MoreThanOneCheckinOnTheSameDayError } from './errors/more-than-one-checkin-same-day-error';
import { GymsRepository } from '@/repositories/gyms-repository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { calculateDistance } from '@/utils/calculateDistance';
import { MaxDistanceError } from './errors/max-distance-error';
import { LatitudeLongitudeNotFoundError } from './errors/latitude-and-longitude-not-found-error';

interface CheckInUseCaseRequest {
  userId: string;
  gymId: string;
  userLatitude: number;
  userLongitude: number;
}

interface CheckInUseCaseResponse {
  checkIn: CheckIn;
}

export class CheckinUseCase {
  constructor(
    private checkInsRepository: CheckInsRepository,
    private gymsRepository: GymsRepository
  ) {}

  async execute({
    userId,
    gymId,
    userLatitude,
    userLongitude
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const checkInOnSameDay = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date()
    );

    if (checkInOnSameDay) {
      throw new MoreThanOneCheckinOnTheSameDayError();
    }

    const gym = await this.gymsRepository.findById(gymId);

    if (!gym) {
      throw new ResourceNotFoundError();
    }

    if (!userLatitude || !userLongitude) {
      throw new LatitudeLongitudeNotFoundError();
    }

    const distanceBetweenUserAndGym = calculateDistance(
      { latitude: Number(gym.latitude), longitude: Number(gym.longitude) },
      { latitude: Number(userLatitude), longitude: Number(userLongitude) }
    );

    const MAX_DISTANCE_IN_METERS = 100;

    if (distanceBetweenUserAndGym > MAX_DISTANCE_IN_METERS) {
      throw new MaxDistanceError();
    }

    const checkIn = await this.checkInsRepository.create({
      gym_id: gymId,
      user_id: userId
    });

    return {
      checkIn
    };
  }
}
