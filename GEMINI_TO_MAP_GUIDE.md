# Gemini AI to RouteMap Integration Guide

This guide explains how to use the new feature that allows you to send coordinates from Gemini AI responses directly to your RouteMap.

## How It Works

1. **Ask Gemini for a route** - Use the AI chat to ask for walking routes in any city
2. **Coordinates are detected** - The system automatically scans Gemini responses for coordinates
3. **Send to map** - Click the "🗺️ Send to Map" button to transfer coordinates to the RouteMap
4. **Route is displayed** - The coordinates appear on the map with walking directions

## Step-by-Step Usage

### 1. Open the AI Chat
- Click the chat bubble icon in the bottom-right corner of your screen
- The AI assistant will open

### 2. Ask for a Walking Route
Example prompts:
- "Give me a walking route in Helsinki from Senate Square to Market Square"
- "Create a scenic walking route in Paris around the Eiffel Tower"
- "Suggest a walking route in New York through Central Park"

### 3. Check for Coordinates
- After Gemini responds, look for a green box below the response
- It will show: "📍 Found X coordinate(s):" followed by the coordinates
- If coordinates are found, you'll see a "🗺️ Send to Map" button

### 4. Send to RouteMap
- Click the "🗺️ Send to Map" button
- The button will briefly show "🔄 Sending..." 
- You'll see a success notification: "🗺️ Added X coordinates from AI to map!"

### 5. View on RouteMap
- Navigate to the RouteMap page
- The coordinates will automatically appear as markers on the map
- The route will be calculated and displayed with walking directions
- You'll see stats like distance, time, steps, and calories

## Supported Coordinate Formats

The system automatically detects coordinates in these formats:
- `[60.1699, 24.9384]` - Bracket format
- `(40.7128, -74.0060)` - Parenthesis format  
- `51.5074, -0.1278` - Standalone format
- `60.1699 N, 24.9384 E` - Cardinal directions

## Tips for Better Results

### Ask Specific Questions
- **Good**: "Give me a walking route from Helsinki Central Station to Senate Square with 3 waypoints"
- **Better**: "Create a 2km walking route in Helsinki starting from Senate Square, passing by Market Square and ending at the Helsinki Cathedral"

### Request Multiple Waypoints
- Ask for routes with multiple stops for more interesting paths
- Example: "Give me a walking route in Paris: Eiffel Tower → Champs-Élysées → Arc de Triomphe → Louvre"

### Specify Route Preferences
- "Give me a scenic walking route along the waterfront"
- "Create a walking route through the historic district"
- "Suggest a walking route with cafes and restaurants along the way"

## Troubleshooting

### No Coordinates Found
- Make sure you're asking for walking routes in specific cities
- Try rephrasing your question to be more specific about locations
- Check that Gemini is responding with actual coordinate data

### Coordinates Not Appearing on Map
- Ensure you're on the RouteMap page
- Check that the "🗺️ Send to Map" button was clicked successfully
- Look for the success notification

### Route Not Calculating
- Make sure you have at least 2 coordinates for a route
- Check your internet connection (Mapbox API is required)
- Try refreshing the page if the map doesn't update

## Example Conversation

**You**: "Give me a walking route in Helsinki from Senate Square to Market Square"

**Gemini**: "Here's a great walking route in Helsinki! Start at Senate Square [60.1699, 24.9384], walk down Aleksanterinkatu, then turn right onto Pohjoisesplanadi, and you'll reach Market Square [60.1675, 24.9525]. This route takes you through the heart of Helsinki's historic center."

**System**: Shows green box with coordinates and "🗺️ Send to Map" button

**You**: Click "🗺️ Send to Map"

**Result**: Coordinates appear on RouteMap with walking directions, distance, and time calculations

## Advanced Features

### Save Routes
- After sending coordinates to the map, you can save the route
- Click "Save Route" to store it for future use
- Saved routes appear in the dropdown menu

### Combine Manual and AI Points
- You can add manual points by clicking on the map
- Mix AI-generated coordinates with your own waypoints
- The system will calculate the optimal route through all points

### Multiple Routes
- Send multiple sets of coordinates from different AI conversations
- Each set will replace the previous one on the map
- Use the "Clear Map" button to start fresh

This integration makes it easy to get AI-suggested walking routes and visualize them immediately on your interactive map! 