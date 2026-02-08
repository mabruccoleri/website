import React from 'react';
import { Disc, Play, BarChart3 } from 'lucide-react';
import { AlbumStats } from '../types';
import { CodeBlock } from './CodeBlock';

interface Props {
  data: AlbumStats;
  isEngineerMode: boolean;
}

export const MusicWidget: React.FC<Props> = ({ data, isEngineerMode }) => {
  const jsonResponse = JSON.stringify({
    stream: "1001_albums",
    status: "active",
    current_packet: {
        artist: "Talking Heads",
        album: "Remain in Light"
    }
  }, null, 2);

  if (isEngineerMode) {
     return (
        <div className="h-full bg-white dark:bg-earth-800 rounded-xl border border-earth-200 dark:border-earth-700 p-4 font-mono text-xs flex flex-col justify-between shadow-sm dark:shadow-none transition-colors duration-300">
            <div>
                 <div className="flex items-center gap-2 mb-2 text-clay-500 dark:text-clay-400 border-b border-earth-200 dark:border-earth-700 pb-2">
                    <BarChart3 className="w-4 h-4" />
                    AUDIO_STREAM_DATA
                </div>
                <CodeBlock language="json" code={jsonResponse} />
            </div>
        </div>
     );
  }

  return (
    <div className="bg-white dark:bg-earth-800 text-earth-900 dark:text-earth-100 p-6 rounded-xl border border-earth-200 dark:border-earth-700 relative h-full flex flex-col md:flex-row justify-between md:items-center group tech-border overflow-hidden gap-6 shadow-sm dark:shadow-none transition-colors duration-300">
      
      {/* Background Noise */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-repeat" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")'}}></div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 text-clay-500 dark:text-clay-400 mb-2">
            <Disc className="w-4 h-4 animate-spin-slow" />
            <span className="text-[10px] font-mono uppercase tracking-widest">Audio_Input</span>
        </div>
        <h3 className="text-xl md:text-2xl font-bold leading-tight font-sans text-earth-900 dark:text-white">1001 Albums Generator</h3>
        <p className="text-earth-600 dark:text-earth-400 text-sm mt-1 max-w-md">Exploring the history of music, one album per day.</p>
      </div>

      {/* Stats */}
      <div className="relative z-10 flex gap-8">
        <div>
             <div className="text-3xl font-bold text-clay-600 dark:text-clay-500 font-mono">
                {data.totalListened}
             </div>
             <div className="text-[10px] text-earth-500 uppercase tracking-widest font-mono">Records</div>
        </div>
        <div className="w-px bg-earth-200 dark:bg-earth-700"></div>
        <div>
             <div className="text-3xl font-bold text-moss-600 dark:text-moss-500 font-mono">
                {data.averageRating}
             </div>
             <div className="text-[10px] text-earth-500 uppercase tracking-widest font-mono">Avg Rating</div>
        </div>
      </div>

      {/* The Playing Card */}
      <div className="relative z-10 bg-earth-50 dark:bg-earth-900/80 border border-earth-200 dark:border-earth-600 p-4 rounded flex items-center gap-4 w-full md:w-auto md:min-w-[300px] shadow-sm">
        {/* Fake EQ Visualizer */}
        <div className="flex gap-0.5 items-end h-8 w-8">
            <div className="w-1 bg-moss-600 dark:bg-moss-500 h-3 animate-[pulse_1s_ease-in-out_infinite]"></div>
            <div className="w-1 bg-moss-600 dark:bg-moss-500 h-6 animate-[pulse_1.2s_ease-in-out_infinite]"></div>
            <div className="w-1 bg-moss-600 dark:bg-moss-500 h-4 animate-[pulse_0.8s_ease-in-out_infinite]"></div>
            <div className="w-1 bg-moss-600 dark:bg-moss-500 h-7 animate-[pulse_1.5s_ease-in-out_infinite]"></div>
        </div>
        
        <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
                <Play className="w-3 h-3 text-moss-600 dark:text-moss-500 fill-moss-600 dark:fill-moss-500" />
                <p className="text-[10px] text-moss-600 dark:text-moss-500 font-mono uppercase">Last_Analyzed</p>
            </div>
            <p className="font-bold text-earth-900 dark:text-white truncate text-sm font-sans">{data.recentAlbum}</p>
            <div className="h-1 w-full bg-earth-200 dark:bg-earth-700 mt-2 rounded-full overflow-hidden">
                <div className="h-full bg-clay-500 w-3/4"></div>
            </div>
        </div>
      </div>
    </div>
  );
};