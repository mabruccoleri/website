import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Bike, Wind, Zap, Activity, Mountain, Trophy, Map } from 'lucide-react';
import { CyclingStats, ActivityData } from '../types';
import { CodeBlock } from './CodeBlock';

interface Props {
  data: CyclingStats[];
  isEngineerMode: boolean;
  isDarkMode: boolean;
  totalLifetimeMiles?: number;
  activities?: ActivityData[];
}

export const CyclingWidget: React.FC<Props> = ({ data, isEngineerMode, isDarkMode, totalLifetimeMiles, activities = [] }) => {
  const calculatedTotal = data.reduce((acc, curr) => acc + curr.miles, 0);
  const totalMiles = totalLifetimeMiles || calculatedTotal;
  
  const co2Factor = 0.284;
  const totalCo2 = totalLifetimeMiles 
    ? Math.round(totalLifetimeMiles * co2Factor)
    : data.reduce((acc, curr) => acc + curr.co2SavedKg, 0);

  // Calculate advanced stats
  const stats = useMemo(() => {
    if (!activities.length) return { maxDist: 0, maxElev: 0, countries: 0, maxSpeed: 0 };

    let maxDist = 0;
    let maxElev = 0;
    let maxSpeed = 0;
    const uniqueCountries = new Set<string>();

    activities.forEach(act => {
        // Distance (miles)
        const miles = act.distance * 0.000621371;
        if (miles > maxDist) maxDist = miles;

        // Elevation (feet)
        const elev = act.total_elevation_gain * 3.28084;
        if (elev > maxElev) maxElev = elev;

        // Speed (mph)
        if (act.max_speed) {
            const mph = act.max_speed * 2.23694;
            if (mph > maxSpeed && mph < 70) maxSpeed = mph; // Filter GPS glitches
        }

        // Countries (using timezone as proxy if location_country is missing/null)
        if (act.location_country) {
            uniqueCountries.add(act.location_country);
        } else if (act.timezone) {
            // Rough mapping from timezone to region/country
            const region = act.timezone.split('/')[0];
            if (region) uniqueCountries.add(region);
        }
    });

    return {
        maxDist: Math.round(maxDist),
        maxElev: Math.round(maxElev),
        maxSpeed: Math.round(maxSpeed),
        countries: uniqueCountries.size || 1 // Default to 1 if none found
    };
  }, [activities]);

  const sqlQuery = `SELECT 
  COUNT(DISTINCT country) as countries,
  MAX(distance_miles) as longest_ride,
  MAX(elevation_gain_ft) as max_climb
FROM activities`;

  if (isEngineerMode) {
     return (
        <div className="h-full bg-white dark:bg-earth-800 rounded-xl border border-earth-200 dark:border-earth-700 p-4 font-mono text-xs flex flex-col justify-between shadow-sm dark:shadow-none transition-colors duration-300">
            <div>
                <div className="flex items-center gap-2 mb-2 text-moss-600 dark:text-moss-400 border-b border-earth-200 dark:border-earth-700 pb-2">
                    <Activity className="w-4 h-4" />
                    VELO_TELEMETRY
                </div>
                <CodeBlock language="sql" code={sqlQuery} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-[10px] text-earth-500 dark:text-earth-400">
                <div className="bg-earth-50 dark:bg-earth-900 p-2 rounded border border-earth-200 dark:border-earth-700">
                    <span className="block text-moss-600">LONGEST_RIDE</span>
                    <span className="text-earth-900 dark:text-white font-bold text-lg">{stats.maxDist} mi</span>
                </div>
                <div className="bg-earth-50 dark:bg-earth-900 p-2 rounded border border-earth-200 dark:border-earth-700">
                     <span className="block text-moss-600">MAX_ELEV</span>
                    <span className="text-earth-900 dark:text-white font-bold text-lg">{stats.maxElev} ft</span>
                </div>
            </div>
        </div>
     )
  }

  const tooltipStyle = isDarkMode ? 
    { backgroundColor: '#141a14', border: '1px solid #344032', borderRadius: '4px', fontSize: '12px', fontFamily: 'monospace', color: '#e1e6df' } :
    { backgroundColor: '#ffffff', border: '1px solid #c5d1c2', borderRadius: '4px', fontSize: '12px', fontFamily: 'monospace', color: '#141a14' };

  return (
    <div className="bg-white dark:bg-earth-800 p-6 rounded-xl border border-earth-200 dark:border-earth-700 h-full flex flex-col relative overflow-hidden group hover:border-moss-200 dark:hover:border-moss-900 transition-colors tech-border shadow-sm dark:shadow-none">
      
      {/* HUD Lines */}
      <div className="absolute top-4 right-4 flex gap-1">
         <div className="w-1 h-1 bg-moss-500 rounded-full animate-pulse"></div>
         <div className="w-1 h-1 bg-moss-500/50 rounded-full"></div>
         <div className="w-1 h-1 bg-moss-500/20 rounded-full"></div>
      </div>

      <div className="flex justify-between items-start mb-6 z-10">
        <div>
          <h3 className="text-sm font-bold text-moss-600 dark:text-moss-400 flex items-center gap-2 font-mono tracking-wider uppercase">
            <Bike className="w-4 h-4" />
            Velo_Telemetry
          </h3>
          <p className="text-xs text-earth-500 dark:text-earth-400 mt-2 max-w-[150px] font-sans">
            Advocacy through motion. Reducing carbon emissions one commute at a time.
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-earth-900 dark:text-white font-mono">{totalMiles.toLocaleString()}</div>
          <div className="text-[10px] text-earth-500 uppercase tracking-widest">Lifetime Miles</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6 z-10">
        <div className="bg-earth-50 dark:bg-earth-900/50 rounded p-3 border border-earth-200 dark:border-earth-700/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-1 opacity-20"><Trophy className="w-8 h-8 text-moss-500"/></div>
            <div className="text-[10px] font-bold text-moss-600 uppercase mb-1">Longest Ride</div>
            <div className="text-lg font-bold text-earth-800 dark:text-earth-200 font-mono">{stats.maxDist} <span className="text-xs text-earth-500">mi</span></div>
        </div>
        <div className="bg-earth-50 dark:bg-earth-900/50 rounded p-3 border border-earth-200 dark:border-earth-700/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-1 opacity-20"><Mountain className="w-8 h-8 text-clay-500"/></div>
             <div className="text-[10px] font-bold text-clay-600 uppercase mb-1">Max Climb</div>
            <div className="text-lg font-bold text-earth-800 dark:text-earth-200 font-mono">{stats.maxElev.toLocaleString()} <span className="text-xs text-earth-500">ft</span></div>
        </div>
      </div>

      <div className="flex-1 min-h-[120px] z-10">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis 
                dataKey="year" 
                tick={{fontSize: 10, fill: isDarkMode ? '#605b4d' : '#95907e', fontFamily: 'monospace'}} 
                axisLine={false} 
                tickLine={false} 
            />
            <Tooltip 
              cursor={{fill: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}}
              contentStyle={tooltipStyle}
            />
            <Bar dataKey="miles">
              {data.map((entry, index) => (
                <Cell 
                    key={`cell-${index}`} 
                    fill={index === data.length - 1 
                        ? (isDarkMode ? '#588157' : '#588157') 
                        : (isDarkMode ? '#413e36' : '#d0cdc1')} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};