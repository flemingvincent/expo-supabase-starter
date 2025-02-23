/** Returns a map of coordinates and radius. */
export function getMapOfCoordinatesAndRadius(lat: number, lon: number, radius: number): { coordinates: { latitude: number, longitude: number }, radius: number } {
    // Coordinates and radius of specified place at the University of Virginia
    const mapOfCoordinatesAndRadius = {
        "coordinates": {
            "latitude": lat,
            "longitude": lon,
        },
        "radius": radius,
    };

    return mapOfCoordinatesAndRadius;
}
export function getMapOfCoordinates() {
    throw new Error('Function not implemented.');
}

