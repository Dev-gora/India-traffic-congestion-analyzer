import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Trophy } from 'lucide-react';
import { getDataByYear, cityMeta } from '../data/trafficData';

interface RankingTableProps {
  year: number;
  onSelectCity: (city: string) => void;
  selectedCity: string;
}

export const RankingTable: React.FC<RankingTableProps> = ({ year, onSelectCity, selectedCity }) => {
  const yearData = getDataByYear(year).sort((a, b) => b.congestionLevel - a.congestionLevel);

  const medalColors = ['text-yellow-500', 'text-gray-400', 'text-amber-600'];

  const getBar = (value: number, max: number) => (
    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
      <div
        className="h-2 rounded-full transition-all"
        style={{
          width: `${(value / max) * 100}%`,
          backgroundColor: cityMeta[yearData[0]?.state]?.color ?? '#3b82f6',
        }}
      />
    </div>
  );

  const maxCongestion = yearData[0]?.congestionLevel ?? 1;
  const maxDensity = Math.max(...yearData.map(d => d.populationDensity));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          City Congestion Rankings — {year}
        </CardTitle>
        <CardDescription>Click any row to focus on that city</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
                <th className="pb-3 pr-4 font-medium">#</th>
                <th className="pb-3 pr-4 font-medium">City</th>
                <th className="pb-3 pr-6 font-medium">Congestion (hrs/yr)</th>
                <th className="pb-3 pr-6 font-medium hidden md:table-cell">Pop. Density</th>
                <th className="pb-3 font-medium hidden md:table-cell">GDP/capita</th>
              </tr>
            </thead>
            <tbody>
              {yearData.map((d, i) => {
                const color = cityMeta[d.state]?.color ?? '#6b7280';
                const isSelected = d.state === selectedCity;
                return (
                  <tr
                    key={d.state}
                    onClick={() => onSelectCity(d.state)}
                    className={`cursor-pointer border-b dark:border-gray-700 transition-colors ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-950'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <td className="py-3 pr-4">
                      {i < 3 ? (
                        <span className={`text-lg font-bold ${medalColors[i]}`}>
                          {['🥇', '🥈', '🥉'][i]}
                        </span>
                      ) : (
                        <span className="text-gray-400 font-medium">{i + 1}</span>
                      )}
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: color }}
                        />
                        <span className="font-medium">{d.state}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-6">
                      <div className="flex items-center gap-3">
                        <span className="font-bold w-12">{d.congestionLevel}</span>
                        <div className="flex-1 min-w-[80px]">
                          <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="h-2 rounded-full"
                              style={{
                                width: `${(d.congestionLevel / maxCongestion) * 100}%`,
                                backgroundColor: color,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-6 hidden md:table-cell text-gray-600 dark:text-gray-300">
                      <div className="flex items-center gap-3">
                        <span className="w-20">{d.populationDensity.toLocaleString()}/km²</span>
                        <div className="flex-1 min-w-[60px]">
                          <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
                            <div
                              className="h-1.5 rounded-full bg-gray-400"
                              style={{ width: `${(d.populationDensity / maxDensity) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 hidden md:table-cell text-gray-600 dark:text-gray-300">
                      ${d.gdpPerCapita.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
