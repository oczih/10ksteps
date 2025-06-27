'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Coordinate } from '@/lib/coordinate-parser';

interface RouteContextType {
  coordinates: [number, number][];
  setCoordinates: (coords: [number, number][]) => void;
  addCoordinatesFromGemini: (coords: Coordinate[]) => void;
  clearCoordinates: () => void;
  hasCoordinates: boolean;
}

const RouteContext = createContext<RouteContextType | undefined>(undefined);

export function RouteProvider({ children }: { children: ReactNode }) {
  const [coordinates, setCoordinates] = useState<[number, number][]>([]);

  const addCoordinatesFromGemini = (coords: Coordinate[]) => {
    // Convert Coordinate objects to [lng, lat] format for Mapbox
    const mapboxCoords: [number, number][] = coords.map(coord => [
      coord.longitude,
      coord.latitude
    ]);
    setCoordinates(mapboxCoords);
  };

  const clearCoordinates = () => {
    setCoordinates([]);
  };

  const hasCoordinates = coordinates.length > 0;

  return (
    <RouteContext.Provider value={{
      coordinates,
      setCoordinates,
      addCoordinatesFromGemini,
      clearCoordinates,
      hasCoordinates
    }}>
      {children}
    </RouteContext.Provider>
  );
}

export function useRoute() {
  const context = useContext(RouteContext);
  if (context === undefined) {
    throw new Error('useRoute must be used within a RouteProvider');
  }
  return context;
} 