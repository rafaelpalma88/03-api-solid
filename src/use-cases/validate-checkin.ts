import { CheckIn, User } from '@prisma/client';
import { CheckInsRepository } from '@/repositories/check-ins-repository';
import dayjs from 'dayjs';
import { LateCheckinError } from './errors/late-checkin-error';

interface ValidateCheckInUseCaseRequest {
  userId: string;
  checkinId: string;
}

interface ValidateCheckInUseCaseResponse {
  checkIn: CheckIn;
}

export class ValidateCheckinUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    checkinId
  }: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
    const checkIn = await this.checkInsRepository.findById(checkinId);

    if (!checkIn) {
      throw new Error(); // TODO: criar erro para avisar do checkin
    }

    const distanceInMinutesFromCheckinCreation = dayjs(new Date()).diff(
      checkIn.created_at,
      'minutes'
    );

    if (distanceInMinutesFromCheckinCreation > 20) {
      throw new LateCheckinError();
    }

    checkIn.validated_at = new Date();

    await this.checkInsRepository.save(checkIn);

    return {
      checkIn
    };
  }
}
