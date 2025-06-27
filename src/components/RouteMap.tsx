'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import routeservice from '@/app/services/routeservice';
import { useUser } from '@/app/context/UserContext';
import { useSession } from 'next-auth/react';
import toast, { Toaster } from 'react-hot-toast';
import { WalkRoute } from '@/types';

export default function RouteMap() {
  const { user, setUser } = useUser();
  const { data: session, status } = useSession();
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [coordinates, setCoordinates] = useState<[number, number][]>([]);
  const [steps, setSteps] = useState<number>(0);
  const [time, setTime] = useState<number>(0);
  const [distance, setDistance] = useState<number>(0);
  const [calories, setCalories] = useState<number>(0);
  const [pace, setPace] = useState<number>(0);
  const [savedRoutes, setSavedRoutes] = useState<WalkRoute[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<string>('');

  mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY || '';

  // Fetch saved routes
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const routes = await routeservice.getUserRoutes();
        setSavedRoutes(routes);
      } catch (error) {
        console.error('Error fetching routes:', error);
        toast.error('Failed to load saved routes');
      }
    };

    if (status === 'authenticated') {
      fetchRoutes();
    }
  }, [status]);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.pace) {
      setPace(session.user.pace);
    }
  }, [status, session]);

  // Handle route selection
  const handleRouteSelect = (routeId: string) => {
    const route = savedRoutes.find(r => r.id === routeId);
    if (!route) return;

    setSelectedRoute(routeId);
    setCoordinates(route.coordinates);
    setSteps(route.steps);
    setTime(route.time);
    setDistance(route.distance);
    setCalories(route.calories);

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add markers for the selected route
    route.coordinates.forEach(coord => {
      const marker = new mapboxgl.Marker({ color: 'red' })
        .setLngLat(coord)
        .addTo(mapRef.current!);
      markersRef.current.push(marker);
    });

    // Update the map view
    if (mapRef.current && route.coordinates.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      route.coordinates.forEach(coord => bounds.extend(coord));
      mapRef.current.fitBounds(bounds, { padding: 50 });
      updateRoute(route.coordinates);
    }
  };

  const handleClearMap = () => {
    // Clear markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Clear route from map
    const map = mapRef.current;
    if (map?.getSource('route')) {
      map.removeLayer('route');
      map.removeSource('route');
    }

    // Reset states
    setCoordinates([]);
    setSteps(0);
    setTime(0);
    setDistance(0);
    setCalories(0);
    setSelectedRoute('');
  };

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
    const MET = 3.8;
    const weightKg = session?.user?.weight ?? 70; // or from your user context
    const durationHours = Math.round(data.routes[0].duration / 60) / 60;
    const estimatedCalories = Math.round(MET * weightKg * durationHours);
    setCalories(estimatedCalories);
    const bounds = new mapboxgl.LngLatBounds();
    points.forEach((pt) => bounds.extend(pt));
    map.fitBounds(bounds, { padding: 40 });
  };
  const handleSaveRoute = async () => {
    const routeData = {
      date: new Date(),
      time,
      distance,
      calories: calories ?? 0,
      pace,
      steps,
      coordinates: coordinates,
      routeName: 'New Route',
      routeDescription: 'Description of the route',
      madeFor: session?.user?.id
    }
    console.log('Calories to send:', calories);
    try {
      console.log('Saving route with coordinates:', coordinates);
      const newRoute = await routeservice.create(routeData);
      
      console.log('Route saved:', newRoute);
      toast.success('Route saved successfully', {
        style: {
          border: '1px solidrgb(7, 37, 0)',
          padding: '16px',
          color: 'solidrgb(7,37,0)',
        },
        iconTheme: {
          primary: '#713200',
          secondary: '#FFFAEE',
        },
      });
    } catch (error) {
      console.error('Error saving route:', error);
      toast.error('Error saving route');
    }
  }
  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl font-bold text-center mb-4">Create Your Walking Route</h2>
            
            <div className="flex justify-between items-center mb-4">
              <div className="alert alert-info flex-1 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>Click on the map to add start, end, and waypoints!</span>
              </div>
              
              <div className="flex gap-2 items-center">
                <select 
                  className="select select-bordered w-full max-w-xs"
                  value={selectedRoute}
                  onChange={(e) => handleRouteSelect(e.target.value)}
                >
                  <option value="">Select a saved route</option>
                  {savedRoutes.map((route) => (
                    <option key={route.id} value={route.id}>
                      {route.routeName} ({new Date(route.date).toLocaleDateString()})
                    </option>
                  ))}
                </select>

                <button 
                  className="btn btn-error btn-outline" 
                  onClick={handleClearMap}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Clear Map
                </button>
              </div>
            </div>

            <div ref={mapContainer} className="h-[600px] w-full rounded-xl overflow-hidden shadow-lg border-4 border-base-300" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 ">
              <div className="stats shadow hover:bg-base-200 transition duration-100">
                <div className="stat">
                  <div className="stat-title">Steps</div>
                  <div className="stat-value text-primary">{steps ? steps.toLocaleString() : '0'}</div>
                </div>
              </div>

              <div className="stats shadow hover:drop-shadow-xl hover:bg-base-200 transition duration-100">
                <div className="stat">
                  <div className="stat-title">Walking Time</div>
                  <div className="stat-value text-secondary">{time ? `${time} min` : '0 min'}</div>
                </div>
              </div>

              <div className="stats shadow hover:bg-base-200 transition duration-100">
                <div className="stat">
                  <div className="stat-title">Distance</div>
                  <div className="stat-value text-accent">{distance ? `${distance} km` : '0 km'}</div>
                </div>
              </div>

              <div className="stats shadow hover:bg-base-200 transition duration-100">
                <div className="stat">
                  <div className="stat-title">Calories</div>
                  <div className="stat-value text-info">{calories ? calories.toLocaleString() : '0'}</div>
                </div>
              </div>
            </div>

            <div className="card-actions justify-end mt-6">
              <button 
                className="btn btn-primary btn-lg gap-2" 
                onClick={handleSaveRoute}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                Save Route
              </button>
            </div>
          </div>
        </div>
      </div>
      <Toaster
        position="top-right"
        reverseOrder={false}
      />
    </div>
  );
}
