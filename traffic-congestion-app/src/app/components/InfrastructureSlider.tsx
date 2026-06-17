import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Construction } from 'lucide-react';
import { StateData } from '../data/trafficData';
import { calculateLinearRegression } from '../utils/regression';

interface InfrastructureSliderProps {
  stateData: StateData[];
  stateName: string;
}

export const InfrastructureSlider: React.FC<InfrastructureSliderProps> = ({ stateData, stateName }) => {
  const [reductionPct, setReductionPct] = useState(0);

  const latestData = [...stateData].sort((a, b) => b.year - a.year)[0];
  if (!latestData) return null;

  const densities = stateData.map(d => d.populationDensity);
  const congestions = stateData.map(d => d.congestionLevel);
  const regression = calculateLinearRegression(densities, congestions);

  const adjustedDensity = latestData.populationDensity * (1 - reductionPct / 100);
  const predictedCongestion = Math.max(
    0,
    regression.slope * adjustedDensity + regression.intercept
  );
  const congestionChange = predictedCongestion - latestData.congestionLevel;
  const congestionChangePct = (congestionChange / latestData.congestionLevel) * 100;

  const scenarios = [
    { label: 'Metro expansion', pct: -15 },
    { label: 'Work from home', pct: -10 },
    { label: 'Satellite city', pct: -20 },
    { label: 'Rapid urbanisation', pct: 15 },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Construction className="h-5 w-5 text-orange-500" />
          Infrastructure Impact Simulator — {stateName}
        </CardTitle>
        <CardDescription>
          Adjust population density to see the predicted effect on congestion
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {scenarios.map(s => (
              <button
                key={s.label}
                onClick={() => setReductionPct(s.pct)}
                className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                  reductionPct === s.pct
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-orange-400'
                }`}
              >
                {s.label} ({s.pct > 0 ? '+' : ''}{s.pct}%)
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Density change: <span className="font-medium">
                  {reductionPct > 0 ? '+' : ''}{reductionPct}%
                </span>
              </span>
              <span className="text-gray-500">
                −30% &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 0% &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; +30%
              </span>
            </div>
            <input
              type="range"
              min={-30}
              max={30}
              step={1}
              value={reductionPct}
              onChange={e => setReductionPct(parseInt(e.target.value))}
              className="w-full accent-orange-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">Current Density (2024)</p>
              <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                {latestData.populationDensity.toLocaleString()}
              </p>
              <p className="text-xs text-blue-500 mt-1">people/km²</p>
            </div>
            <div className="p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
              <p className="text-xs text-orange-600 dark:text-orange-400 mb-1">Adjusted Density</p>
              <p className="text-2xl font-bold text-orange-800 dark:text-orange-200">
                {Math.round(adjustedDensity).toLocaleString()}
              </p>
              <p className="text-xs text-orange-500 mt-1">people/km²</p>
            </div>
            <div
              className={`p-4 rounded-lg ${
                congestionChange <= 0
                  ? 'bg-green-50 dark:bg-green-950'
                  : 'bg-red-50 dark:bg-red-950'
              }`}
            >
              <p
                className={`text-xs mb-1 ${
                  congestionChange <= 0
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                Predicted Congestion
              </p>
              <p
                className={`text-2xl font-bold ${
                  congestionChange <= 0
                    ? 'text-green-800 dark:text-green-200'
                    : 'text-red-800 dark:text-red-200'
                }`}
              >
                {predictedCongestion.toFixed(1)}
              </p>
              <p
                className={`text-xs mt-1 font-semibold ${
                  congestionChange <= 0
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {congestionChange >= 0 ? '+' : ''}{congestionChange.toFixed(1)} hrs
                ({congestionChangePct >= 0 ? '+' : ''}{congestionChangePct.toFixed(1)}%)
              </p>
            </div>
          </div>

          {reductionPct !== 0 && (
            <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
              {reductionPct < 0
                ? `A ${Math.abs(reductionPct)}% reduction in population density (e.g. through metro expansion, satellite cities, or WFH policies) could reduce congestion by ~${Math.abs(congestionChange).toFixed(0)} hours per commuter per year.`
                : `A ${reductionPct}% increase in population density (e.g. through rapid urbanisation) could add ~${congestionChange.toFixed(0)} hours of delay per commuter per year.`}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
