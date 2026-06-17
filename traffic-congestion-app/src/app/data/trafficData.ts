export interface StateData {
  state: string;
  year: number;
  populationDensity: number;
  congestionLevel: number;
  gdpPerCapita: number;
}

export interface CityMetaInfo {
  coordinates: [number, number];
  peakMultiplier: number;
  offPeakMultiplier: number;
  gdp2015: number;
  gdp2024: number;
  color: string;
}

export const cityMeta: Record<string, CityMetaInfo> = {
  "Delhi NCR":  { coordinates: [77.2,  28.6], peakMultiplier: 1.60, offPeakMultiplier: 0.40, gdp2015: 4000, gdp2024: 6200, color: "#3b82f6" },
  "Gurugram":   { coordinates: [77.0,  28.5], peakMultiplier: 1.75, offPeakMultiplier: 0.45, gdp2015: 6500, gdp2024: 9500, color: "#6366f1" },
  "Mumbai":     { coordinates: [72.9,  19.1], peakMultiplier: 1.70, offPeakMultiplier: 0.35, gdp2015: 5500, gdp2024: 8200, color: "#f59e0b" },
  "Bengaluru":  { coordinates: [77.6,  12.9], peakMultiplier: 1.80, offPeakMultiplier: 0.45, gdp2015: 4500, gdp2024: 7800, color: "#ef4444" },
  "Chennai":    { coordinates: [80.3,  13.1], peakMultiplier: 1.50, offPeakMultiplier: 0.40, gdp2015: 3500, gdp2024: 5600, color: "#10b981" },
  "Hyderabad":  { coordinates: [78.5,  17.4], peakMultiplier: 1.60, offPeakMultiplier: 0.40, gdp2015: 3000, gdp2024: 5600, color: "#8b5cf6" },
  "Kolkata":    { coordinates: [88.4,  22.6], peakMultiplier: 1.50, offPeakMultiplier: 0.40, gdp2015: 2500, gdp2024: 3900, color: "#ec4899" },
  "Pune":       { coordinates: [73.9,  18.5], peakMultiplier: 1.55, offPeakMultiplier: 0.42, gdp2015: 3200, gdp2024: 5200, color: "#14b8a6" },
  "Ahmedabad":  { coordinates: [72.6,  23.0], peakMultiplier: 1.45, offPeakMultiplier: 0.38, gdp2015: 2800, gdp2024: 4600, color: "#f97316" },
  "Jaipur":     { coordinates: [75.8,  26.9], peakMultiplier: 1.40, offPeakMultiplier: 0.35, gdp2015: 2000, gdp2024: 3300, color: "#84cc16" },
};

export const getGDPForYear = (state: string, year: number): number => {
  const meta = cityMeta[state];
  if (!meta) return 0;
  const t = (year - 2015) / (2024 - 2015);
  return Math.round(meta.gdp2015 + t * (meta.gdp2024 - meta.gdp2015));
};

export const getPeakCongestion = (state: string, congestionLevel: number): number => {
  const meta = cityMeta[state];
  if (!meta) return congestionLevel;
  return Math.round(congestionLevel * meta.peakMultiplier);
};

export const getOffPeakCongestion = (state: string, congestionLevel: number): number => {
  const meta = cityMeta[state];
  if (!meta) return congestionLevel;
  return Math.round(congestionLevel * meta.offPeakMultiplier);
};

const buildData = (
  state: string,
  rows: [number, number, number][]
): StateData[] =>
  rows.map(([year, populationDensity, congestionLevel]) => ({
    state,
    year,
    populationDensity,
    congestionLevel,
    gdpPerCapita: getGDPForYear(state, year),
  }));

