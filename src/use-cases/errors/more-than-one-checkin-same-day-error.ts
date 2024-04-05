export class MoreThanOneCheckinOnTheSameDayError extends Error {
  constructor() {
    super('More than one checkin n the same day');
  }
}
