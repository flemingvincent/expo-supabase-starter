// constants/generate-locations.ts
import { getMapOfCoordinates } from './coordinates';
import * as fs from 'fs';
import * as path from 'path';

async function generateLocationsJson() {
  try {
    console.log('Starting coordinates generation...');
    
    const locations = await getMapOfCoordinates();
    console.log('Locations data:', locations); // Debug log
    
    // Create the directory if it doesn't exist
    const dirPath = path.join(process.cwd(), 'supabase', 'functions', 'random-location');
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    
    // Define file path
    const filePath = path.join(dirPath, 'locations.json');
    
    // Write to JSON file
    fs.writeFileSync(
      filePath,
      JSON.stringify(locations, null, 2)
    );
    
    console.log(`JSON file created at: ${filePath}`);
    console.log('Content written:', JSON.stringify(locations, null, 2));
  } catch (error) {
    console.error('Error generating locations:', error);
  }
}

// Run the function
generateLocationsJson();