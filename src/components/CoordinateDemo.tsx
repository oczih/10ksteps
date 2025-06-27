'use client';

import { useState } from 'react';
import { 
  scanForCoordinates, 
  extractCoordinatesForMap, 
  hasValidCoordinates,
  formatCoordinates,
  extractCoordinatesAsGeoJSON,
  extractCoordinatesAsLngLat,
  extractCoordinatesAsLatLng,
  testCoordinateParsing
} from '@/lib/coordinate-parser';

export default function CoordinateDemo() {
  const [inputText, setInputText] = useState('');
  const [results, setResults] = useState<{
    scanResult: any;
    mapCoords: any;
    hasCoords: boolean;
    formatted: string;
    geoJSON: any;
    lngLat: any;
    latLng: any;
  } | null>(null);

  const testTexts = [
    "Here's a walking route in Helsinki: [60.1699, 24.9384], [60.1732, 24.9415], [60.1755, 24.9452]",
    "Visit these locations: (40.7128, -74.0060) and (40.7589, -73.9851)",
    "Coordinates: 51.5074, -0.1278 and 51.5007, -0.1246",
    "No coordinates in this text",
    "Mixed format: [60.1699, 24.9384] and (40.7128, -74.0060)",
    "Here is a wonderful walk around Helsinki that will take you through many of its iconic sights, covering approximately 8 kilometers (around 10,000 steps). [60.1691, 24.9522], [60.1669, 24.9525], [60.1678, 24.9590]"
  ];

  const useTestText = (text: string) => {
    setInputText(text);
  };

  const analyzeText = () => {
    if (!inputText.trim()) return;

    const scanResult = scanForCoordinates(inputText);
    const mapCoords = extractCoordinatesForMap(inputText);
    const hasCoords = hasValidCoordinates(inputText);
    const formatted = formatCoordinates(mapCoords);
    const geoJSON = extractCoordinatesAsGeoJSON(inputText);
    const lngLat = extractCoordinatesAsLngLat(inputText);
    const latLng = extractCoordinatesAsLatLng(inputText);

    setResults({
      scanResult,
      mapCoords,
      hasCoords,
      formatted,
      geoJSON,
      lngLat,
      latLng
    });
  };

  const runTests = () => {
    console.log('Running coordinate parsing tests...');
    testCoordinateParsing();
    alert('Tests completed! Check the browser console for results.');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-8">Coordinate Parser Demo</h1>
      
      {/* Test Examples */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-3">Test Examples:</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {testTexts.map((text, index) => (
            <button
              key={index}
              onClick={() => useTestText(text)}
              className="text-left p-2 bg-white border rounded hover:bg-blue-50 transition-colors"
            >
              <span className="text-sm text-gray-600">Example {index + 1}:</span>
              <div className="text-xs font-mono">{text.substring(0, 60)}...</div>
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Enter text with coordinates:</label>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="w-full h-32 p-3 border rounded-lg resize-none"
          placeholder="Paste text containing coordinates here..."
        />
        <button
          onClick={analyzeText}
          disabled={!inputText.trim()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
        >
          Analyze Coordinates
        </button>
        
        <button
          onClick={runTests}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          🧪 Run Tests
        </button>
      </div>

      {/* Results */}
      {results && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Results:</h2>
          
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-3 rounded border">
              <h3 className="font-semibold text-green-800">Has Coordinates</h3>
              <p className="text-green-700">{results.hasCoords ? '✅ Yes' : '❌ No'}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded border">
              <h3 className="font-semibold text-blue-800">Count</h3>
              <p className="text-blue-700">{results.scanResult.coordinates.length}</p>
            </div>
            <div className="bg-purple-50 p-3 rounded border">
              <h3 className="font-semibold text-purple-800">Formatted</h3>
              <p className="text-purple-700 text-sm font-mono">{results.formatted || 'None'}</p>
            </div>
          </div>

          {/* Detailed Results */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Raw Coordinates */}
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-semibold mb-2">Raw Coordinates:</h3>
              <pre className="text-xs bg-white p-2 rounded overflow-auto">
                {JSON.stringify(results.mapCoords, null, 2)}
              </pre>
            </div>

            {/* GeoJSON */}
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-semibold mb-2">GeoJSON Format:</h3>
              <pre className="text-xs bg-white p-2 rounded overflow-auto">
                {JSON.stringify(results.geoJSON, null, 2)}
              </pre>
            </div>

            {/* LngLat Array */}
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-semibold mb-2">[Lng, Lat] Array (Leaflet):</h3>
              <pre className="text-xs bg-white p-2 rounded overflow-auto">
                {JSON.stringify(results.lngLat, null, 2)}
              </pre>
            </div>

            {/* LatLng Array */}
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-semibold mb-2">[Lat, Lng] Array (Google Maps):</h3>
              <pre className="text-xs bg-white p-2 rounded overflow-auto">
                {JSON.stringify(results.latLng, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 