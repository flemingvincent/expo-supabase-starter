import random
import json

# Campus locations dictionary with simplified structure
CAMPUS_LOCATIONS = {
    "Library": {
        "locations": {
            "Shannon": {
                "coordinates": {
                    "latitude": 37.7249,
                    "longitude": -122.4194
                },
                "radius": 15
            },
            "Clem": {
                "coordinates": {
                    "latitude": 37.7248,
                    "longitude": -122.4192
                },
                "radius": 20
            }
        }
    },
    "Gym": {
        "locations": {
            "North Grounds": {
                "coordinates": {
                    "latitude": 37.7244,
                    "longitude": -122.4188
                },
                "radius": 35
            },
            "AFC": {
                "coordinates": {
                    "latitude": 37.7243,
                    "longitude": -122.4187
                },
                "radius": 30
            }
        }
    }
}

class LocationRandomizer:
    """
    A class that handles random selection of locations while ensuring consecutive
    picks are from different categories.
    """
    def __init__(self, locations):
        """
        Initialize the randomizer with a locations dictionary.
        
        Args:
            locations (dict): Dictionary containing categories of locations
        """
        self.locations = locations
        self.last_category = None

    def get_random_location(self):
        """
        Selects a random location while avoiding the same category twice in a row.
        
        Returns:
            dict: A formatted location dictionary containing category, name, coordinates, and radius
        """
        # Get available categories (excluding last picked)
        available_categories = [cat for cat in self.locations.keys() 
                              if cat != self.last_category]
        
        # Pick random category
        selected_category = random.choice(available_categories)
        self.last_category = selected_category
        
        # Get random location from selected category
        category_locations = self.locations[selected_category]["locations"]
        location_name = random.choice(list(category_locations.keys()))
        selected_location = category_locations[location_name]
        
        # Format and return location data
        return {
            "category": selected_category,
            "name": f"{location_name} {selected_category}",
            "coordinates": selected_location["coordinates"],
            "radius": selected_location["radius"]
        }

def test_randomization():
    """Test the randomization with several picks"""
    randomizer = LocationRandomizer(CAMPUS_LOCATIONS)
    
    print("Testing Random Location Picks:")
    print("-----------------------------")
    
    for i in range(5):
        location = randomizer.get_random_location()
        print(f"\nPick {i + 1}:")
        print(f"Category: {location['category']}")
        print(f"Location: {location['name']}")
        print(f"Coordinates: {location['coordinates']}")
        print(f"Radius: {location['radius']} meters")
        print("\nJSON data:")
        print(json.dumps(location, indent=2))

if __name__ == "__main__":
    test_randomization()