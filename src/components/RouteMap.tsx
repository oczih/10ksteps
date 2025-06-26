'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import routeservice from '@/app/services/routeservice';
import { useUser } from '@/app/context/UserContext';
export default function RouteMap() {
  const { user, setUser } = useUser();
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [coordinates, setCoordinates] = useState<[number, number][]>([]);
  const [steps, setSteps] = useState<number>(0);
  const [time, setTime] = useState<number>(0);
  const [distance, setDistance] = useState<number>(0);
  const [calories, setCalories] = useState<number>(0);
  const [pace, setPace] = useState<number>(user?.pace || 0);
  // Set your token
  mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY || '';

  // Initialize map only once
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [24.941, 60.173], // default center
      zoom: 14,
    });

    map.addControl(new mapboxgl.NavigationControl());
    mapRef.current = map;

    map.on('click', (e) => {
      e.preventDefault();
      const newCoord: [number, number] = [e.lngLat.lng, e.lngLat.lat];
      setCoordinates((prev) => [...prev, newCoord]);
      
      const marker = new mapboxgl.Marker({ color: 'red' })
        .setLngLat(newCoord)
        .addTo(map);
      
      markersRef.current.push(marker);
    });

    return () => {
      // Clean up markers and map on unmount
      markersRef.current.forEach(marker => marker.remove());
      map.remove();
    };
  }, []); // Empty dependency array - only run once

  // Handle route updates separately
  useEffect(() => {
    if (coordinates.length >= 2) {
      updateRoute(coordinates);
    }
  }, [coordinates]);

  const updateRoute = async (points: [number, number][]) => {
    if (points.length < 2) return;

    const coordsString = points.map((coord) => coord.join(',')).join(';');
    const url = `https://api.mapbox.com/directions/v5/mapbox/walking/${coordsString}?geometries=geojson&access_token=${mapboxgl.accessToken}`;

    const res = await fetch(url);
    const data = await res.json();
    console.log(data)
    const route = data.routes[0]?.geometry;
    if (!route) return;

    const map = mapRef.current;
    if (!map) return;

    // Remove old route if exists
    if (map.getSource('route')) {
      map.removeLayer('route');
      map.removeSource('route');
    }

    map.addSource('route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: route,
      },
      lineMetrics: true
    });

    map.addLayer({
      id: 'route',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#3b82f6',
        'line-width': 4,
        'line-gradient': [
                    'interpolate',
                    ['linear'],
                    ['line-progress'],
                    0,
                    'blue',
                    0.1,
                    'royalblue',
                    0.3,
                    'cyan',
                    0.5,
                    'lime',
                    0.7,
                    'yellow',
                    1,
                    'red'
                ]
      },
    });
    setSteps(Math.round(data.routes[0].distance/0.762))
    setTime(Math.round(data.routes[0].duration/60))
    setDistance(Math.round(data.routes[0].distance/1000))
    setCalories(Math.round(data.routes[0].calories))
    setPace(data.routes[0].pace)
    const bounds = new mapboxgl.LngLatBounds();
    points.forEach((pt) => bounds.extend(pt));
    map.fitBounds(bounds, { padding: 40 });
  };
  const handleSaveRoute = async () => {
    const routeData = {
      date: new Date(),
      time,
      distance,
      calories,
      pace,
      steps,
      coordinates: coordinates,
      routeName: 'New Route',
      routeDescription: 'Description of the route',
    }
    try {
      const newRoute = await routeservice.create(routeData);
      console.log('Route saved:', newRoute);
    } catch (error) {
      console.error('Error saving route:', error);
    }
  }
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-sm mb-2 text-center">
        🖱️ Click on the map to add start, end, and waypoints!
      </div>
      <div ref={mapContainer} className="h-[600px] w-3/4 mx-auto rounded shadow" />
      <div className='flex flex-row gap-4 justify-center items-center flex-wrap'>
        <div className='w-48 py-3 text-center border-2 border-[#402905] bg-base-100 rounded-md shadow-md'>
          <h3 className="text-lg font-semibold">{steps ? `Steps: ${steps.toLocaleString()}` : `Steps: 0`}</h3>
        </div>
        <div className='w-48 py-3 text-center border-2 border-[#402905] bg-base-100 rounded-md shadow-md'>
          <h3 className="text-lg font-semibold">{time ? `Estimated walking time: ${time.toLocaleString()} Minutes` : `No route found`}</h3>
        </div>
        <div className='w-48 py-3 text-center border-2 border-[#402905] bg-base-100 rounded-md shadow-md'>
          <h3 className="text-lg font-semibold">{distance ? `Distance: ${distance.toLocaleString()} Kilometers` : `No route found`}</h3>
        </div>
        <div className='w-48 py-3 text-center border-2 border-[#402905] bg-base-100 rounded-md shadow-md'>
          <h3 className="text-lg font-semibold">{calories ? `Calories: ${calories.toLocaleString()}` : `No route found`}</h3>
        </div>
      </div>
      <button className='btn btn-primary' onClick={handleSaveRoute}>Save Route</button>
    </div>
  );
}
