import { getMapOfCoordinates } from './coordinates';

export async function getCampusLocations() {
  const locationData = await getMapOfCoordinates();
  return locationData;
}