/** Returns a map of locations for events. */
export function getMapOfAddresses(): { [category: string]: { Locations: { [place: string]: string } } } {
    // Addresses of places at the University of Virginia
    const mapOfAddresses = {
        "Library": {
            "Locations": {
                "Shannon Library": "160 McCormick Rd, Charlottesville, VA 22904",
            }
        },
        "Gym": {
            "Locations": {
                "Memorial Gym": "210 Emmet St S, Charlottesville, VA 22903",
            }
        },
        "Athletic": {
            "Locations": {
                "John Paul Jones Arena": "295 Massie Rd, Charlottesville, VA 22903",
                "Lambeth Field": "University Way, Charlottesville, VA 22904",
            }
        },
        "Academic": {
            "Locations": {
                "The Rotunda": "1826 University Ave, Charlottesville, VA 22904",
                "Rice Hall": "85 Engineer's Way, Charlottesville, VA 22903",
            }
        },
        "Dining": {
            "Locations": {
                "Observatory Hill Dining Hall": "525 McCormick Rd, Charlottesville, VA 22904",
            }
        }
    };

    return mapOfAddresses;
}
