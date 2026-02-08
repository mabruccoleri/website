import React, { useState, useEffect } from 'react';
import { Hero } from './components/Hero';
import { CyclingWidget } from './components/CyclingWidget';
import { MusicWidget } from './components/MusicWidget';
import { AdventureMap } from './components/AdventureMap';
import { GlobeWidget } from './components/GlobeWidget';
import { cyclingData, albumStats, adventures, cyclingRoutes } from './data';
import { getIntervalsActivities } from './intervals';
import { ActivityData } from './types';
import { getMusicStats } from './music';
import { Globe, Database, ToggleLeft, ToggleRight, Sun, Moon } from 'lucide-react';
import { ActivityStreamWidget } from './components/ActivityStreamWidget';

const App: React.FC = () => {
  const [isEngineerMode, setIsEngineerMode] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [realTimeCyclingData, setRealTimeCyclingData] = useState(cyclingData);
  const [lifetimeMiles, setLifetimeMiles] = useState(0);
  const [musicStats, setMusicStats] = useState(albumStats);
  const [activities, setActivities] = useState<ActivityData[]>([]);

  // Initialize theme based on preference or default to dark
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Fetch Activity Data on mount
  useEffect(() => {
    const syncActivities = async () => {
      // 1. Get Intervals.icu activities (Detailed history)
      const recentActivities = await getIntervalsActivities();
      if (recentActivities.length > 0) {
        setActivities(recentActivities);
      }

      // 2. Calculate Lifetime Stats from Intervals
      let currentLifetimeMiles = 0;
      if (recentActivities.length > 0) {
          const intervalsSum = recentActivities.reduce((acc, act) => {
              if (act.type === 'Ride' || act.type === 'VirtualRide') {
                  return acc + (act.distance * 0.000621371);
              }
              return acc;
          }, 0);
          currentLifetimeMiles = Math.round(intervalsSum);
      }

      setLifetimeMiles(currentLifetimeMiles);

      // Update Cycling Data Chart (Annual)
      if (recentActivities.length > 0) {
        const currentYear = new Date().getFullYear();
        const co2Factor = 0.284;

        // Calculate current year miles from activities
        const currentYearMiles = recentActivities
            .filter(a => new Date(a.start_date).getFullYear() === currentYear && (a.type === 'Ride' || a.type === 'VirtualRide'))
            .reduce((acc, a) => acc + (a.distance * 0.000621371), 0);

        setRealTimeCyclingData(prevData => {
          const newData = [...prevData];
          const yearIndex = newData.findIndex(d => d.year === currentYear);
          
          const newEntry = {
            year: currentYear,
            miles: Math.round(currentYearMiles),
            co2SavedKg: Math.round(currentYearMiles * co2Factor)
          };

          if (yearIndex >= 0) {
            newData[yearIndex] = newEntry;
          } else {
            newData.push(newEntry);
          }
          return newData;
        });
      }
    };
    syncActivities();
  }, []);

  // Fetch Music Data on mount
  useEffect(() => {
    const syncMusic = async () => {
      const stats = await getMusicStats();
      if (stats) {
        setMusicStats(stats);
      }
    };
    syncMusic();
  }, []);

  // Calculate total miles from data
  const calculatedTotal = realTimeCyclingData.reduce((acc, curr) => acc + curr.miles, 0);
  const totalMiles = lifetimeMiles > 0 ? lifetimeMiles : calculatedTotal;

  return (
    <div className="min-h-screen bg-earth-50 dark:bg-earth-900 text-earth-900 dark:text-earth-100 font-sans selection:bg-moss-500 selection:text-white pb-20 transition-colors duration-300">
      
      {/* Top Navigation Bar */}
      <header className="px-6 py-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white dark:bg-earth-800 rounded flex items-center justify-center border border-earth-200 dark:border-earth-700 tech-border text-earth-900 dark:text-white shadow-sm">
            <span className="font-mono font-bold text-moss-600 dark:text-moss-400">MB</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold tracking-tight text-lg leading-none text-earth-900 dark:text-earth-50">Marcus A. Bruccoleri</span>
            <span className="text-xs font-mono text-earth-500 dark:text-earth-400">Senior Data Engineer // Adventurer</span>
          </div>
        </div>

        <div className="flex gap-2 md:gap-4">
            <a 
                href="https://open.spotify.com/user/31skxlpq3ph6eetzqx5vbxvfjrvm?si=40b7f55171364876"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded border border-earth-200 dark:border-earth-700 hover:border-moss-500 bg-white dark:bg-earth-800 text-earth-600 dark:text-earth-300 hover:text-moss-600 dark:hover:text-moss-400 transition-colors"
                title="Spotify Profile"
            >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.019.6-1.139 4.44-1.32 9.9-.6 13.74 1.74.421.18.6.78.3 1.26zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.4-1.02 15.66 1.44.539.3.66.96.359 1.5-.24.54-.9.72-1.44.42z"/>
                </svg>
            </a>

            <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="flex items-center justify-center w-10 h-10 rounded border border-earth-200 dark:border-earth-700 hover:border-moss-500 bg-white dark:bg-earth-800 text-earth-600 dark:text-earth-300 hover:text-moss-600 dark:hover:text-moss-400 transition-colors"
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button 
                onClick={() => setIsEngineerMode(!isEngineerMode)}
                className="group flex items-center gap-3 bg-white dark:bg-earth-800/50 px-4 py-2 rounded border border-earth-200 dark:border-earth-700 hover:border-moss-500 transition-colors shadow-sm"
            >
                <span className="text-xs font-mono uppercase tracking-widest text-earth-500 dark:text-earth-400 group-hover:text-moss-600 dark:group-hover:text-moss-400 hidden md:inline">
                    View_Mode: {isEngineerMode ? 'Engineer' : 'Human'}
                </span>
                {isEngineerMode ? <ToggleRight className="w-5 h-5 text-moss-600 dark:text-moss-400" /> : <ToggleLeft className="w-5 h-5 text-earth-400" />}
            </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[minmax(180px,auto)]">
            
            {/* Hero / Identity - Spans 8 cols */}
            <div className="md:col-span-8 md:row-span-2">
                <Hero isEngineerMode={isEngineerMode} />
            </div>

            {/* Global Impact / Globe - Spans 4 cols */}
            <div className="md:col-span-4 md:row-span-1">
                <GlobeWidget totalMiles={totalMiles} isEngineerMode={isEngineerMode} isDarkMode={isDarkMode} />
            </div>

            {/* Cycling Metrics (Charts) - Spans 4 cols */}
            <div className="md:col-span-4 md:row-span-1">
                <CyclingWidget 
                    data={realTimeCyclingData} 
                    isEngineerMode={isEngineerMode} 
                    isDarkMode={isDarkMode} 
                    totalLifetimeMiles={totalMiles}
                    activities={activities}
                />
            </div>

            {/* Activity Stream - Spans 12 cols */}
            <div className="md:col-span-12 md:row-span-2">
                <ActivityStreamWidget 
                  activities={activities} 
                  isEngineerMode={isEngineerMode} 
                />
            </div>

             {/* Music / Culture - Spans 12 cols */}
            <div className="md:col-span-12 md:row-span-1">
                <MusicWidget data={musicStats} isEngineerMode={isEngineerMode} />
            </div>

        </div>
      </main>

      {/* System Status Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-earth-950/90 backdrop-blur border-t border-earth-200 dark:border-earth-800 py-2 px-6 text-[10px] font-mono text-earth-500 flex justify-between items-center z-50">
        <div className="flex gap-6">
            <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-moss-500 animate-pulse"></span>
                SYSTEM: ONLINE
            </span>
            <span className="flex items-center gap-2">
                <Globe className="w-3 h-3" />
                LOC: BROOKLYN_NY (40.7128° N, 74.0060° W)
            </span>
            <span className="hidden md:flex items-center gap-2">
                <Database className="w-3 h-3" />
                DW_CONN: ACTIVE
            </span>
        </div>
        <div className="flex items-center gap-2">
            <span>V 2.1.0</span>
            <span className="uppercase opacity-50">© 2025 Marcus A. Bruccoleri</span>
        </div>
      </footer>
    </div>
  );
};

export default App;