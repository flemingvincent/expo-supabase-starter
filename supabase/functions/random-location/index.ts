// Import directly from the URL
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0"
import { getCampusLocations } from "../../constants/campus_locations.ts"

// interface Location {
//   coordinates: {
//     latitude: number;
//     longitude: number;
//   };
//   radius: number;
// }

// const CAMPUS_LOCATIONS = {
//   "Library": {
//     "locations": {
//       "Shannon": {
//         "coordinates": {
//           "latitude": 37.7249,
//           "longitude": -122.4194
//         },
//         "radius": 15
//       },
//       "Clem": {
//         "coordinates": {
//           "latitude": 37.7248,
//           "longitude": -122.4192
//         },
//         "radius": 20
//       }
//     }
//   },
//   "Gym": {
//     "locations": {
//       "North Grounds": {
//         "coordinates": {
//           "latitude": 37.7244,
//           "longitude": -122.4188
//         },
//         "radius": 35
//       },
//       "AFC": {
//         "coordinates": {
//           "latitude": 37.7243,
//           "longitude": -122.4187
//         },
//         "radius": 30
//       }
//     }
//   }
// };

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

console.log("Random Location Function Started!");

Deno.serve(async (req) => {
  try {
    const CAMPUS_LOCATIONS = await getCampusLocations();
    // Get random category
    const categories = Object.keys(CAMPUS_LOCATIONS);
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];

    // Get random location from category
    const locations = CAMPUS_LOCATIONS[randomCategory].locations;
    const locationNames = Object.keys(locations);
    const randomLocationName = locationNames[Math.floor(Math.random() * locationNames.length)];
    const selectedLocation = locations[randomLocationName];

    // Format location data
    const locationData = {
      category: randomCategory,
      name: `${randomLocationName} ${randomCategory}`,
      coordinates: {
        latitude, 
        longitude
      }, 
      radius,
      created_at: new Date().toISOString()
    };

    // Delete existing location(s)
    const { error: deleteError } = await supabase
      .from('current_location')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (deleteError) {
      throw new Error(`Failed to delete existing locations: ${deleteError.message}`);
    }

    // Insert new location
    const { data: insertedLocation, error: insertError } = await supabase
      .from('current_location')
      .insert([locationData])
      .select()
      .single();

    if (insertError) {
      throw new Error(`Failed to insert new location: ${insertError.message}`);
    }

    return new Response(
      JSON.stringify({
        message: 'Location updated successfully',
        data: insertedLocation
      }),
      { 
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        } 
      }
    );
  } catch (error) {
    console.error('Error in random location function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Failed to update location in database'
      }),
      { 
        status: 500,
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        } 
      }
    );
  }
});