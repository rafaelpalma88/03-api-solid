interface Coordinate {
  latitude: number;
  longitude: number;
}

export function calculateDistance(from: Coordinate, to: Coordinate): number {
  const R = 6371; // average radius of the Earth in kilometers
  const dLat = (to.latitude - from.latitude) * (Math.PI / 180);
  const dLon = (to.longitude - from.longitude) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(from.latitude * (Math.PI / 180)) *
      Math.cos(to.latitude * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c * 1000; // convert to meters
  return distance;
}
