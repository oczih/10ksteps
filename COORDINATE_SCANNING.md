# Coordinate Scanning for Gemini Responses

This guide explains how to scan Gemini AI responses for coordinate data and extract them for use in mapping applications.

## Overview

The coordinate scanning system automatically detects latitude and longitude coordinates from Gemini AI responses and provides them in various formats suitable for different mapping libraries.

## Features

- **Multiple Format Support**: Detects coordinates in various formats:
  - `[lat,long]` or `[lat, long]`
  - `(lat,long)` or `(lat, long)`
  - `lat,long` or `lat, long` (standalone)
  - Decimal degrees with N/S/E/W indicators
- **Validation**: Ensures coordinates are within valid ranges (lat: -90 to 90, lng: -180 to 180)
- **Duplicate Removal**: Automatically removes duplicate coordinates
- **Multiple Output Formats**: Provides coordinates in formats suitable for different mapping libraries

## Usage

### Basic Coordinate Scanning

```typescript
import { scanForCoordinates } from '@/lib/coordinate-parser';

const geminiResponse = "Here's a walking route: [60.1699, 24.9384], [60.1732, 24.9415]";
const result = scanForCoordinates(geminiResponse);

console.log(result.hasCoordinates); // true
console.log(result.coordinates); // Array of Coordinate objects
```

### Available Functions

#### `scanForCoordinates(text: string): ParsedCoordinates`
Main function that scans text and returns detailed results.

```typescript
const result = scanForCoordinates(text);
// Returns: { coordinates: Coordinate[], rawText: string, hasCoordinates: boolean }
```

#### `extractCoordinatesForMap(text: string): Coordinate[]`
Extracts coordinates as an array of Coordinate objects.

```typescript
const coords = extractCoordinatesForMap(text);
// Returns: [{ latitude: 60.1699, longitude: 24.9384 }, ...]
```

#### `hasValidCoordinates(text: string): boolean`
Quick check if text contains valid coordinates.

```typescript
const hasCoords = hasValidCoordinates(text);
// Returns: true/false
```

#### `formatCoordinates(coordinates: Coordinate[]): string`
Formats coordinates for display.

```typescript
const formatted = formatCoordinates(coords);
// Returns: "[60.1699, 24.9384], [60.1732, 24.9415]"
```

### Mapping Library Integration

#### For Leaflet Maps
```typescript
import { extractCoordinatesAsLngLat } from '@/lib/coordinate-parser';

const lngLatCoords = extractCoordinatesAsLngLat(geminiResponse);
// Returns: [[24.9384, 60.1699], [24.9415, 60.1732]] (Leaflet uses [lng, lat])
```

#### For Google Maps
```typescript
import { extractCoordinatesAsLatLng } from '@/lib/coordinate-parser';

const latLngCoords = extractCoordinatesAsLatLng(geminiResponse);
// Returns: [[60.1699, 24.9384], [60.1732, 24.9415]] (Google Maps uses [lat, lng])
```

#### For GeoJSON
```typescript
import { extractCoordinatesAsGeoJSON } from '@/lib/coordinate-parser';

const geoJSON = extractCoordinatesAsGeoJSON(geminiResponse);
// Returns: GeoJSON FeatureCollection
```

## Integration with Gemini Chat

The `GeminiChat` component automatically scans for coordinates in AI responses and displays them in a green box below the response text.

### Example Response Display
```
📍 Found 3 coordinate(s):
[60.1699, 24.9384], [60.1732, 24.9415], [60.1755, 24.9452]
```

## Coordinate Formats Supported

The parser recognizes these coordinate formats:

1. **Bracket format**: `[60.1699, 24.9384]`
2. **Parenthesis format**: `(40.7128, -74.0060)`
3. **Standalone format**: `51.5074, -0.1278`
4. **Cardinal directions**: `60.1699 N, 24.9384 E`

## Validation Rules

- Latitude must be between -90 and 90 degrees
- Longitude must be between -180 and 180 degrees
- Duplicate coordinates (within 0.0001 degree tolerance) are automatically removed
- Invalid coordinates are filtered out
- **Enhanced validation** prevents false positives like "10,000" from being detected as coordinates
- Coordinates with too few decimal places are validated more strictly to avoid common text numbers

## Demo Component

Use the `CoordinateDemo` component to test coordinate parsing:

```typescript
import CoordinateDemo from '@/components/CoordinateDemo';

// In your page or component
<CoordinateDemo />
```

This provides an interactive interface to test different coordinate formats and see the results in various output formats.

## Error Handling

The coordinate parser is designed to be robust:
- Invalid coordinates are silently filtered out
- Empty or malformed text returns empty results
- No exceptions are thrown for parsing errors

## Performance

The coordinate parser uses efficient regex patterns and is designed for real-time use in chat applications. It can handle responses of any length without performance issues. 