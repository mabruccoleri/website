import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ActivityData } from '../types';
import { Activity } from 'lucide-react';

interface Props {
  activities: ActivityData[];
  isEngineerMode: boolean;
}

// 1. Defined Categories & Colors (Harmonious "Retro Earth" Palette)
const CATEGORIES: Record<string, { label: string; color: string; types: string[] }> = {
  Cycling: {
    label: 'Cycling',
    color: '#637d5b', // Muted Green
    types: ['Ride', 'VirtualRide', 'GravelRide', 'MountainBikeRide', 'EBikeRide', 'Velomobile']
  },
  Running: {
    label: 'Running',
    color: '#5f6c7b', // Muted Blue/Slate
    types: ['Run', 'VirtualRun', 'TrailRun']
  },
  Adventure: {
    label: 'Adventure',
    color: '#d4a373', // Sand/Gold
    types: ['Hike', 'Walk', 'AlpineSki', 'BackcountrySki', 'NordicSki', 'Snowshoe', 'IceSkate', 'Kayaking', 'Rowing', 'StandUpPaddling', 'WaterSport', 'OpenWaterSwim', 'Swim']
  },
  Training: {
    label: 'Training',
    color: '#b08968', // Earth Brown
    types: ['WeightTraining', 'Workout', 'Yoga', 'Crossfit', 'Golf', 'Tennis', 'Soccer', 'RockClimbing']
  }
};

// Fallback color for unknowns
const OTHER_COLOR = '#95907e'; // Grey

