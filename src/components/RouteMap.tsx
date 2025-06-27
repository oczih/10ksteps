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

  // Initialize map only once
  useEffect(() => {
    // Always try to initialize the map when the component mounts
    if (!mapContainer.current) return;

    // Clean up any existing map instance
    if (mapRef.current) {
      markersRef.current.forEach(marker => marker.remove());
      mapRef.current.remove();
      mapRef.current = null;
    }

    console.log('Initializing map...');
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [24.941, 60.173], // default center
      zoom: 14,
    });

    map.addControl(new mapboxgl.NavigationControl());
    mapRef.current = map;

    // Wait for map to load before allowing interactions
    map.on('load', () => {
      console.log('Map loaded initially');
      
      // Set up click handler after map is loaded
      map.on('click', (e) => {
        e.preventDefault();
        const newCoord: [number, number] = [e.lngLat.lng, e.lngLat.lat];
        setCoordinates((prev) => [...prev, newCoord]);
        
        const marker = new mapboxgl.Marker({ color: 'red' })
          .setLngLat(newCoord)
          .addTo(map);
        
        markersRef.current.push(marker);
      });

      // If there are existing coordinates, add them to the map
      if (coordinates.length > 0) {
        coordinates.forEach(coord => {
          const marker = new mapboxgl.Marker({ color: 'red' })
            .setLngLat(coord)
            .addTo(map);
          markersRef.current.push(marker);
        });

        const bounds = new mapboxgl.LngLatBounds();
        coordinates.forEach(coord => bounds.extend(coord));
        map.fitBounds(bounds, { padding: 50 });

        if (coordinates.length >= 2) {
          updateRoute(coordinates);
        }
      }
    });

    return () => {
      console.log('Cleaning up map...');
      // Clean up markers and map on unmount
      markersRef.current.forEach(marker => marker.remove());
      map.remove();
      mapRef.current = null;
    };
  }, [coordinates]); // Re-run when coordinates change or component remounts

  // Load selected route from localStorage
  useEffect(() => {
    const loadRouteData = async () => {
      const selectedRouteData = localStorage.getItem('selectedRoute');
      if (!selectedRouteData) return;

      console.log('Loading route from localStorage...');
      const route = JSON.parse(selectedRouteData);
      setSelectedRoute(route.id);
      setCoordinates(route.coordinates);
      setSteps(route.steps);
      setTime(route.time);
      setDistance(route.distance);
      setCalories(route.calories);

      // Clear localStorage after loading
      localStorage.removeItem('selectedRoute');
    };

    loadRouteData().catch(error => {
      console.error('Error loading route data:', error);
      toast.error('Failed to load route');
    });
  }, []); // Only run once when component mounts

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.pace) {
      setPace(session.user.pace);
    }
  }, [status, session]);

  // Handle route selection
  const handleRouteSelect = async (routeId: string) => {
    const route = savedRoutes.find(r => r.id === routeId);
    if (!route) return;

    setSelectedRoute(routeId);
    setCoordinates(route.coordinates);
    setSteps(route.steps);
    setTime(route.time);
    setDistance(route.distance);
    setCalories(route.calories);

    const map = mapRef.current;
    if (!map) return;

    // Wait for map to be loaded
    if (!map.loaded()) {
      await new Promise<void>((resolve) => {
        const checkMap = () => {
          if (map.loaded()) {
            resolve();
          } else {
            setTimeout(checkMap, 100);
          }
        };
        checkMap();
      });
    }

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add markers for the selected route
    route.coordinates.forEach(coord => {
      const marker = new mapboxgl.Marker({ color: 'red' })
        .setLngLat(coord)
        .addTo(map);
      markersRef.current.push(marker);
    });

    // Update the map view and add route line
    if (route.coordinates.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      route.coordinates.forEach(coord => bounds.extend(coord));
      map.fitBounds(bounds, { padding: 50 });
      await updateRoute(route.coordinates);
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

  // Handle route updates separately
  useEffect(() => {
    if (coordinates.length >= 2) {
      updateRoute(coordinates);
    }
  }, [coordinates]);

  const updateRoute = async (points: [number, number][]) => {
    if (points.length < 2 || !mapRef.current) {
      console.log('Early return conditions:', {
        pointsLength: points.length,
        mapExists: !!mapRef.current
      });
      return;
    }

    const map = mapRef.current;

    // Wait for map to be loaded
    if (!map.loaded()) {
      await new Promise<void>((resolve) => {
        const checkMap = () => {
          if (map.loaded()) {
            resolve();
          } else {
            setTimeout(checkMap, 100);
          }
        };
        checkMap();
      });
    }

    try {
      const coordsString = points.map((coord) => coord.join(',')).join(';');
      const url = `https://api.mapbox.com/directions/v5/mapbox/walking/${coordsString}?geometries=geojson&access_token=${mapboxgl.accessToken}`;
      console.log('Fetching route from:', url);

      const res = await fetch(url);
      const data = await res.json();
      console.log('Route data:', data);
      
      const route = data.routes[0]?.geometry;
      if (!route) {
        console.error('No route found in response');
        return;
      }

      // Wait for style to be loaded
      await new Promise<void>((resolve) => {
        if (map.isStyleLoaded()) {
          resolve();
        } else {
          map.once('styledata', () => resolve());
        }
      });

      // Remove old route if exists
      try {
        if (map.getStyle().layers.find(layer => layer.id === 'route')) {
          map.removeLayer('route');
        }
        if (map.getSource('route')) {
          map.removeSource('route');
        }
      } catch (error) {
        console.error('Error removing old route:', error);
      }

      // Add the route source and layer
      try {
        console.log('Adding route source...');
        map.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: route
          }
        });

        console.log('Adding route layer...');
        map.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
            'visibility': 'visible'
          },
          paint: {
            'line-color': '#3b82f6',
            'line-width': 8,
            'line-opacity': 0.8
          }
        });

        // Verify layer was added
        const layerExists = map.getStyle().layers.find(layer => layer.id === 'route');
        const sourceExists = map.getSource('route');
        console.log('Layer and source status:', { layerExists, sourceExists });

      } catch (error) {
        console.error('Error adding route source/layer:', error);
        toast.error('Failed to display route line');
        return;
      }

      setSteps(Math.round(data.routes[0].distance/0.762));
      setTime(Math.round(data.routes[0].duration/60));
      setDistance(Math.round(data.routes[0].distance/1000));
      const MET = 3.8;
      const weightKg = session?.user?.weight ?? 70;
      const durationHours = Math.round(data.routes[0].duration / 60) / 60;
      const estimatedCalories = Math.round(MET * weightKg * durationHours);
      setCalories(estimatedCalories);

      const bounds = new mapboxgl.LngLatBounds();
      points.forEach((pt) => bounds.extend(pt));
      map.fitBounds(bounds, { padding: 40 });
    } catch (error) {
      console.error('Error updating route:', error);
      toast.error('Failed to update route');
    }
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
                  <div className="stat-value text-secondary">{time ? `~${time} min` : '0 min'}</div>
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
