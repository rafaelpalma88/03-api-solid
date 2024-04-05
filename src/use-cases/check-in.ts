import { CheckIn, User } from '@prisma/client';
import { CheckInsRepository } from '@/repositories/check-ins-repository';
import { MoreThanOneCheckinOnTheSameDayError } from './errors/more-than-one-checkin-same-day-error';
import { GymsRepository } from '@/repositories/gyms-repository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { calculateDistance } from '@/lib/calculateDistance';

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
      throw new ResourceNotFoundError(); // erro pois nao temos a latitude e longitude do usuário
    }

    const distanceBetweenUserAndGym = calculateDistance({
      lat1: Number(gym.latitude),
      lon1: Number(gym.longitude),
      lat2: Number(userLatitude),
      lon2: Number(userLongitude)
    });

    if (distanceBetweenUserAndGym > 150) {
      throw new ResourceNotFoundError(); // erro pois a distancia é maior que 150 metros
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
