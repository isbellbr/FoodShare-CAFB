import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { Pantry } from "@/types";
import { getPantryStatus } from "@/lib/utils";

interface MapViewProps {
  pantries: Pantry[];
  userLocation?: { latitude: number; longitude: number };
  onToggleView: () => void;
}

export default function MapView({ pantries, userLocation, onToggleView }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [, navigate] = useLocation();
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize map when component mounts
  useEffect(() => {
    if (!window.google || !window.google.maps) {
      const checkGoogleMapsLoaded = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(checkGoogleMapsLoaded);
          setMapLoaded(true);
        }
      }, 100);
      
      return () => clearInterval(checkGoogleMapsLoaded);
    } else {
      setMapLoaded(true);
    }
  }, []);

  // Initialize map once Google Maps is loaded
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;
    
    const defaultLocation = { lat: 37.7749, lng: -122.4194 }; // San Francisco default
    
    const mapOptions: google.maps.MapOptions = {
      center: userLocation 
        ? { lat: userLocation.latitude, lng: userLocation.longitude }
        : defaultLocation,
      zoom: 12,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      zoomControl: true,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }]
        }
      ]
    };
    
    const newMap = new google.maps.Map(mapRef.current, mapOptions);
    setMap(newMap);
    
    // Add user location marker if available
    if (userLocation) {
      new google.maps.Marker({
        position: { 
          lat: userLocation.latitude, 
          lng: userLocation.longitude 
        },
        map: newMap,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: "#4285F4",
          fillOpacity: 1,
          strokeColor: "#FFFFFF",
          strokeWeight: 2
        },
        title: "Your Location"
      });
    }
    
    // Clean up
    return () => {
      setMap(null);
    };
  }, [mapLoaded, userLocation]);

  // Update markers when pantries or map changes
  useEffect(() => {
    if (!map || !pantries.length) return;
    
    // Clear previous markers
    markers.forEach(marker => marker.setMap(null));
    
    const newMarkers = pantries.map((pantry, index) => {
      const { status } = getPantryStatus(pantry.openingHours);
      
      const markerColor = 
        status === 'open' ? '#4CAF50' : 
        status === 'closing' ? '#FFC107' : 
        '#F44336';
      
      const marker = new google.maps.Marker({
        position: { lat: pantry.latitude, lng: pantry.longitude },
        map,
        title: pantry.name,
        label: {
          text: (index + 1).toString(),
          color: '#FFFFFF'
        },
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: markerColor,
          fillOpacity: 0.9,
          strokeColor: '#FFFFFF',
          strokeWeight: 2
        }
      });
      
      marker.addListener('click', () => {
        navigate(`/pantry/${pantry.id}`);
      });
      
      return marker;
    });
    
    setMarkers(newMarkers);
    
    // Fit bounds to show all markers plus user location
    if (newMarkers.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      
      if (userLocation) {
        bounds.extend({ 
          lat: userLocation.latitude, 
          lng: userLocation.longitude 
        });
      }
      
      newMarkers.forEach(marker => {
        if (marker.getPosition()) {
          bounds.extend(marker.getPosition()!);
        }
      });
      
      map.fitBounds(bounds);
      
      // If we have just one marker, zoom out a bit
      if (newMarkers.length === 1 && map.getZoom()! > 15) {
        map.setZoom(15);
      }
    }
    
    // Clean up
    return () => {
      newMarkers.forEach(marker => marker.setMap(null));
    };
  }, [map, pantries, userLocation, navigate]);

  return (
    <div className="map-container relative mb-4 bg-neutral-light">
      <div 
        ref={mapRef} 
        className="absolute inset-0 flex items-center justify-center"
      >
        {!mapLoaded && (
          <div className="bg-white p-4 rounded-lg text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-primary animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <p className="mt-2 font-medium">Loading Map</p>
            <p className="text-sm text-neutral-gray">Please wait...</p>
          </div>
        )}
      </div>
      <button
        className="absolute bottom-4 right-4 bg-white rounded-full p-3 shadow-lg"
        onClick={onToggleView}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h7"
          />
        </svg>
      </button>
    </div>
  );
}
