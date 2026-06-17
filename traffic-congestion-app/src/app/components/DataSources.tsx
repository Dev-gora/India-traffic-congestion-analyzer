import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ExternalLink, Database, BarChart3, MapPin } from 'lucide-react';

export const DataSources: React.FC = () => {
  const sources = [
    {
      name: 'Census of India',
      description: 'Official population and demographic statistics',
      icon: <Database className="h-5 w-5" />,
      links: [
        {
          title: 'Census Digital Library',
          url: 'https://censusindia.gov.in/',
        },
        {
          title: 'Population Projections',
          url: 'https://idsn.gov.in/wp-content/uploads/2019/07/Population-Projections-Report-2011-2036.pdf',
        },
      ],
    },
    {
      name: 'Ministry of Road Transport and Highways (MoRTH)',
      description: 'Road transport and highway statistics',
      icon: <MapPin className="h-5 w-5" />,
      links: [
        {
          title: 'Road Transport Year Book',
          url: 'https://morth.nic.in/road-transport-year-book',
        },
        {
          title: 'Road Accidents in India',
          url: 'https://morth.nic.in/road-accident-in-india',
        },
      ],
    },
    {
      name: 'TomTom Traffic Index',
      description: 'Real-time traffic congestion levels for Indian cities',
      icon: <BarChart3 className="h-5 w-5" />,
      links: [
        {
          title: 'Bengaluru Traffic',
          url: 'https://www.tomtom.com/traffic-index/bengaluru-traffic/',
        },
        {
          title: 'Mumbai Traffic',
          url: 'https://www.tomtom.com/traffic-index/mumbai-traffic/',
        },
        {
          title: 'New Delhi Traffic',
          url: 'https://www.tomtom.com/traffic-index/new-delhi-traffic/',
        },
      ],
    },
    {
      name: 'NITI Aayog',
      description: 'Policy think tank providing urban planning data',
      icon: <Database className="h-5 w-5" />,
      links: [
        {
          title: 'Reports & Indices',
          url: 'https://www.niti.gov.in/reports-indices',
        },
      ],
    },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Data Sources & References</CardTitle>
        <CardDescription>
          Official sources for population density and traffic congestion data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Important Note */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm font-semibold text-amber-900 mb-2">
              About This Dataset:
            </p>
            <p className="text-sm text-amber-800">
              This application uses <strong>simulated data</strong> based on realistic trends for Indian cities/states.
              For production applications, integrate with the APIs and reports listed below.
            </p>
          </div>

          {/* Data Sources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sources.map((source, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-700">
                    {source.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{source.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{source.description}</p>
                  </div>
                </div>
                <div className="space-y-2 ml-11">
                  {source.links.map((link, linkIndex) => (
                    <a
                      key={linkIndex}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      <ExternalLink className="h-3 w-3" />
                      {link.title}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Implementation Guide */}
          <div className="p-5 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">
              How to Integrate Real Data:
            </h3>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex gap-3">
                <span className="font-bold text-blue-600">1.</span>
                <div>
                  <strong>Population Data:</strong> Use Census India data or projections.
                  Currently, data can be scraped or downloaded as CSVs from government portals.
                </div>
              </div>
              <div className="flex gap-3">
                <span className="font-bold text-blue-600">2.</span>
                <div>
                  <strong>Traffic Data:</strong> Access TomTom or Google Maps Platform APIs for real-time
                  congestion metrics in Indian cities.
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
