import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Clock } from 'lucide-react';
import { getDataByYear, getPeakCongestion, getOffPeakCongestion } from '../data/trafficData';

interface PeakOffPeakChartProps {
  year: number;
  onSelectCity: (city: string) => void;
}

export const PeakOffPeakChart: React.FC<PeakOffPeakChartProps> = ({ year, onSelectCity }) => {
  const yearData = getDataByYear(year)
    .sort((a, b) => b.congestionLevel - a.congestionLevel)
    .map(d => ({
      city: d.state.split(' ')[0],
      fullCity: d.state,
      avg: d.congestionLevel,
      peak: getPeakCongestion(d.state, d.congestionLevel),
      offPeak: getOffPeakCongestion(d.state, d.congestionLevel),
    }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    const d = yearData.find(x => x.city === label);
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg text-sm">
        <p className="font-bold mb-1">{d?.fullCity ?? label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.fill }}>
            {p.name}: {p.value} hrs/yr
          </p>
        ))}
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-purple-500" />
          Peak vs Off-Peak Congestion — {year}
        </CardTitle>
        <CardDescription>
          Rush-hour congestion vs off-peak delays across all cities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart
            data={yearData}
            margin={{ top: 10, right: 20, bottom: 20, left: 20 }}
            onClick={data => {
              if (data?.activePayload?.[0]) {
                const city = yearData.find(d => d.city === data.activePayload![0].payload.city);
                if (city) onSelectCity(city.fullCity);
              }
            }}
          >
            <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
            <XAxis dataKey="city" tick={{ fontSize: 11 }} />
            <YAxis
              label={{
                value: 'Congestion (hrs/yr)',
                angle: -90,
                position: 'insideLeft',
                style: { fontSize: 11 },
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="peak" name="Peak Hours" fill="#ef4444" radius={[3, 3, 0, 0]} fillOpacity={0.85} />
            <Bar dataKey="avg" name="Average" fill="#3b82f6" radius={[3, 3, 0, 0]} fillOpacity={0.85} />
            <Bar dataKey="offPeak" name="Off-Peak" fill="#22c55e" radius={[3, 3, 0, 0]} fillOpacity={0.85} />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Click a bar to focus on that city in the main analysis. Peak multipliers vary by city type.
        </p>
      </CardContent>
    </Card>
  );
};
