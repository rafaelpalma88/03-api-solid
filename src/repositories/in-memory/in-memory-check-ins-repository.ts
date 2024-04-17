import { CheckIn, Prisma } from '@prisma/client';
import { CheckInsRepository } from '../check-ins-repository';
import { randomUUID } from 'crypto';

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public items: CheckIn[] = [];

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkin = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date()
    };

    this.items.push(checkin);

    return checkin;
  }

  async findById(id: string): Promise<CheckIn | null> {
    const checkin = this.items.find((item) => item.id === id);

    if (!checkin) {
      return null;
    }

    return checkin;
  }

  async countByUserId(userId: string): Promise<number> {
    const checkinsQty = this.items.filter(
      (item) => item.user_id === userId
    ).length;

    return checkinsQty;
  }

  async findByUserIdOnDate(
    userId: string,
    date: Date
  ): Promise<{
    id: string;
    created_at: Date;
    validated_at: Date | null;
    user_id: string;
    gym_id: string;
  } | null> {
    const checkInOnSameDay = this.items.find(
      (item) =>
        item.user_id === userId && item.created_at.getDay() === date.getDay()
    );

    if (!checkInOnSameDay) {
      return null;
    }

    return checkInOnSameDay;
  }

  async findManyByUserId(
    userId: string,
    page: number
  ): Promise<
    {
      id: string;
      created_at: Date;
      validated_at: Date | null;
      user_id: string;
      gym_id: string;
    }[]
  > {
    const checkIns = this.items
      .filter((item) => item.user_id === userId)
      .slice((page - 1) * 20, page * 20);

    return checkIns;
  }

  async save(checkIn: CheckIn): Promise<CheckIn> {
    const checkInIndex = this.items.findIndex((item) => item.id === checkIn.id);

    if (checkInIndex >= 0) {
      this.items[checkInIndex] = checkIn;
    }

    return checkIn;
  }
}
