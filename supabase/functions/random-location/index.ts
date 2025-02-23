// supabase/functions/random-location/index.ts
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0"
import LOCATIONS from './locations.json' assert { type: "json" };

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

console.log("Random Location Function Started!");

Deno.serve(async (req) => {
  try {
    // Get random category
    const categories = Object.keys(LOCATIONS);
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];

    // Get random location from category
    const locations = LOCATIONS[randomCategory].Locations; // Note: "Locations" with capital L
    const locationNames = Object.keys(locations);
    const randomLocationName = locationNames[Math.floor(Math.random() * locationNames.length)];
    const locationString = locations[randomLocationName];

    // Parse the location string
    const [latStr, lonStr, radiusStr] = locationString.split(', ');
    const latitude = parseFloat(latStr);
    const longitude = parseFloat(lonStr);
    const radius = parseFloat(radiusStr.split(': ')[1]) * 1000; // Convert to meters

    // Format location data
    const locationData = {
      category: randomCategory,
      name: randomLocationName,
      coordinates: {
        latitude,
        longitude
      },
      radius: Math.round(radius), // Round to nearest meter
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