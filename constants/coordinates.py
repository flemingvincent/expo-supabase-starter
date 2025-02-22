import requests
from geopy.distance import geodesic

import addresses
import coordinates_and_radius

def get_map_of_coordinates():

     # Get a map of location addresses
    map_of_addresses = addresses.get_map_of_addresses()
    
    # Dictionary to store the updated results
    map_of_coordinates_and_radius = {}

    # Replace the values from addresses to coordinates and radius
    for address, location in map_of_addresses.items():
        result = get_coordinates_and_radius(address)
        if result:  # If the result is not None
            map_of_coordinates_and_radius[address] = result

    # You can return this dictionary or process it further
    return map_of_coordinates_and_radius


def get_coordinates_and_radius(address):

    headers = {
    "User-Agent": "MyGeocodingApp/1.0 (contact@mydomain.com)"
}

    # Nominatim API URL
    url = f'https://nominatim.openstreetmap.org/search?q={address}&format=json&addressdetails=1'


    # Send the request to the Nominatim API
    response = requests.get(url, headers=headers)

    # Attempts to read the data from api
    if response.status_code == 200:
        try:
            data = response.json()
        except ValueError as e:
            print(f"Error parsing JSON: {e}")
            return None
    else:
        print(f"Error: Received status code {response.status_code}")
        return None

    # If a result is found, extract latitude, longitude, and bounding box
    if data:

        # Latitude and longitude
        lat = float(data[0]['lat'])
        lon = float(data[0]['lon'])

        # Bounding box (min_lat, min_lon, max_lat, max_lon)
        min_lat = float(data[0]['boundingbox'][0])
        max_lat = float(data[0]['boundingbox'][1])
        min_lon = float(data[0]['boundingbox'][2])
        max_lon = float(data[0]['boundingbox'][3])

        # Calculate the diagonal distance to estimate the radius
        # We'll use the diagonal of the bounding box as an approximate measure for the radius.
        
        # Get two opposite corners of the bounding box
        point1 = (min_lat, min_lon)
        point2 = (max_lat, max_lon)

        # Calculate the distance between the two corners (diagonal distance)
        distance = geodesic(point1, point2).kilometers

        # Estimated radius as half the diagonal distance (rough estimate)
        radius = distance / 2

        # Creates a dictionary with coordinates and radius
        map_of_coordinates_and_radius = coordinates_and_radius.get_map_of_coordinates_and_radius(lat, lon, radius)
        
        return map_of_coordinates_and_radius
    
    else:

        return None
