import React from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { RegressionResult } from '../utils/regression';
import { detectAnomalies } from '../utils/anomaly';

interface CongestionChartProps {
  data: { populationDensity: number; congestionLevel: number; year: number }[];
  regression: RegressionResult;
  selectedYear: number;
  stateName: string;
}

export const CongestionChart: React.FC<CongestionChartProps> = ({
  data,
  regression,
  selectedYear,
  stateName,
}) => {
  if (data.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Population Density vs Traffic Congestion</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No data available for the selected region.</p>
        </CardContent>
      </Card>
    );
  }

  const anomalies = detectAnomalies(data as any);

  const minDensity = Math.min(...data.map(d => d.populationDensity));
  const maxDensity = Math.max(...data.map(d => d.populationDensity));

  const regressionLineData = [
    {
      populationDensity: minDensity,
      predictedCongestion: regression.slope * minDensity + regression.intercept,
    },
    {
      populationDensity: maxDensity,
      predictedCongestion: regression.slope * maxDensity + regression.intercept,
    },
  ];

  const selectedData = data.find(d => d.year === selectedYear);
  const anomalyData = data.filter(d => anomalies.has(d.year) && d.year !== selectedYear);
  const normalData = data.filter(
    d => !anomalies.has(d.year) && d.year !== selectedYear
  );

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    const anomaly = anomalies.get(d.year);
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg text-sm">
        <p className="font-semibold">{`Year: ${d.year}`}</p>
        <p className="text-blue-600">{`Population Density: ${d.populationDensity?.toLocaleString()} per sq km`}</p>
        <p className="text-orange-600">{`Congestion: ${d.congestionLevel} hours/year`}</p>
        {anomaly && (
          <p className="text-yellow-600 mt-1 text-xs">⚠ {anomaly.label}</p>
        )}
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Population Density vs Traffic Congestion</CardTitle>
        <CardDescription>
          {stateName} — Historical data (2015–2024) with regression analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg flex-wrap">
            <div className="flex-1 min-w-[100px]">
              <p className="text-sm text-gray-500">Slope (m)</p>
              <p className="text-xl font-semibold">{regression.slope.toFixed(4)}</p>
            </div>
            <div className="flex-1 min-w-[100px]">
              <p className="text-sm text-gray-500">Intercept (b)</p>
              <p className="text-xl font-semibold">{regression.intercept.toFixed(2)}</p>
            </div>
            <div className="flex-1 min-w-[100px]">
              <p className="text-sm text-gray-500">R² (Fit Quality)</p>
              <p className="text-xl font-semibold">{regression.rSquared.toFixed(4)}</p>
            </div>
          </div>

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

          <ResponsiveContainer width="100%" height={380}>
            <ScatterChart margin={{ top: 20, right: 30, bottom: 30, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
              <XAxis
                type="number"
                dataKey="populationDensity"
                name="Population Density"
                unit=" /km²"
                label={{ value: 'Population Density (people per sq km)', position: 'bottom', offset: 10, style: { fontSize: 11 } }}
              />
              <YAxis
                type="number"
                dataKey="congestionLevel"
                name="Congestion Level"
                unit=" hrs"
                label={{ value: 'Congestion (hours/year)', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" />

              <Scatter name="Historical Data" data={normalData} fill="#3b82f6" shape="circle" />

              {anomalyData.length > 0 && (
                <Scatter
                  name="Anomalous Year"
                  data={anomalyData}
                  fill="#f59e0b"
                  shape="triangle"
                  size={120}
                />
              )}

              {selectedData && (
                <Scatter
                  name={`Selected (${selectedYear})`}
                  data={[selectedData]}
                  fill="#ef4444"
                  shape="star"
                  size={200}
                />
              )}

              <Scatter
                name="Regression Line"
                data={regressionLineData}
                fill="#f59e0b"
                line={{ stroke: '#f59e0b', strokeWidth: 2 }}
                shape={() => null}
              />
            </ScatterChart>
          </ResponsiveContainer>

          <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">
              Regression Equation:
            </p>
            <p className="text-lg font-mono text-blue-700 dark:text-blue-300">
              Congestion = {regression.slope.toFixed(4)} × Density + {regression.intercept.toFixed(2)}
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
              R² = {regression.rSquared.toFixed(4)} — {regression.rSquared > 0.8 ? 'Strong' : regression.rSquared > 0.5 ? 'Moderate' : 'Weak'} model fit
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
