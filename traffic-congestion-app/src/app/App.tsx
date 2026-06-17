import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Label } from './components/ui/label';
import {
  BarChart3, TrendingUp, Database, Trophy, GitCompare, MapPin,
  Sun, Moon, Share2, Download, Check,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';

import { getStates, getYears, getDataByState } from './data/trafficData';
import { calculateLinearRegression, generateFuturePredictions } from './utils/regression';
import { exportToCSV, buildShareUrl, parseShareUrl } from './utils/export';

import { CongestionChart } from './components/CongestionChart';
import { PredictionPanel } from './components/PredictionPanel';
import { DataSources } from './components/DataSources';
import { RankingTable } from './components/RankingTable';
import { CityComparison } from './components/CityComparison';
import { IndiaMap } from './components/IndiaMap';
import { YearOverYearChart } from './components/YearOverYearChart';
import { GDPCorrelation } from './components/GDPCorrelation';
import { PeakOffPeakChart } from './components/PeakOffPeakChart';
import { InfrastructureSlider } from './components/InfrastructureSlider';

const STATES = getStates();
const YEARS = getYears();

export default function App() {
  const { state: urlState, year: urlYear } = parseShareUrl();

  const [selectedState, setSelectedState] = useState<string>(
    urlState && STATES.includes(urlState) ? urlState : 'Bengaluru'
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    urlYear && YEARS.includes(urlYear) ? urlYear : 2024
  );
  const [darkMode, setDarkMode] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const stateData = useMemo(() => getDataByState(selectedState), [selectedState]);

  const regression = useMemo(() => {
    const densities = stateData.map(d => d.populationDensity);
    const congestions = stateData.map(d => d.congestionLevel);
    return calculateLinearRegression(densities, congestions);
  }, [stateData]);

  const predictions = useMemo(() => generateFuturePredictions(stateData, 5), [stateData]);

  const currentYearData = useMemo(
    () => stateData.find(d => d.year === selectedYear),
    [stateData, selectedYear]
  );

  const handleShare = useCallback(async () => {
    const url = buildShareUrl(selectedState, selectedYear);
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [selectedState, selectedYear]);

  const handleExport = useCallback(() => {
    exportToCSV(stateData, `${selectedState.replace(/\s+/g, '-')}-traffic-data.csv`);
  }, [stateData, selectedState]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-600 rounded-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                  Traffic Density & Congestion Analysis
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
                  India · 10 cities · 2015–2024 historical data
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                title="Copy share link"
                className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Share2 className="h-4 w-4" />}
                <span className="hidden sm:inline">{copied ? 'Copied!' : 'Share'}</span>
              </button>

              <button
                onClick={handleExport}
                title="Export CSV"
                className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export CSV</span>
              </button>

              <button
                onClick={() => setDarkMode(d => !d)}
                title="Toggle dark mode"
                className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          <Card className="dark:bg-gray-900 dark:border-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="dark:text-white">Select City & Year</CardTitle>
              <CardDescription className="dark:text-gray-400">
                Choose a city and year — selection is shared across all tabs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="state-select" className="dark:text-gray-300">City</Label>
                  <Select value={selectedState} onValueChange={setSelectedState}>
                    <SelectTrigger id="state-select" className="dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                      <SelectValue placeholder="Select a city" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                      {STATES.map(state => (
                        <SelectItem key={state} value={state} className="dark:text-white dark:focus:bg-gray-700">
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year-select" className="dark:text-gray-300">Year</Label>
                  <Select
                    value={selectedYear.toString()}
                    onValueChange={v => setSelectedYear(parseInt(v))}
                  >
                    <SelectTrigger id="year-select" className="dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                      <SelectValue placeholder="Select a year" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                      {YEARS.map(year => (
                        <SelectItem key={year} value={year.toString()} className="dark:text-white dark:focus:bg-gray-700">
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {currentYearData && (
                <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-orange-50 dark:from-blue-950 dark:to-orange-950 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    {selectedState} — {selectedYear}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Population Density</p>
                      <p className="text-xl font-bold text-blue-700 dark:text-blue-400">
                        {currentYearData.populationDensity.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-400">people/km²</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Congestion Level</p>
                      <p className="text-xl font-bold text-orange-700 dark:text-orange-400">
                        {currentYearData.congestionLevel}
                      </p>
                      <p className="text-xs text-gray-400">hrs delay/year</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">GDP Per Capita</p>
                      <p className="text-xl font-bold text-green-700 dark:text-green-400">
                        ${currentYearData.gdpPerCapita.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-400">USD (est.)</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">R² Model Fit</p>
                      <p className="text-xl font-bold text-purple-700 dark:text-purple-400">
                        {regression.rSquared.toFixed(3)}
                      </p>
                      <p className="text-xs text-gray-400">
                        {regression.rSquared > 0.8 ? 'Strong' : regression.rSquared > 0.5 ? 'Moderate' : 'Weak'} fit
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 h-auto dark:bg-gray-800">
              {[
                { value: 'overview', icon: <Trophy className="h-3.5 w-3.5" />, label: 'Overview' },
                { value: 'analysis', icon: <BarChart3 className="h-3.5 w-3.5" />, label: 'Analysis' },
                { value: 'predictions', icon: <TrendingUp className="h-3.5 w-3.5" />, label: 'Predictions' },
                { value: 'comparison', icon: <GitCompare className="h-3.5 w-3.5" />, label: 'Compare' },
                { value: 'map', icon: <MapPin className="h-3.5 w-3.5" />, label: 'Map' },
                { value: 'sources', icon: <Database className="h-3.5 w-3.5" />, label: 'Sources' },
              ].map(tab => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex items-center gap-1.5 text-xs sm:text-sm py-2 dark:text-gray-400 dark:data-[state=active]:text-white dark:data-[state=active]:bg-gray-700"
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="overview" className="mt-6 space-y-6">
              <RankingTable
                year={selectedYear}
                selectedCity={selectedState}
                onSelectCity={setSelectedState}
              />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GDPCorrelation year={selectedYear} />
                <PeakOffPeakChart year={selectedYear} onSelectCity={setSelectedState} />
              </div>
            </TabsContent>

            <TabsContent value="analysis" className="mt-6 space-y-6">
              <CongestionChart
                data={stateData}
                regression={regression}
                selectedYear={selectedYear}
                stateName={selectedState}
              />
              <YearOverYearChart data={stateData} stateName={selectedState} />
              <InfrastructureSlider stateData={stateData} stateName={selectedState} />
            </TabsContent>

            <TabsContent value="predictions" className="mt-6">
              <PredictionPanel
                historicalData={stateData}
                predictions={predictions}
                stateName={selectedState}
              />
            </TabsContent>

            <TabsContent value="comparison" className="mt-6">
              <CityComparison />
            </TabsContent>

            <TabsContent value="map" className="mt-6">
              <IndiaMap
                year={selectedYear}
                selectedCity={selectedState}
                onSelectCity={setSelectedState}
              />
            </TabsContent>

            <TabsContent value="sources" className="mt-6">
              <DataSources />
            </TabsContent>
          </Tabs>

          <Card className="bg-gray-50 dark:bg-gray-900 dark:border-gray-800">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">About This Application</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">What's included:</h4>
                    <ul className="space-y-1 list-disc list-inside text-gray-600 dark:text-gray-400">
                      <li>10 major Indian cities, 2015–2024</li>
                      <li>Linear regression & R² model fit</li>
                      <li>5-year congestion forecasts</li>
                      <li>Year-over-year anomaly detection</li>
                      <li>Infrastructure impact simulator</li>
                      <li>GDP correlation & peak/off-peak analysis</li>
                      <li>Interactive India map</li>
                      <li>CSV export & shareable links</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">Methodology:</h4>
                    <ul className="space-y-1 list-disc list-inside text-gray-600 dark:text-gray-400">
                      <li>Least-squares linear regression</li>
                      <li>Z-score anomaly detection (±1.8σ)</li>
                      <li>Time-series density projection</li>
                      <li>GDP interpolated from city-level estimates</li>
                      <li>Peak/off-peak modelled per city type</li>
                    </ul>
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-500 pt-2 border-t dark:border-gray-700">
                  <strong>Disclaimer:</strong> Simulated data for demonstration. Not for production policy use without real data integration.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <p className="text-center text-sm text-gray-500 dark:text-gray-500">
            Traffic Density & Congestion Analysis · React · Recharts · Linear Regression · {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}
