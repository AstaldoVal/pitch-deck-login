import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ContractorMapProps {
  address: string;
  contractorName: string;
}

const ContractorMap: React.FC<ContractorMapProps> = ({ address, contractorName }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [isTokenSet, setIsTokenSet] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Mock coordinates for demo (in real app, you'd geocode the address)
  const getCoordinatesFromAddress = (address: string): [number, number] => {
    // Demo coordinates for different cities
    const cityCoords: Record<string, [number, number]> = {
      'main st': [-74.006, 40.7128], // New York
      'oak ave': [-118.2437, 34.0522], // Los Angeles
      'maple dr': [-87.6298, 41.8781], // Chicago
    };
    
    const addressLower = address.toLowerCase();
    for (const [key, coords] of Object.entries(cityCoords)) {
      if (addressLower.includes(key)) {
        return coords;
      }
    }
    
    // Default to New York
    return [-74.006, 40.7128];
  };

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken) return;

    setLoading(true);
    
    try {
      mapboxgl.accessToken = mapboxToken;
      
      const coordinates = getCoordinatesFromAddress(address);
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: coordinates,
        zoom: 14,
      });

      // Add marker for contractor location
      new mapboxgl.Marker({
        color: '#3b82f6',
        scale: 1.2
      })
        .setLngLat(coordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div class="p-2">
                <h3 class="font-semibold text-sm">${contractorName}</h3>
                <p class="text-xs text-gray-600">${address}</p>
              </div>
            `)
        )
        .addTo(map.current);

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      map.current.on('load', () => {
        setLoading(false);
      });

    } catch (error) {
      console.error('Error initializing map:', error);
      setLoading(false);
    }
  };

  const handleTokenSubmit = () => {
    if (mapboxToken.trim()) {
      setIsTokenSet(true);
      initializeMap();
    }
  };

  useEffect(() => {
    return () => {
      map.current?.remove();
    };
  }, []);

  if (!isTokenSet) {
    return (
      <div className="p-4 border rounded-lg bg-gray-50">
        <Alert className="mb-4">
          <AlertDescription>
            To display the map, please enter your Mapbox public token. You can get one from{' '}
            <a 
              href="https://mapbox.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              mapbox.com
            </a>
            {' '}(Tokens section in dashboard).
          </AlertDescription>
        </Alert>
        
        <div className="space-y-3">
          <Input
            type="text"
            placeholder="Enter your Mapbox public token (pk.ey...)"
            value={mapboxToken}
            onChange={(e) => setMapboxToken(e.target.value)}
            className="font-mono text-sm"
          />
          <Button 
            onClick={handleTokenSubmit}
            disabled={!mapboxToken.trim()}
            className="w-full"
          >
            Load Map
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center z-10">
          <div className="text-sm text-gray-600">Loading map...</div>
        </div>
      )}
      <div 
        ref={mapContainer} 
        className="w-full h-64 rounded-lg border overflow-hidden"
      />
    </div>
  );
};

export default ContractorMap;