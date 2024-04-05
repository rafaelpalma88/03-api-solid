interface CalculateDistanceProps {
  lat1: number;
  lon1: number;
  lat2: number;
  lon2: number;
}

export function calculateDistance({
  lat1,
  lon1,
  lat2,
  lon2
}: CalculateDistanceProps): number {
  const R = 6371; // average radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c * 1000; // convert to meters
  return distance;
}
