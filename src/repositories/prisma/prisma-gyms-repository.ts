import { Gym, Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { FindManyNearbyParams, GymsRepository } from '../gyms-repository';
import { prisma } from '@/lib/prisma';

export class PrismaGymsRepository implements GymsRepository {
  async create(data: Prisma.GymCreateInput): Promise<{
    id: string;
    title: string;
    description: string | null;
    phone: string | null;
    latitude: Decimal;
    longitude: Decimal;
  }> {
    const gym = await prisma.gym.create({ data });

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
    const gyms = await prisma.gym.findMany({
      where: {
        title: {
          contains: query
        }
      },
      take: 20,
      skip: (page - 1) * 20
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
    const gym = await prisma.gym.findUnique({
      where: {
        id: id
      }
    });

    return gym;
  }

  async searchNearby({
    latitude,
    longitude
  }: FindManyNearbyParams): Promise<Gym[]> {
    const gyms = await prisma.$queryRaw<Gym[]>`
      SELECT * from gyms
      WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
    `;

    return gyms;
  }
}
