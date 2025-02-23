import * as coordinates from './coordinates';

// Assuming getMapOfCoordinates is a function that returns an object
const map = coordinates.getMapOfCoordinates();

for (const [key, value] of Object.entries(map)) {
    console.log(key, value);
}
