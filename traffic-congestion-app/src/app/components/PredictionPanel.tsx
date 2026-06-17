import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  ComposedChart,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { TrendingUp, AlertTriangle, Info } from 'lucide-react';
import { Prediction } from '../utils/regression';

interface PredictionPanelProps {
  historicalData: { year: number; populationDensity: number; congestionLevel: number }[];
  predictions: Prediction[];
  stateName: string;
}

export const PredictionPanel: React.FC<PredictionPanelProps> = ({
  historicalData,
  predictions,
  stateName,
}) => {
  // Combine historical and predicted data for visualization
  const combinedData = [
    ...historicalData.map(d => ({
      year: d.year,
      actualCongestion: d.congestionLevel,
      predictedCongestion: null,
      populationDensity: d.populationDensity,
      type: 'historical',
    })),
    ...predictions.map(p => ({
      year: p.year,
      actualCongestion: null,
      predictedCongestion: p.predictedCongestion,
      populationDensity: p.populationDensity,
      type: 'predicted',
    })),
  ];

  const lastHistoricalYear = historicalData[historicalData.length - 1];
  const lastPrediction = predictions.length > 0 ? predictions[predictions.length - 1] : null;

  if (!lastHistoricalYear || !lastPrediction) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-orange-500" />
            Future Congestion Predictions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Not enough data to generate predictions.</p>
        </CardContent>
      </Card>
    );
  }

  const congestionChange =
    ((lastPrediction.predictedCongestion - lastHistoricalYear.congestionLevel) /
      lastHistoricalYear.congestionLevel) *
    100;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
          <p className="font-semibold">{`Year: ${data.year}`}</p>
          {data.actualCongestion && (
            <p className="text-blue-600">{`Actual Congestion: ${data.actualCongestion} hrs/yr`}</p>
          )}
          {data.predictedCongestion && (
            <p className="text-orange-600">{`Predicted Congestion: ${data.predictedCongestion.toFixed(
              1
            )} hrs/yr`}</p>
          )}
          <p className="text-gray-600">{`Population Density: ${data.populationDensity.toFixed(
            1
          )} /sq km`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-orange-500" />
          Future Congestion Predictions
        </CardTitle>
        <CardDescription>
          Projected traffic congestion for {stateName} based on population growth trends
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Key Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700 mb-1">Current (2024)</p>
              <p className="text-2xl font-bold text-blue-900">
                {lastHistoricalYear.congestionLevel} hrs
              </p>
              <p className="text-xs text-blue-600 mt-1">Annual delay per commuter</p>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <p className="text-sm text-orange-700 mb-1">Predicted ({lastPrediction.year})</p>
              <p className="text-2xl font-bold text-orange-900">
                {lastPrediction.predictedCongestion.toFixed(1)} hrs
              </p>
              <p className="text-xs text-orange-600 mt-1">Annual delay per commuter</p>
            </div>

            <div
              className={`p-4 rounded-lg border ${congestionChange > 0
                  ? 'bg-red-50 border-red-200'
                  : 'bg-green-50 border-green-200'
                }`}
            >
              <p
                className={`text-sm mb-1 ${congestionChange > 0 ? 'text-red-700' : 'text-green-700'
                  }`}
              >
                Expected Change
              </p>
              <p
                className={`text-2xl font-bold ${congestionChange > 0 ? 'text-red-900' : 'text-green-900'
                  }`}
              >
                {congestionChange > 0 ? '+' : ''}
                {congestionChange.toFixed(1)}%
              </p>
              <p
                className={`text-xs mt-1 ${congestionChange > 0 ? 'text-red-600' : 'text-green-600'
                  }`}
              >
                Over next 5 years
              </p>
            </div>
          </div>

          {/* Prediction Chart */}
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={combinedData} margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="year"
                label={{ value: 'Year', position: 'bottom' }}
              />
              <YAxis
                label={{
                  value: 'Congestion Level (hours/year)',
                  angle: -90,
                  position: 'insideLeft',
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />

              {/* Historical data */}
              <Line
                type="monotone"
                dataKey="actualCongestion"
                stroke="#3b82f6"
                strokeWidth={3}
                name="Actual Congestion"
                dot={{ fill: '#3b82f6', r: 5 }}
                connectNulls={false}
              />

              {/* Predicted data */}
              <Line
                type="monotone"
                dataKey="predictedCongestion"
                stroke="#f59e0b"
                strokeWidth={3}
                strokeDasharray="5 5"
                name="Predicted Congestion"
                dot={{ fill: '#f59e0b', r: 5 }}
                connectNulls={false}
              />
            </ComposedChart>
          </ResponsiveContainer>

          {/* Detailed Predictions Table */}
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Year</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">
                    Population Density
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">
                    Predicted Congestion
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Change from 2024</th>
                </tr>
              </thead>
              <tbody>
                {predictions.map((pred, index) => {
                  const change =
                    ((pred.predictedCongestion - lastHistoricalYear.congestionLevel) /
                      lastHistoricalYear.congestionLevel) *
                    100;
                  return (
                    <tr key={pred.year} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-2 font-semibold">{pred.year}</td>
                      <td className="px-4 py-2">{pred.populationDensity.toFixed(1)} /sq km</td>
                      <td className="px-4 py-2">
                        {pred.predictedCongestion.toFixed(1)} hours/year
                      </td>
                      <td
                        className={`px-4 py-2 font-semibold ${change > 0 ? 'text-red-600' : 'text-green-600'
                          }`}
                      >
                        {change > 0 ? '+' : ''}
                        {change.toFixed(1)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Warning Notice */}
          {congestionChange > 10 && (
            <div className="flex gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-yellow-900">Significant Increase Expected</p>
                <p className="text-sm text-yellow-700 mt-1">
                  Traffic congestion is projected to increase by over {congestionChange.toFixed(0)}%
                  in the next 5 years. Infrastructure improvements and public transit investments
                  may be needed.
                </p>
              </div>
            </div>
          )}

          {/* Info Note */}
          <div className="flex gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-700">
                <strong>Note:</strong> These predictions are based on linear regression analysis of
                historical data. Actual congestion levels may vary due to policy changes,
                infrastructure improvements, remote work trends, and other factors not captured in
                this model.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
