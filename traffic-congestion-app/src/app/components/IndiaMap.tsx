import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { MapPin } from 'lucide-react';
import { getDataByYear, cityMeta } from '../data/trafficData';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

interface IndiaMapProps {
  year: number;
  onSelectCity: (city: string) => void;
  selectedCity: string;
}

export const IndiaMap: React.FC<IndiaMapProps> = ({ year, onSelectCity, selectedCity }) => {
  const [tooltip, setTooltip] = useState<{ city: string; x: number; y: number } | null>(null);

  const yearData = getDataByYear(year);
  const maxCongestion = Math.max(...yearData.map(d => d.congestionLevel));
  const minCongestion = Math.min(...yearData.map(d => d.congestionLevel));

  const getBubbleRadius = (congestion: number) => {
    const normalized = (congestion - minCongestion) / (maxCongestion - minCongestion);
    return 8 + normalized * 22;
  };

  const getColor = (congestion: number) => {
    const normalized = (congestion - minCongestion) / (maxCongestion - minCongestion);
    if (normalized > 0.75) return '#dc2626';
    if (normalized > 0.5) return '#ea580c';
    if (normalized > 0.25) return '#ca8a04';
    return '#16a34a';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-red-500" />
          India Congestion Map — {year}
        </CardTitle>
        <CardDescription>
          Bubble size and colour represent congestion severity. Click a city to focus on it.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4 items-center text-sm">
            <span className="text-gray-500 dark:text-gray-400">Severity:</span>
            {[
              { label: 'Low', color: '#16a34a' },
              { label: 'Medium', color: '#ca8a04' },
              { label: 'High', color: '#ea580c' },
              { label: 'Critical', color: '#dc2626' },
            ].map(({ label, color }) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-gray-600 dark:text-gray-300">{label}</span>
              </div>
            ))}
            <span className="text-gray-400 text-xs ml-2">Bubble size = relative congestion</span>
          </div>

          <div className="relative bg-blue-50 dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{ center: [82, 22], scale: 1050 }}
              width={800}
              height={520}
              style={{ width: '100%', height: 'auto' }}
            >
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies
                    .filter(geo => String(geo.id) === '356')
                    .map(geo => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill="#dbeafe"
                        stroke="#93c5fd"
                        strokeWidth={0.8}
                        style={{
                          default: { outline: 'none' },
                          hover: { outline: 'none' },
                          pressed: { outline: 'none' },
                        }}
                      />
                    ))
                }
              </Geographies>

              {yearData.map(d => {
                const meta = cityMeta[d.state];
                if (!meta) return null;
                const r = getBubbleRadius(d.congestionLevel);
                const color = getColor(d.congestionLevel);
                const isSelected = d.state === selectedCity;

                return (
                  <Marker
                    key={d.state}
                    coordinates={meta.coordinates}
                    onClick={() => onSelectCity(d.state)}
                    onMouseEnter={(e: any) => {
                      const rect = (e.target as SVGElement)
                        .closest('svg')
                        ?.getBoundingClientRect();
                      setTooltip({ city: d.state, x: e.clientX, y: e.clientY });
                    }}
                    onMouseLeave={() => setTooltip(null)}
                  >
                    <circle
                      r={r}
                      fill={color}
                      fillOpacity={0.75}
                      stroke={isSelected ? '#1e40af' : '#fff'}
                      strokeWidth={isSelected ? 3 : 1.5}
                      style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                    />
                    <text
                      textAnchor="middle"
                      y={-r - 4}
                      style={{
                        fontSize: 9,
                        fontWeight: isSelected ? 700 : 500,
                        fill: '#1f2937',
                        pointerEvents: 'none',
                        userSelect: 'none',
                      }}
                    >
                      {d.state.split(' ')[0]}
                    </text>
                    <text
                      textAnchor="middle"
                      y={4}
                      style={{
                        fontSize: 8,
                        fill: '#fff',
                        fontWeight: 700,
                        pointerEvents: 'none',
                        userSelect: 'none',
                      }}
                    >
                      {d.congestionLevel}
                    </text>
                  </Marker>
                );
              })}
            </ComposableMap>

            {tooltip && (
              <div
                className="fixed z-50 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg pointer-events-none"
                style={{ left: tooltip.x + 12, top: tooltip.y - 10 }}
              >
                {(() => {
                  const d = yearData.find(x => x.state === tooltip.city);
                  if (!d) return tooltip.city;
                  return (
                    <div>
                      <p className="font-bold">{d.state}</p>
                      <p>Congestion: {d.congestionLevel} hrs/yr</p>
                      <p>Density: {d.populationDensity.toLocaleString()}/km²</p>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {yearData
              .sort((a, b) => b.congestionLevel - a.congestionLevel)
              .map(d => (
                <button
                  key={d.state}
                  onClick={() => onSelectCity(d.state)}
                  className={`p-2 rounded-lg text-left text-xs border transition-all ${
                    d.state === selectedCity
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-400'
                  }`}
                >
                  <div
                    className="w-2 h-2 rounded-full mb-1"
                    style={{ backgroundColor: getColor(d.congestionLevel) }}
                  />
                  <p className="font-medium truncate">{d.state}</p>
                  <p className="text-gray-500">{d.congestionLevel} hrs</p>
                </button>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
