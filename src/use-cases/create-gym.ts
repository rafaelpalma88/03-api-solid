import { Gym } from '@prisma/client';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { GymsRepository } from '@/repositories/gyms-repository';
import { randomUUID } from 'crypto';

interface CreateGymUseCaseRequest {
  title: string;
  description: string | null;
  phone?: string | null;
  latitude: number;
  longitude: number;
}

interface CreateGymUseCaseResponse {
  gym: Gym;
}

export class CreateGymUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async create({
    title,
    description,
    phone,
    latitude,
    longitude
  }: CreateGymUseCaseRequest): Promise<CreateGymUseCaseResponse> {
    const gym = await this.gymsRepository.create({
      id: randomUUID(),
      title,
      description,
      phone,
      latitude,
      longitude
    });

    if (!gym) {
      throw new ResourceNotFoundError();
    }

    return {
      gym
    };
  }
}
