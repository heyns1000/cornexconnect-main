import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface MapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  markers?: Array<{
    id: string;
    position: { lat: number; lng: number };
    title: string;
    info?: string;
    icon?: string;
  }>;
  onMapLoad?: (map: google.maps.Map) => void;
  className?: string;
  height?: string;
}

export function GoogleMap({ 
  center = { lat: -26.2041, lng: 28.0473 }, // Johannesburg
  zoom = 6,
  markers = [],
  onMapLoad,
  className = "",
  height = "400px"
}: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const markersRef = useRef<google.maps.Marker[]>([]);

  useEffect(() => {
    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyBkNaAGLEVq0YLQMi-PYEMabFeREadYe1Q',
      version: 'weekly',
      libraries: ['places', 'geometry', 'directions']
    });

    loader.load().then(() => {
      setIsLoaded(true);
    }).catch(err => {
      console.error('Error loading Google Maps:', err);
    });
  }, []);

  useEffect(() => {
    if (isLoaded && mapRef.current && !map) {
      const newMap = new google.maps.Map(mapRef.current, {
        center,
        zoom,
        styles: [
          {
            featureType: 'all',
            elementType: 'geometry.fill',
            stylers: [{ color: '#f5f5f5' }]
          },
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#e9e9e9' }]
          },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{ color: '#ffffff' }]
          }
        ]
      });

      setMap(newMap);
      onMapLoad?.(newMap);
    }
  }, [isLoaded, center, zoom, onMapLoad]);

  useEffect(() => {
    if (map && markers.length > 0) {
      // Clear existing markers
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];

      // Add new markers
      const infoWindow = new google.maps.InfoWindow();
      
      markers.forEach(markerData => {
        const marker = new google.maps.Marker({
          position: markerData.position,
          map,
          title: markerData.title,
          icon: markerData.icon ? {
            url: markerData.icon,
            scaledSize: new google.maps.Size(32, 32)
          } : undefined
        });

        if (markerData.info) {
          marker.addListener('click', () => {
            infoWindow.setContent(`
              <div style="padding: 8px;">
                <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">
                  ${markerData.title}
                </h3>
                <p style="margin: 0; font-size: 12px; color: #666;">
                  ${markerData.info}
                </p>
              </div>
            `);
            infoWindow.open(map, marker);
          });
        }

        markersRef.current.push(marker);
      });

      // Fit bounds to show all markers
      if (markers.length > 1) {
        const bounds = new google.maps.LatLngBounds();
        markers.forEach(marker => bounds.extend(marker.position));
        map.fitBounds(bounds);
      }
    }
  }, [map, markers]);

  if (!isLoaded) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`}
        style={{ height }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={mapRef} 
      className={`rounded-lg overflow-hidden ${className}`}
      style={{ height }}
    />
  );
}

export default GoogleMap;