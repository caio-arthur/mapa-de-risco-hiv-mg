import React, { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { MunicipalityData } from '@/utils/dataAnalyzer';

interface HivMapViewProps {
  municipalities: MunicipalityData[];
  loading: boolean;
}

const HivMapView: React.FC<HivMapViewProps> = ({ municipalities, loading }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedMunicipality, setSelectedMunicipality] = useState<MunicipalityData | null>(null);
  const mapboxToken = 'pk.eyJ1IjoiY2Fpb2FydGh1ciIsImEiOiJjbWc1emk0dmcwNzN3MmpwdzVtbmFxNWtmIn0.pC5uHLVvUDao40MH54nM8w';

  const getRiskColor = (riskLevel: MunicipalityData['riskLevel']) => {
    switch (riskLevel) {
      case 'low': return '#22c55e';
      case 'medium': return '#f59e0b';
      case 'high': return '#ef4444';
      case 'critical': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const initializeMap = useCallback(() => {
    if (municipalities.length === 0 || !mapContainer.current || !mapboxToken) return;

    if (map.current) return; // Prevent map re-initialization

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-44.2619, -18.5122], // Center of Minas Gerais
      zoom: 6.5,
      pitch: 0,
    });

    map.current.on('load', () => {
      municipalities.forEach((municipality) => {
        const markerEl = document.createElement('div');
        markerEl.className = 'municipality-marker';
        markerEl.style.backgroundColor = getRiskColor(municipality.riskLevel);
        markerEl.style.width = `${Math.max(12, Math.min(40, municipality.hivCases / 50))}px`;
        markerEl.style.height = `${Math.max(12, Math.min(40, municipality.hivCases / 50))}px`;
        markerEl.style.borderRadius = '50%';
        markerEl.style.border = '2px solid white';
        markerEl.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
        markerEl.style.transition = 'transform 0.2s ease';

        const wrapperEl = document.createElement('div');
        wrapperEl.style.cursor = 'pointer';
        wrapperEl.appendChild(markerEl);

        const popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false,
          offset: 15
        });

        wrapperEl.addEventListener('mouseenter', () => {
          markerEl.style.transform = 'scale(1.2)';
          popup
            .setLngLat(municipality.coordinates)
            .setHTML(`
              <div class="p-2">
                <h3 class="font-semibold text-sm">${municipality.name}</h3>
                <p class="text-xs text-gray-600">Casos: ${municipality.hivCases}</p>
                <p class="text-xs text-gray-600">Taxa: ${municipality.incidenceRate}/100k hab</p>
                <p class="text-xs font-medium" style="color: ${getRiskColor(municipality.riskLevel)}">
                  Risco: ${municipality.riskLevel.charAt(0).toUpperCase() + municipality.riskLevel.slice(1)}
                </p>
              </div>
            `)
            .addTo(map.current!);
        });

        wrapperEl.addEventListener('mouseleave', () => {
          markerEl.style.transform = 'scale(1)';
          popup.remove();
        });

        wrapperEl.addEventListener('click', () => {
          setSelectedMunicipality(municipality);
        });

        new mapboxgl.Marker(wrapperEl)
          .setLngLat(municipality.coordinates)
          .addTo(map.current!);
      });
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
  }, [municipalities, mapboxToken]);

  useEffect(() => {
    initializeMap();

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [initializeMap]);

  return (
    <div className="relative w-full h-[600px] rounded-lg overflow-hidden shadow-card-soft">
      <div ref={mapContainer} className="absolute inset-0" />
      
      {selectedMunicipality && (
        <div className="absolute top-4 right-4 w-80">
          <Card className="p-4 bg-card/95 backdrop-blur-sm shadow-card-soft">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-lg">{selectedMunicipality.name}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedMunicipality(null)}
                className="h-6 w-6 p-0"
              >
                ×
              </Button>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Casos de HIV:</span>
                <span className="font-medium">{selectedMunicipality.hivCases.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">População:</span>
                <span className="font-medium">{selectedMunicipality.population.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Taxa por 100k hab:</span>
                <span className="font-medium">{selectedMunicipality.incidenceRate}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Nível de Risco:</span>
                <span 
                  className="px-2 py-1 rounded-full text-xs font-medium text-white"
                  style={{ backgroundColor: getRiskColor(selectedMunicipality.riskLevel) }}
                >
                  {selectedMunicipality.riskLevel.charAt(0).toUpperCase() + selectedMunicipality.riskLevel.slice(1)}
                </span>
              </div>
            </div>

            {selectedMunicipality.riskLevel === 'critical' && (
              <div className="mt-3 p-3 bg-risk-critical/10 border border-risk-critical/20 rounded-lg">
                <div className="flex items-center gap-2 text-risk-critical">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm font-medium">Alerta Crítico</span>
                </div>
                <p className="text-xs text-risk-critical/80 mt-1">
                  Este município requer atenção imediata devido à alta incidência de casos.
                </p>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};

export default HivMapView;
