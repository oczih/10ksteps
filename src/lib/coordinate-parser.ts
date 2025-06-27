export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface ParsedCoordinates {
  coordinates: Coordinate[];
  rawText: string;
  hasCoordinates: boolean;
}

/**
 * Scans a Gemini response for coordinate patterns
 * Supports various formats:
 * - [lat,long] or [lat, long]
 * - (lat,long) or (lat, long)
 * - lat,long or lat, long
 * - Decimal degrees format
 */
export function scanForCoordinates(text: string): ParsedCoordinates {
  const coordinates: Coordinate[] = [];
  
  // Regex patterns for different coordinate formats
  const patterns = [
    // [lat,long] or [lat, long] format - most reliable
    /\[(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)\]/g,
    // (lat,long) or (lat, long) format
    /\((-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)\)/g,
    // Decimal degrees with N/S/E/W indicators
    /(-?\d+\.?\d*)\s*[NSns]\s*,?\s*(-?\d+\.?\d*)\s*[EWew]/g,
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const lat = parseFloat(match[1]);
      const lng = parseFloat(match[2]);
      
      // Enhanced validation - more strict checks
      if (isValidCoordinate(lat, lng)) {
        coordinates.push({
          latitude: lat,
          longitude: lng
        });
      }
    }
  }

  // Remove duplicates based on coordinate values
  const uniqueCoordinates = coordinates.filter((coord, index, self) => 
    index === self.findIndex(c => 
      Math.abs(c.latitude - coord.latitude) < 0.0001 && 
      Math.abs(c.longitude - coord.longitude) < 0.0001
    )
  );

  return {
    coordinates: uniqueCoordinates,
    rawText: text,
    hasCoordinates: uniqueCoordinates.length > 0
  };
}

/**
 * Enhanced coordinate validation function
 */
function isValidCoordinate(lat: number, lng: number): boolean {
  // Basic range validation
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return false;
  }

  // Check for common false positives
  const latStr = lat.toString();
  const lngStr = lng.toString();
  
  // Reject coordinates that look like common numbers in text
  // Avoid numbers like 10,000, 1,000, etc.
  if (latStr.includes('000') && latStr.length <= 6) {
    return false;
  }
  if (lngStr.includes('000') && lngStr.length <= 6) {
    return false;
  }

  // Reject coordinates that are too round (likely false positives)
  // Most real coordinates have more decimal places
  const latDecimalPlaces = latStr.includes('.') ? latStr.split('.')[1].length : 0;
  const lngDecimalPlaces = lngStr.includes('.') ? lngStr.split('.')[1].length : 0;
  
  // If both coordinates have very few decimal places and are round numbers, be suspicious
  if (latDecimalPlaces <= 1 && lngDecimalPlaces <= 1) {
    // Only accept if they're clearly in valid coordinate ranges for major cities
    const isLikelyValid = (
      (lat >= 35 && lat <= 70) && // Most populated areas are in this range
      (lng >= -180 && lng <= 180) &&
      !Number.isInteger(lat) && !Number.isInteger(lng) // Reject integers
    );
    if (!isLikelyValid) {
      return false;
    }
  }

  return true;
}

/**
 * Extracts coordinates and returns them in a format suitable for mapping
 */
export function extractCoordinatesForMap(text: string): Coordinate[] {
  const result = scanForCoordinates(text);
  return result.coordinates;
}

/**
 * Validates if a string contains valid coordinate patterns
 */
export function hasValidCoordinates(text: string): boolean {
  return scanForCoordinates(text).hasCoordinates;
}

/**
 * Formats coordinates for display
 */
export function formatCoordinates(coordinates: Coordinate[]): string {
  return coordinates
    .map(coord => `[${coord.latitude}, ${coord.longitude}]`)
    .join(', ');
}

/**
 * Extracts coordinates and returns them as a GeoJSON FeatureCollection
 * Useful for mapping libraries that expect GeoJSON format
 */
export function extractCoordinatesAsGeoJSON(text: string) {
  const coordinates = extractCoordinatesForMap(text);
  
  return {
    type: "FeatureCollection",
    features: coordinates.map((coord, index) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [coord.longitude, coord.latitude] // GeoJSON uses [lng, lat] order
      },
      properties: {
        id: index,
        name: `Point ${index + 1}`,
        latitude: coord.latitude,
        longitude: coord.longitude
      }
    }))
  };
}

/**
 * Extracts coordinates and returns them as a simple array of [lng, lat] pairs
 * Useful for mapping libraries like Leaflet
 */
export function extractCoordinatesAsLngLat(text: string): [number, number][] {
  const coordinates = extractCoordinatesForMap(text);
  return coordinates.map(coord => [coord.longitude, coord.latitude]);
}

/**
 * Extracts coordinates and returns them as a simple array of [lat, lng] pairs
 * Useful for mapping libraries like Google Maps
 */
export function extractCoordinatesAsLatLng(text: string): [number, number][] {
  const coordinates = extractCoordinatesForMap(text);
  return coordinates.map(coord => [coord.latitude, coord.longitude]);
}

/**
 * Test function to validate coordinate parsing against edge cases
 * This can be used for debugging and testing
 */
export function testCoordinateParsing(): void {
  const testCases = [
    {
      text: "Here is a wonderful walk around Helsinki that will take you through many of its iconic sights, covering approximately 8 kilometers (around 10,000 steps). [60.1691, 24.9522], [60.1669, 24.9525], [60.1678, 24.9590]",
      expectedCount: 3,
      description: "Helsinki route with 10,000 steps text"
    },
    {
      text: "Walk 10,000 steps from [60.1691, 24.9522] to [60.1669, 24.9525]",
      expectedCount: 2,
      description: "Text with 10,000 steps but valid coordinates"
    },
    {
      text: "This route is 10,000 meters long and goes through 1,000 different places",
      expectedCount: 0,
      description: "Text with numbers that could be mistaken for coordinates"
    },
    {
      text: "Coordinates: [60.1691, 24.9522], [60.1669, 24.9525], [60.1678, 24.9590]",
      expectedCount: 3,
      description: "Clean coordinate list"
    },
    {
      text: "Visit these locations: (40.7128, -74.0060) and (40.7589, -73.9851)",
      expectedCount: 2,
      description: "Parenthesis format coordinates"
    }
  ];

  console.log("🧪 Testing coordinate parsing...");
  
  testCases.forEach((testCase, index) => {
    const result = scanForCoordinates(testCase.text);
    const passed = result.coordinates.length === testCase.expectedCount;
    
    console.log(`Test ${index + 1}: ${passed ? '✅' : '❌'} ${testCase.description}`);
    console.log(`  Expected: ${testCase.expectedCount}, Got: ${result.coordinates.length}`);
    if (result.coordinates.length > 0) {
      console.log(`  Found: ${formatCoordinates(result.coordinates)}`);
    }
    console.log('');
  });
} 