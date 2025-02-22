"""Returns a map of coordinates and radius."""
def get_map_of_coordinates_and_radius(lat, lon, radius):
    
    #Coordinates and radius of specified place at the University of Virgina
    map_of_coordinates_and_radius = {
        "coordinates" : {
            "lattitude" : lat,
            "longitude" : lon,
        },
        "radius" : radius,
    }

    return map_of_coordinates_and_radius