export const ActivityStreamWidget: React.FC<Props> = ({ activities, isEngineerMode }) => {
  
  // 2. Process Data: Group by Month & Category
  const processedData = useMemo(() => {
    if (!activities.length) return [];

    // Map specific types to broad categories
    const typeToCategory: Record<string, string> = {};
    Object.entries(CATEGORIES).forEach(([catKey, config]) => {
        config.types.forEach(t => typeToCategory[t] = catKey);
    });

    const grouped = activities.reduce((acc, act) => {
      const date = new Date(act.start_date);
      // Format: YYYY-MM
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!acc[key]) {
        acc[key] = { 
            date: key, 
            timestamp: new Date(key + '-01').getTime(), // Force 1st of month for sorting
            total: 0
        };
        // Initialize categories
        Object.keys(CATEGORIES).forEach(c => acc[key][c] = 0);
        acc[key]['Other'] = 0;
      }

      const hours = act.moving_time / 3600;
      const category = typeToCategory[act.type] || 'Other';
      
      acc[key][category] += hours;
      acc[key].total += hours;

      return acc;
    }, {} as Record<string, any>);

    // Sort by date
    let data = Object.values(grouped).sort((a, b) => a.timestamp - b.timestamp);

    // Smooth out the data? (Optional: Moving average or just raw monthly)
    // For "Topographic" look, raw monthly is usually fine if there's enough data.
    return data;
  }, [activities]);

  const activeCategories = useMemo(() => {
      const cats = new Set<string>();
      processedData.forEach(d => {
          Object.keys(CATEGORIES).forEach(c => {
              if (d[c] > 0) cats.add(c);
          });
          if (d.Other > 0) cats.add('Other');
      });
      return Array.from(cats);
  }, [processedData]);

  if (isEngineerMode) {
    return (
      <div className="h-full bg-white dark:bg-earth-800 rounded-xl border border-earth-200 dark:border-earth-700 p-4 font-mono text-xs overflow-auto shadow-sm dark:shadow-none transition-colors duration-300">
        <div className="flex items-center gap-2 mb-4 text-moss-600 dark:text-moss-400 border-b border-earth-200 dark:border-earth-700 pb-2">
            <Activity className="w-4 h-4" />
            ACTIVITY_STREAM_DATA (Monthly)
        </div>
        <table className="w-full text-left">
            <thead>
                <tr className="text-earth-500 border-b border-earth-200 dark:border-earth-700">
                    <th className="pb-2">MONTH</th>
                    {activeCategories.map(c => <th key={c} className="pb-2 uppercase">{c} (h)</th>)}
                </tr>
            </thead>
            <tbody>
                {processedData.slice().reverse().map((row) => (
                    <tr key={row.date} className="border-b border-earth-100 dark:border-earth-800/50">
                        <td className="py-1 text-earth-900 dark:text-earth-300">{row.date}</td>
                        {activeCategories.map(c => (
                            <td key={c} className="py-1" style={{ color: CATEGORIES[c]?.color || OTHER_COLOR }}>
                                {row[c]?.toFixed(1) || '0.0'}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    );
  }

  // Custom Tooltip Component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const date = new Date(label + '-01');
      const formattedDate = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      
      // Calculate total for this slice to show percentages or just ordering
      const total = payload.reduce((sum: number, p: any) => sum + (p.value || 0), 0);

      return (
        <div className="bg-white/95 dark:bg-earth-900/95 backdrop-blur border border-earth-200 dark:border-earth-700 p-3 rounded shadow-xl text-xs">
          <p className="font-bold text-earth-900 dark:text-white mb-2 font-mono border-b border-earth-200 dark:border-earth-800 pb-1">{formattedDate}</p>
          <div className="space-y-1">
            {payload.map((p: any) => (
               p.value > 0 && (
                <div key={p.name} className="flex items-center justify-between gap-4">
                    <span className="flex items-center gap-1.5 text-earth-600 dark:text-earth-300">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }}></span>
                        {p.name}
                    </span>
                    <span className="font-mono font-bold text-earth-900 dark:text-white">
                        {p.value.toFixed(1)}h
                    </span>
                </div>
               )
            ))}
            <div className="pt-1 mt-1 border-t border-earth-100 dark:border-earth-800 flex justify-between gap-4 font-bold">
                <span className="text-earth-500">Total</span>
                <span className="text-earth-900 dark:text-white">{total.toFixed(1)}h</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-earth-800 p-6 rounded-xl border border-earth-200 dark:border-earth-700 h-full flex flex-col relative overflow-hidden group tech-border shadow-sm dark:shadow-none transition-colors duration-300">
      
      <div className="flex justify-between items-start mb-2 z-10">
        <div>
          <h3 className="text-sm font-bold text-moss-600 dark:text-moss-400 flex items-center gap-2 font-mono tracking-wider uppercase">
            <Activity className="w-4 h-4" />
            Energy_Flow
          </h3>
          <p className="text-xs text-earth-500 dark:text-earth-400 mt-1">
            Monthly volume (hours) by category
          </p>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[200px] relative -ml-2">
        {processedData.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center text-earth-400 text-xs font-mono">
                LOADING_DATA...
            </div>
        ) : (
            <ResponsiveContainer width="100%" height="100%">
            <AreaChart
                data={processedData}
                margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
            >
                <defs>
                    <linearGradient id="gradientOverlay" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity={0.1}/>
                        <stop offset="100%" stopColor="#000000" stopOpacity={0.1}/>
                    </linearGradient>
                </defs>
                
                <XAxis 
                    dataKey="date" 
                    tick={{fontSize: 10, fill: '#7a7463', fontFamily: 'monospace'}} 
                    axisLine={false} 
                    tickLine={false}
                    interval="preserveStartEnd"
                    tickFormatter={(str) => {
                        // Only show Year for clarity, or short month if sparse
                        const d = new Date(str + '-01');
                        return d.getMonth() === 0 ? d.getFullYear().toString() : ''; // Only show Jan ticks as Years
                    }}
                />
                
                <Tooltip content={<CustomTooltip />} />
                
                <Legend 
                    iconType="circle"
                    verticalAlign="top" 
                    align="right"
                    wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace', top: -30, right: 0 }}
                />

                {/* Render Areas in specific stack order */}
                {/* We map REVERSE of activeCategories to stack correctly visually if needed, 
                    but standard map works if order in CATEGORIES is bottom-to-top preference */}
                
                {Object.keys(CATEGORIES).map((catKey) => (
                    <Area 
                        key={catKey}
                        type="basis" // The organic, smooth flow
                        dataKey={catKey}
                        stackId="1" 
                        stroke={CATEGORIES[catKey].color}
                        fill={CATEGORIES[catKey].color}
                        strokeWidth={1}
                        fillOpacity={1} // Solid colors like reference
                        animationDuration={1500}
                    />
                ))}
                <Area 
                    type="basis"
                    dataKey="Other"
                    stackId="1"
                    stroke={OTHER_COLOR}
                    fill={OTHER_COLOR}
                    strokeWidth={1}
                    fillOpacity={1}
                />
            </AreaChart>
            </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
