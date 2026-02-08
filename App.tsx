import React, { useState, useEffect } from 'react';
import { Hero } from './components/Hero';
import { CyclingWidget } from './components/CyclingWidget';
import { MusicWidget } from './components/MusicWidget';
import { AdventureMap } from './components/AdventureMap';
import { GlobeWidget } from './components/GlobeWidget';
import { cyclingData, albumStats, adventures, cyclingRoutes } from './data';
import { getStravaStats } from './strava';
import { Globe, Database, ToggleLeft, ToggleRight, Sun, Moon } from 'lucide-react';

const App: React.FC = () => {
  const [isEngineerMode, setIsEngineerMode] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [realTimeCyclingData, setRealTimeCyclingData] = useState(cyclingData);

  // Initialize theme based on preference or default to dark
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Fetch Strava Data on mount
  useEffect(() => {
    const syncStrava = async () => {
      const stats = await getStravaStats();
      if (stats) {
        const currentYear = new Date().getFullYear();
        const co2Factor = 0.284; // kg CO2 saved per mile

        setRealTimeCyclingData(prevData => {
          const newData = [...prevData];
          const yearIndex = newData.findIndex(d => d.year === currentYear);
          
          const newEntry = {
            year: currentYear,
            miles: stats.miles,
            co2SavedKg: Math.round(stats.miles * co2Factor)
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
    syncStrava();
  }, []);

  // Calculate total miles from data
  const totalMiles = realTimeCyclingData.reduce((acc, curr) => acc + curr.miles, 0);

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
            <div className="md:col-span-4 md:row-span-2">
                <GlobeWidget totalMiles={totalMiles} isEngineerMode={isEngineerMode} isDarkMode={isDarkMode} />
            </div>

            {/* Adventure Map - Spans 8 cols */}
            <div className="md:col-span-8 md:row-span-2">
                <AdventureMap 
                  adventures={adventures} 
                  routes={cyclingRoutes}
                  isEngineerMode={isEngineerMode} 
                />
            </div>

            {/* Cycling Metrics (Charts) - Spans 4 cols */}
            <div className="md:col-span-4 md:row-span-2">
                <CyclingWidget data={realTimeCyclingData} isEngineerMode={isEngineerMode} isDarkMode={isDarkMode} />
            </div>

             {/* Music / Culture - Spans 12 cols */}
            <div className="md:col-span-12 md:row-span-1">
                <MusicWidget data={albumStats} isEngineerMode={isEngineerMode} />
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