import React from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { DollarSign } from 'lucide-react';
import { getDataByYear, cityMeta } from '../data/trafficData';

interface GDPCorrelationProps {
  year: number;
}

export const GDPCorrelation: React.FC<GDPCorrelationProps> = ({ year }) => {
  const yearData = getDataByYear(year).map(d => ({
    ...d,
    color: cityMeta[d.state]?.color ?? '#6b7280',
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg text-sm">
        <p className="font-bold">{d.state}</p>
        <p className="text-green-600">GDP/capita: ${d.gdpPerCapita.toLocaleString()}</p>
        <p className="text-orange-600">Congestion: {d.congestionLevel} hrs/yr</p>
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-green-500" />
          GDP vs Congestion — {year}
        </CardTitle>
        <CardDescription>
          Higher economic activity often correlates with higher congestion
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <ScatterChart margin={{ top: 20, right: 30, bottom: 40, left: 40 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
            <XAxis type="number" dataKey="gdpPerCapita" name="GDP/capita">
              <Label value="GDP Per Capita (USD)" offset={-10} position="insideBottom" style={{ fontSize: 11 }} />
            </XAxis>
            <YAxis type="number" dataKey="congestionLevel" name="Congestion">
              <Label value="Congestion (hrs/yr)" angle={-90} position="insideLeft" style={{ fontSize: 11 }} />
            </YAxis>
            <Tooltip content={<CustomTooltip />} />
            {yearData.map(d => (
              <Scatter
                key={d.state}
                name={d.state}
                data={[d]}
                fill={d.color}
                shape={(props: any) => {
                  const { cx, cy } = props;
                  return (
                    <g>
                      <circle cx={cx} cy={cy} r={10} fill={d.color} fillOpacity={0.8} />
                      <text
                        x={cx}
                        y={cy - 14}
                        textAnchor="middle"
                        style={{ fontSize: 9, fill: '#374151', fontWeight: 600 }}
                      >
                        {d.state.split(' ')[0]}
                      </text>
                    </g>
                  );
                }}
              />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Cities with higher GDP tend to have more economic activity, vehicle ownership, and road congestion.
        </p>
      </CardContent>
    </Card>
  );
};
