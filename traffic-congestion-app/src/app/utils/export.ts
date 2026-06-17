import { StateData, getPeakCongestion, getOffPeakCongestion } from '../data/trafficData';

export const exportToCSV = (data: StateData[], filename: string = 'traffic-data.csv'): void => {
  const headers = [
    'City',
    'Year',
    'Population Density (per sq km)',
    'Avg Congestion (hrs/yr)',
    'Peak Congestion (hrs/yr)',
    'Off-Peak Congestion (hrs/yr)',
    'GDP Per Capita (USD)',
  ];

  const rows = data.map(d => [
    d.state,
    d.year,
    d.populationDensity,
    d.congestionLevel,
    getPeakCongestion(d.state, d.congestionLevel),
    getOffPeakCongestion(d.state, d.congestionLevel),
    d.gdpPerCapita,
  ]);

  const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export const buildShareUrl = (state: string, year: number): string => {
  const url = new URL(window.location.href.split('?')[0]);
  url.searchParams.set('state', state);
  url.searchParams.set('year', String(year));
  return url.toString();
};

export const parseShareUrl = (): { state?: string; year?: number } => {
  const params = new URLSearchParams(window.location.search);
  const state = params.get('state') ?? undefined;
  const yearStr = params.get('year');
  const year = yearStr ? parseInt(yearStr) : undefined;
  return { state, year };
};
