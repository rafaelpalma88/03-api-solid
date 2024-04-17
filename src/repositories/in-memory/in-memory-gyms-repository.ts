import { Gym, Prisma } from '@prisma/client';
import { FindManyNearbyParams, GymsRepository } from '../gyms-repository';
import { Decimal } from '@prisma/client/runtime/library';
import { randomUUID } from 'crypto';
import { getDistanceBetweenCoordinates } from '@/utils/getDistanceBetweenCoordinates';

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = [];
  async create(data: Prisma.GymCreateInput): Promise<{
    id: string;
    title: string;
    description: string | null;
    phone: string | null;
    latitude: Decimal;
    longitude: Decimal;
  }> {
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
      created_at: new Date()
    };

    this.items.push(gym);

    return gym;
  }

  async searchMany(
    query: string,
    page: number
  ): Promise<
    {
      id: string;
      title: string;
      description: string | null;
      phone: string | null;
      latitude: Prisma.Decimal;
      longitude: Prisma.Decimal;
    }[]
  > {
    return this.items
      .filter((item) => item.title.includes(query))
      .slice((page - 1) * 20, page * 20);
  }

  async searchNearby(params: FindManyNearbyParams): Promise<Gym[]> {
    const gyms = this.items.filter((item) => {
      const distance = getDistanceBetweenCoordinates(
        { latitude: params.latitude, longitude: params.longitude },
        {
          latitude: item.latitude.toNumber(),
          longitude: item.longitude.toNumber()
        }
      );

      return distance < 10; // distancia menor que 10km
    });

    return gyms;
  }

  async findById(id: string): Promise<{
    id: string;
    title: string;
    description: string | null;
    phone: string | null;
    latitude: Decimal;
    longitude: Decimal;
  } | null> {
    const gym = this.items.find((item) => item.id === id);

    if (!gym) {
      return null;
    }

    return gym;
  }
}
