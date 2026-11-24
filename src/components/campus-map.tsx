'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Compass, Navigation } from 'lucide-react';
import { Institution } from '@/types';

// Default coordinates for known locations
const CITY_COORDINATES: Record<string, [number, number]> = {
  Mumbai: [19.1334, 72.9133], // IIT Bombay
  Pilani: [28.3639, 75.587], // BITS Pilani
  'New Delhi': [28.6903, 77.2132], // DU North Campus
  Delhi: [28.6903, 77.2132],
  Bengaluru: [12.9784, 77.6408], // NPS Indiranagar
  Hyderabad: [17.385, 78.4867],
  Pune: [18.5204, 73.8567],
  Chennai: [13.0827, 80.2707],
  Kolkata: [22.5726, 88.3639],
};

interface CampusLocationMapProps {
  selectedCampus: Institution | null;
  onCampusSelect?: (campus: Institution) => void;
  allCampuses?: Institution[];
}

export function CampusLocationMap({
  selectedCampus,
  onCampusSelect,
  allCampuses = [],
}: CampusLocationMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const userMarkerRef = useRef<any>(null);
  const circleRef = useRef<any>(null);

  const [userCoords, setUserCoords] = useState<[number, number]>([19.1334, 72.9133]);
  const [locationStatus, setLocationStatus] = useState<'detecting' | 'detected' | 'fallback'>('detecting');
  const [isClient, setIsClient] = useState(false);

  // Determine current active center
  const activeCenter: [number, number] =
    selectedCampus && CITY_COORDINATES[selectedCampus.city]
      ? CITY_COORDINATES[selectedCampus.city]
      : userCoords;

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Automatic GPS Geolocation detection
  useEffect(() => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserCoords([position.coords.latitude, position.coords.longitude]);
          setLocationStatus('detected');
        },
        () => {
          if (selectedCampus && CITY_COORDINATES[selectedCampus.city]) {
            setUserCoords(CITY_COORDINATES[selectedCampus.city]);
          }
          setLocationStatus('fallback');
        },
        { timeout: 6000, enableHighAccuracy: true }
      );
    } else {
      setLocationStatus('fallback');
    }
  }, [selectedCampus]);

  // Initialize pure Leaflet instance on the DOM element
  useEffect(() => {
    if (!isClient || !mapContainerRef.current) return;

    let isMounted = true;

    import('leaflet').then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      // Clean up previous instance if any
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Create map
      const map = L.map(mapContainerRef.current, {
        center: activeCenter,
        zoom: 13,
        scrollWheelZoom: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      mapInstanceRef.current = map;

      // Custom icons
      const campusIcon = L.divIcon({
        className: 'custom-campus-pin',
        html: `<div style="background-color: #2563EB; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2.5px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.25); color: white;">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
              </div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const userIcon = L.divIcon({
        className: 'custom-user-pin',
        html: `<div style="background-color: #059669; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2.5px solid white; box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.35); color: white;">
                <div style="width: 8px; height: 8px; background: white; border-radius: 50%;"></div>
              </div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });

      // User Marker & 2.5km Peer Circle
      const userMarker = L.marker(userCoords, { icon: userIcon }).addTo(map);
      userMarker.bindPopup(`
        <div style="font-size: 12px; font-family: sans-serif; padding: 4px;">
          <strong style="color: #0f172a;">Your Approximate Location</strong>
          <p style="color: #64748b; font-size: 11px; margin: 4px 0 0 0;">Items within 5 km eligible for zero-commission handovers.</p>
        </div>
      `);
      userMarkerRef.current = userMarker;

      const circle = L.circle(userCoords, {
        radius: 2500,
        fillColor: '#3B82F6',
        fillOpacity: 0.1,
        color: '#2563EB',
        weight: 1.5,
        dashArray: '4, 4',
      }).addTo(map);
      circleRef.current = circle;

      // Plot all campuses
      markersRef.current = [];
      allCampuses.forEach((campus) => {
        const coords = CITY_COORDINATES[campus.city] || [
          activeCenter[0] + (Math.random() - 0.5) * 0.05,
          activeCenter[1] + (Math.random() - 0.5) * 0.05,
        ];

        const marker = L.marker(coords, { icon: campusIcon }).addTo(map);
        marker.bindPopup(`
          <div style="font-size: 12px; font-family: sans-serif; padding: 4px; min-width: 170px;">
            <strong style="color: #0f172a; display: block; margin-bottom: 2px;">${campus.name}</strong>
            <span style="color: #64748b; font-size: 11px;">${campus.city}, ${campus.state}</span>
            <div style="margin-top: 6px; display: inline-block; font-size: 10px; font-weight: 600; color: #059669; background: #ecfdf5; padding: 2px 6px; border-radius: 4px;">
              Verified Campus Network
            </div>
          </div>
        `);
        markersRef.current.push(marker);
      });
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isClient]);

  // Update map view when selected campus or user coordinates change
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(activeCenter, 13);
      if (userMarkerRef.current) {
        userMarkerRef.current.setLatLng(userCoords);
      }
      if (circleRef.current) {
        circleRef.current.setLatLng(userCoords);
      }
    }
  }, [activeCenter, userCoords]);

  const handleLocateMe = () => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      setLocationStatus('detecting');
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newCoords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
          setUserCoords(newCoords);
          setLocationStatus('detected');
          if (mapInstanceRef.current) {
            mapInstanceRef.current.setView(newCoords, 14);
          }
        },
        () => setLocationStatus('fallback'),
        { timeout: 5000, enableHighAccuracy: true }
      );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden transition hover:border-slate-300">
      {/* Header bar */}
      <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#ECFDF5] text-[#10B981] flex items-center justify-center border border-[#A7F3D0]">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#0B1F33] flex items-center space-x-1.5">
              <span>Campus Proximity Radar</span>
              <span className="text-[10px] font-bold bg-[#ECFDF5] text-[#065F46] px-2 py-0.5 rounded-full border border-[#A7F3D0]">
                Leaflet OpenStreetMap
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              {locationStatus === 'detecting' && 'Detecting your approximate GPS position...'}
              {locationStatus === 'detected' && `GPS Location detected: ${userCoords[0].toFixed(3)}°N, ${userCoords[1].toFixed(3)}°E`}
              {locationStatus === 'fallback' && (selectedCampus ? `Synced to ${selectedCampus.name}` : 'Using default campus coverage')}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleLocateMe}
            className="inline-flex items-center space-x-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-white border border-[#0B1F33] text-[#0B1F33] hover:bg-[#ECFDF5] hover:border-[#10B981] transition shadow-xs cursor-pointer"
          >
            <Navigation className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Auto-Locate Me</span>
          </button>
        </div>
      </div>

      {/* Map DOM Container */}
      <div className="relative h-64 sm:h-72 w-full bg-slate-100">
        {!isClient && (
          <div className="h-full w-full flex items-center justify-center text-xs text-slate-400">
            <span>Loading campus map tiles...</span>
          </div>
        )}
        <div ref={mapContainerRef} className="h-full w-full z-10" />

        {/* Floating map badge info */}
        <div className="absolute bottom-3 left-3 z-[400] bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200/80 shadow-sm text-[11px] text-slate-600 flex items-center space-x-2 pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>
            Active zone: <strong className="text-slate-800">{selectedCampus ? selectedCampus.name : 'All Campuses (Nationwide)'}</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
