'use client'

import { useEffect, useState } from "react";
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export default function RouteMap() {
    useEffect(() => {
        const existingmap = document.getElementById('map')
        if (!existingmap || existingmap.innerHTML !== '') return;

    const map = L.map('map').setView([49.41461, 8.681495], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    const apiKey = process.env.NEXT_PUBLIC_ORS_API_KEY;
    const start = [8.681495, 49.41461]; // [lng, lat]
    const end = [8.687872, 49.420318];
    fetch('https://api.openrouteservice.org/v2/directions/foot-walking/geojson', {
      method: 'POST',
      headers: {
        'Authorization': apiKey,
        'Accept': 'application/json, application/geo+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        coordinates: [start, end],
      }),
    })
      .then(res => res.json())
      .then(data => {
        const coords = data.features[0].geometry.coordinates.map(
          ([lng, lat]: [number, number]) => [lat, lng]
        );
        const route = L.polyline(coords, { color: 'blue' }).addTo(map);
        map.fitBounds(route.getBounds());
      })
      .catch(err => console.error(err));
  }, []);

  return <div id="map" className="h-150 w-1/2 mx-auto" />;
}
