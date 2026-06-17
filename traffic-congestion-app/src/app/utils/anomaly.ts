import { StateData } from '../data/trafficData';

export interface AnomalyInfo {
  year: number;
  change: number;
  zScore: number;
  label: string;
}

export const detectAnomalies = (data: StateData[]): Map<number, AnomalyInfo> => {
  const sorted = [...data].sort((a, b) => a.year - b.year);
  if (sorted.length < 2) return new Map();

  const changes = sorted.slice(1).map((d, i) => ({
    year: d.year,
    change: d.congestionLevel - sorted[i].congestionLevel,
  }));

  const mean = changes.reduce((s, v) => s + v.change, 0) / changes.length;
  const variance = changes.reduce((s, v) => s + (v.change - mean) ** 2, 0) / changes.length;
  const std = Math.sqrt(variance);

  const anomalies = new Map<number, AnomalyInfo>();

  changes.forEach(({ year, change }) => {
    const zScore = std === 0 ? 0 : (change - mean) / std;
    if (Math.abs(zScore) >= 1.8) {
      anomalies.set(year, {
        year,
        change,
        zScore,
        label:
          change < 0
            ? `Unusual drop (${change > -10 ? '' : 'COVID-19 / '}↓${Math.abs(change)} hrs)`
            : `Unusual spike (↑${change} hrs)`,
      });
    }
  });

  return anomalies;
};