export const trafficData: StateData[] = [
  ...buildData("Delhi NCR", [
    [2015, 11297, 88],
    [2016, 11500, 91],
    [2017, 11750, 95],
    [2018, 12000, 98],
    [2019, 12250, 102],
    [2020, 12500, 75],
    [2021, 12750, 89],
    [2022, 13000, 96],
    [2023, 13200, 105],
    [2024, 13500, 110],
  ]),
  ...buildData("Gurugram", [
    [2015, 3500, 75],
    [2016, 3700, 79],
    [2017, 3900, 84],
    [2018, 4100, 88],
    [2019, 4300, 92],
    [2020, 4400, 65],
    [2021, 4600, 82],
    [2022, 4800, 90],
    [2023, 5000, 95],
    [2024, 5200, 99],
  ]),
  ...buildData("Mumbai", [
    [2015, 20500, 95],
    [2016, 20800, 98],
    [2017, 21000, 101],
    [2018, 21400, 104],
    [2019, 21800, 108],
    [2020, 22000, 80],
    [2021, 22400, 95],
    [2022, 22800, 105],
    [2023, 23200, 112],
    [2024, 23500, 115],
  ]),
  ...buildData("Bengaluru", [
    [2015, 4300, 105],
    [2016, 4500, 110],
    [2017, 4750, 115],
    [2018, 5000, 120],
    [2019, 5250, 125],
    [2020, 5500,  90],
    [2021, 5750, 110],
    [2022, 6000, 128],
    [2023, 6200, 135],
    [2024, 6500, 140],
  ]),
  ...buildData("Chennai", [
    [2015, 14500, 70],
    [2016, 14800, 72],
    [2017, 15100, 75],
    [2018, 15400, 78],
    [2019, 15700, 82],
    [2020, 16000, 60],
    [2021, 16300, 75],
    [2022, 16600, 80],
    [2023, 16800, 85],
    [2024, 17000, 88],
  ]),
  ...buildData("Hyderabad", [
    [2015, 5800, 65],
    [2016, 6100, 68],
    [2017, 6400, 72],
    [2018, 6700, 76],
    [2019, 7000, 80],
    [2020, 7300, 55],
    [2021, 7600, 70],
    [2022, 7900, 78],
    [2023, 8200, 84],
    [2024, 8500, 89],
  ]),
  ...buildData("Kolkata", [
    [2015, 24000, 85],
    [2016, 24200, 87],
    [2017, 24400, 89],
    [2018, 24600, 92],
    [2019, 24800, 95],
    [2020, 25000, 70],
    [2021, 25100, 85],
    [2022, 25200, 90],
    [2023, 25300, 94],
    [2024, 25400, 97],
  ]),
  ...buildData("Pune", [
    [2015, 5600, 78],
    [2016, 5900, 82],
    [2017, 6200, 86],
    [2018, 6500, 90],
    [2019, 6800, 94],
    [2020, 7100, 68],
    [2021, 7400, 85],
    [2022, 7700, 95],
    [2023, 8000, 102],
    [2024, 8300, 108],
  ]),
  ...buildData("Ahmedabad", [
    [2015, 9800,  55],
    [2016, 10100, 58],
    [2017, 10400, 62],
    [2018, 10700, 65],
    [2019, 11000, 70],
    [2020, 11300, 50],
    [2021, 11600, 62],
    [2022, 11900, 68],
    [2023, 12200, 72],
    [2024, 12500, 76],
  ]),
  ...buildData("Jaipur", [
    [2015, 6500, 45],
    [2016, 6800, 48],
    [2017, 7100, 52],
    [2018, 7400, 56],
    [2019, 7700, 60],
    [2020, 8000, 42],
    [2021, 8300, 55],
    [2022, 8600, 62],
    [2023, 8900, 68],
    [2024, 9200, 72],
  ]),
];

export const getStates = (): string[] =>
  Array.from(new Set(trafficData.map(d => d.state))).sort();

export const getYears = (): number[] =>
  Array.from(new Set(trafficData.map(d => d.year))).sort();

export const getDataByState = (state: string): StateData[] =>
  trafficData.filter(d => d.state === state);

export const getDataByYear = (year: number): StateData[] =>
  trafficData.filter(d => d.year === year);

export const getDataByStateAndYear = (state: string, year: number): StateData | undefined =>
  trafficData.find(d => d.state === state && d.year === year);
