import { Gym, Prisma } from '@prisma/client';
import { GymsRepository } from '../gyms-repository';
import { Decimal } from '@prisma/client/runtime/library';
import { randomUUID } from 'crypto';

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

  async findById(id: string): Promise<{
    id: string;
    title: string;
    description: string | null;
    phone: string | null;
    latitude: Decimal;
    longitude: Decimal;
  } | null> {
    const user = this.items.find((item) => item.id === id);

    if (!user) {
      return null;
    }

    return user;
  }
}
