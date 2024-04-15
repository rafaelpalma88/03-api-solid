export class LatitudeLongitudeNotFoundError extends Error {
  constructor() {
    super('Latitude/Longitude not found');
  }
}
