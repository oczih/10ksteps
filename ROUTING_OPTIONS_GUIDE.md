# Routing Options Guide

This guide explains the two routing modes available in your walking route application and how they affect step counting accuracy.

## Two Routing Modes

### 1. Exact Waypoints (AI Path) - **Recommended for AI Routes**
- **Default Setting**: ✅ Enabled by default
- **Behavior**: Follows the exact path suggested by Gemini AI
- **Step Count**: More accurate for AI-suggested routes
- **Use Case**: When you want to follow the specific path that AI recommends

### 2. Optimized Route (Shortest Path)
- **Default Setting**: ❌ Disabled by default  
- **Behavior**: Uses Mapbox's shortest/fastest route between points
- **Step Count**: May be shorter than AI suggestions
- **Use Case**: When you want the most efficient route regardless of AI suggestions

## How to Switch Between Modes

1. **Toggle Switch**: Use the "Exact Waypoints" toggle in the RouteMap interface
2. **Visual Indicator**: The badge shows "AI Path" or "Optimized" 
3. **Auto-Recalculate**: Routes automatically recalculate when you switch modes
4. **Notification**: You'll see a confirmation when the route recalculates

## When to Use Each Mode

### Use "Exact Waypoints" When:
- ✅ You asked Gemini for a specific scenic route
- ✅ You want to follow the exact path the AI suggested
- ✅ You're doing a guided tour or sightseeing walk
- ✅ You want accurate step counting for the AI's route
- ✅ The AI mentioned specific streets, landmarks, or areas to visit

**Example**: "Give me a scenic walking route in Helsinki through the historic district"

### Use "Optimized Route" When:
- ✅ You just want to get from point A to point B efficiently
- ✅ You don't care about the specific path, just the destination
- ✅ You want the shortest possible route
- ✅ You're in a hurry and need the fastest path

**Example**: "What's the quickest way to walk from the train station to the hotel?"

## Step Count Accuracy

### Exact Waypoints Mode:
- **More Accurate**: Step count matches the AI's suggested path
- **Longer Routes**: May include scenic detours and specific waypoints
- **Realistic**: Reflects the actual walking experience the AI intended

### Optimized Route Mode:
- **Shorter Distance**: Usually the most direct path
- **Faster Time**: Optimized for speed, not experience
- **May Miss**: Could skip scenic areas the AI wanted you to see

## Example Comparison

**AI Request**: "Give me a walking route in Helsinki from Senate Square to Market Square via the waterfront"

### Exact Waypoints Result:
- Distance: ~1.2 km
- Steps: ~1,575 steps
- Path: Senate Square → Aleksanterinkatu → Pohjoisesplanadi → Market Square
- Experience: Scenic waterfront walk as intended

### Optimized Route Result:
- Distance: ~0.8 km  
- Steps: ~1,050 steps
- Path: Direct route via Aleksanterinkatu
- Experience: Fastest route, misses waterfront

## Technical Details

### How Exact Waypoints Works:
1. Takes each coordinate from Gemini's response
2. Creates route segments between consecutive waypoints
3. Uses Mapbox directions for each segment
4. Sums up all segment distances for total
5. Provides accurate step count for the intended path

### How Optimized Route Works:
1. Takes all waypoints from Gemini's response
2. Sends all points to Mapbox directions API
3. Mapbox finds the shortest path through all points
4. May reorder or skip waypoints for efficiency
5. Provides step count for the optimized path

## Tips for Best Results

### For Accurate Step Counting:
1. **Use Exact Waypoints** for AI-suggested routes
2. **Ask AI for specific paths** rather than just destinations
3. **Include waypoints** in your AI requests
4. **Verify the route** matches what you expected

### For Efficient Routes:
1. **Use Optimized Route** for quick trips
2. **Ask AI for direct routes** between two points
3. **Focus on destinations** rather than the journey

## Troubleshooting

### Route Looks Wrong:
- Check which routing mode is active
- Try switching between modes to see the difference
- Verify the coordinates from AI are correct

### Step Count Seems Off:
- Ensure you're using the right mode for your needs
- Check if the AI provided enough waypoints
- Consider the walking speed assumptions (1.4 m/s)

### Route Won't Calculate:
- Make sure you have at least 2 coordinates
- Check your internet connection (Mapbox API required)
- Try refreshing the page

## Advanced Usage

### Combining Both Approaches:
1. Get a scenic route from AI with Exact Waypoints
2. Switch to Optimized Route to see the difference
3. Choose the mode that best fits your needs

### Custom Routes:
- Add manual waypoints by clicking on the map
- Mix AI coordinates with your own points
- The routing mode applies to all waypoints

This dual-mode system gives you the flexibility to choose between following the AI's intended experience or getting the most efficient route, ensuring accurate step counting for your preferred approach! 