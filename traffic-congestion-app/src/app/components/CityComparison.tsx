import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { GitCompare } from 'lucide-react';
import { getStates, getDataByState, cityMeta } from '../data/trafficData';

const ALL_STATES = getStates();

export const CityComparison: React.FC = () => {
  const [selected, setSelected] = useState<string[]>(['Delhi NCR', 'Bengaluru', 'Mumbai']);
  const [metric, setMetric] = useState<'congestionLevel' | 'populationDensity' | 'gdpPerCapita'>(
    'congestionLevel'
  );

  const toggleCity = (city: string) => {
    setSelected(prev =>
      prev.includes(city)
        ? prev.filter(c => c !== city)
        : prev.length < 5
        ? [...prev, city]
        : prev
    );
  };

  const years = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

  const chartData = years.map(year => {
    const row: Record<string, number | string> = { year };
    selected.forEach(city => {
      const cityData = getDataByState(city).find(d => d.year === year);
      if (cityData) row[city] = cityData[metric];
    });
    return row;
  });

  const metricLabels = {
    congestionLevel: 'Congestion (hrs/yr)',
    populationDensity: 'Population Density (per km²)',
    gdpPerCapita: 'GDP Per Capita (USD)',
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <p className="font-semibold mb-2">{label}</p>
        {payload.map((p: any) => (
          <p key={p.dataKey} style={{ color: p.stroke }} className="text-sm">
            {p.dataKey}: {typeof p.value === 'number' ? p.value.toLocaleString() : p.value}
            {metric === 'congestionLevel' ? ' hrs' : metric === 'gdpPerCapita' ? ' USD' : '/km²'}
          </p>
        ))}
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitCompare className="h-5 w-5 text-blue-500" />
          Multi-City Comparison
        </CardTitle>
        <CardDescription>Select up to 5 cities to compare trends over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {ALL_STATES.map(city => {
              const color = cityMeta[city]?.color ?? '#6b7280';
              const isOn = selected.includes(city);
              return (
                <button
                  key={city}
                  onClick={() => toggleCity(city)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border-2 transition-all ${
                    isOn ? 'text-white' : 'bg-transparent text-gray-600 dark:text-gray-300'
                  }`}
                  style={isOn ? { backgroundColor: color, borderColor: color } : { borderColor: color }}
                >
                  {city}
                </button>
              );
            })}
          </div>

          <div className="flex gap-2 flex-wrap">
            {(['congestionLevel', 'populationDensity', 'gdpPerCapita'] as const).map(m => (
              <button
                key={m}
                onClick={() => setMetric(m)}
                className={`px-3 py-1 rounded-md text-sm transition-colors ${
                  metric === m
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {metricLabels[m]}
              </button>
            ))}
          </div>

          {selected.length === 0 ? (
            <p className="text-center text-gray-500 py-16">Select at least one city above</p>
          ) : (
            <ResponsiveContainer width="100%" height={380}>
              <LineChart data={chartData} margin={{ top: 10, right: 30, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
                <XAxis dataKey="year" />
                <YAxis
                  label={{
                    value: metricLabels[metric],
                    angle: -90,
                    position: 'insideLeft',
                    style: { fontSize: 11 },
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {selected.map(city => (
                  <Line
                    key={city}
                    type="monotone"
                    dataKey={city}
                    stroke={cityMeta[city]?.color ?? '#6b7280'}
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
