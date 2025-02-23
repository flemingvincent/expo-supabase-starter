import axios from 'axios';
import * as addresses from './addresses';
import * as coordinatesAndRadius from './coordinates_and_radius';
import { getDistance } from 'geolib';

interface NominatimResponse {
    lat: string;
    lon: string;
    boundingbox: string[];
}

interface CoordinatesAndRadius {
    coordinates: {
        latitude: number;
        longitude: number;
    };
    radius: number;
}

// Define the type for specificPlace: { [key: string]: string }
interface SpecificPlace {
    [key: string]: string; // Address of the place as a string
}

/** Returns a map of place categories, locations, and the location's coordinates. */
export async function getMapOfCoordinates(): Promise<any> {
    const mapOfAddresses = await addresses.getMapOfAddresses(); // Await this call if it's async

    // Use Promise.all to handle async updates concurrently
    const updates = Object.values(mapOfAddresses).map(async (locations: any) => {
        for (const specificPlace of Object.values(locations)) {
            // Cast `specificPlace` to the correct type (SpecificPlace)
            const specificPlaceTyped = specificPlace as SpecificPlace;
            for (const [place, address] of Object.entries(specificPlaceTyped)) {
                const result = await getCoordinatesAndRadius(address);
                if (result) {
                    // Type assertion ensures 'specificPlace' value is a string
                    specificPlaceTyped[place] = `${result.coordinates.latitude}, ${result.coordinates.longitude}, radius: ${result.radius}`;
                }
            }
        }
    });

    // Wait for all the updates to complete
    await Promise.all(updates);

    return mapOfAddresses;
}

/** Calculates the coordinates and returns a map including them. */
async function getCoordinatesAndRadius(address: string): Promise<CoordinatesAndRadius | null> {
    const headers = {
        'User-Agent': 'MyGeocodingApp/1.0 (contact@mydomain.com)',
    };

    const url = `https://nominatim.openstreetmap.org/search?q=${address}&format=json&addressdetails=1`;

    try {
        const response = await axios.get<NominatimResponse[]>(url, { headers });

        if (response.status === 200 && response.data.length > 0) {
            const data = response.data[0];
            const lat = parseFloat(data.lat);
            const lon = parseFloat(data.lon);

            const [minLat, maxLat, minLon, maxLon] = data.boundingbox.map((item: string) => parseFloat(item));

            // Calculate the diagonal distance to estimate the radius
            const point1 = { latitude: minLat, longitude: minLon };
            const point2 = { latitude: maxLat, longitude: maxLon };
            const distance = getDistance(point1, point2) / 1000; // convert to kilometers
            const radius = distance / 2;

            return coordinatesAndRadius.getMapOfCoordinatesAndRadius(lat, lon, radius);
        }
    } catch (error) {
        console.error(`Error fetching data: ${error}`);
    }

    return null;
}
