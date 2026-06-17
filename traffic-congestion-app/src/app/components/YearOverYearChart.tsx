import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { TrendingUp } from 'lucide-react';
import { StateData } from '../data/trafficData';
import { detectAnomalies } from '../utils/anomaly';

interface YearOverYearChartProps {
  data: StateData[];
  stateName: string;
}

export const YearOverYearChart: React.FC<YearOverYearChartProps> = ({ data, stateName }) => {
  const sorted = [...data].sort((a, b) => a.year - b.year);
  const anomalies = detectAnomalies(data);

  const chartData = sorted.slice(1).map((d, i) => {
    const prev = sorted[i];
    const change = ((d.congestionLevel - prev.congestionLevel) / prev.congestionLevel) * 100;
    return {
      year: d.year,
      change: parseFloat(change.toFixed(1)),
      isAnomaly: anomalies.has(d.year),
      label: anomalies.get(d.year)?.label ?? '',
    };
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg text-sm">
        <p className="font-semibold">{d.year}</p>
        <p className={d.change >= 0 ? 'text-red-600' : 'text-green-600'}>
          {d.change >= 0 ? '+' : ''}{d.change}% vs {d.year - 1}
        </p>
        {d.isAnomaly && (
          <p className="text-yellow-600 mt-1 text-xs">⚠ {d.label}</p>
        )}
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-500" />
          Year-over-Year Congestion Change — {stateName}
        </CardTitle>
        <CardDescription>
          % change in congestion level vs. previous year. Flagged bars indicate anomalies.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {anomalies.size > 0 && (
            <div className="flex flex-wrap gap-2">
              {Array.from(anomalies.values()).map(a => (
                <span
                  key={a.year}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-700 rounded-md text-xs text-yellow-800 dark:text-yellow-300"
                >
                  ⚠ {a.year}: {a.label}
                </span>
              ))}
            </div>
          )}

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 10, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
              <XAxis dataKey="year" />
              <YAxis
                tickFormatter={v => `${v}%`}
                label={{ value: '% Change', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={0} stroke="#9ca3af" strokeWidth={1.5} />
              <Bar dataKey="change" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, i) => (
                  <Cell
                    key={`cell-${i}`}
                    fill={
                      entry.isAnomaly
                        ? '#f59e0b'
                        : entry.change >= 0
                        ? '#ef4444'
                        : '#22c55e'
                    }
                    fillOpacity={entry.isAnomaly ? 1 : 0.85}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
