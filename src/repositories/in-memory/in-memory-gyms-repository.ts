import { Gym } from '@prisma/client';
import { GymsRepository } from '../gyms-repository';
import { Decimal } from '@prisma/client/runtime/library';

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = [];
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
