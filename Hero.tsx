import React from 'react';
import { MapPin, ArrowUpRight, Github, Linkedin, Database, Mountain, Activity } from 'lucide-react';

interface Props {
  isEngineerMode: boolean;
}

export const Hero: React.FC<Props> = ({ isEngineerMode }) => {
  return (
    <div className="h-full bg-white dark:bg-earth-800 rounded-xl overflow-hidden border border-earth-200 dark:border-earth-700 tech-border flex flex-col md:flex-row relative group shadow-sm dark:shadow-none transition-colors duration-300">
        {/* Subtle Background Grid */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
        </div>

        {/* Left: Photo & Key Metrics */}
        <div className="w-full md:w-1/3 bg-earth-50 dark:bg-earth-800/50 p-6 flex flex-col border-b md:border-b-0 md:border-r border-earth-200 dark:border-earth-700 relative z-10 transition-colors duration-300">
            <div className="aspect-square rounded-lg overflow-hidden border border-earth-200 dark:border-earth-600 mb-6 relative shadow-inner">
                <div className="absolute inset-0 bg-moss-500/10 mix-blend-overlay z-10"></div>
                {/* Scanline Effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-moss-500/5 to-transparent h-1/4 w-full animate-scan pointer-events-none z-20"></div>
                <img 
                    src="https://picsum.photos/400/400" 
                    alt="Marcus" 
                    className="w-full h-full object-cover filter grayscale contrast-125"
                />
                
                {/* Overlay Text */}
                <div className="absolute bottom-2 left-2 z-20 font-mono text-[10px] text-white bg-black/60 px-1 rounded backdrop-blur-sm">
                    IMG_ID: 8842_A
                </div>
            </div>

            <div className="space-y-3 font-mono text-xs text-earth-600 dark:text-earth-300">
                <div className="flex justify-between border-b border-earth-200 dark:border-earth-700/50 pb-1">
                    <span>ROLE</span>
                    <span className="text-moss-600 dark:text-moss-400 font-bold">SR. DATA ENG</span>
                </div>
                <div className="flex justify-between border-b border-earth-200 dark:border-earth-700/50 pb-1">
                    <span>ORG</span>
                    <span className="text-earth-900 dark:text-white font-bold">MJFF.org</span>
                </div>
                <div className="flex justify-between border-b border-earth-200 dark:border-earth-700/50 pb-1">
                    <span>STATUS</span>
                    <span className="text-moss-600 dark:text-moss-400 flex items-center gap-1 font-bold">
                        ACTIVE <Activity className="w-3 h-3" />
                    </span>
                </div>
            </div>

            <div className="mt-auto pt-6 flex gap-2">
                <a href="#" className="flex-1 bg-white dark:bg-earth-700 hover:bg-moss-50 dark:hover:bg-moss-600 text-earth-700 dark:text-white py-2 rounded text-center text-xs font-mono transition-colors flex items-center justify-center gap-2 border border-earth-200 dark:border-earth-600 shadow-sm hover:border-moss-400">
                    <Github className="w-3 h-3" /> GITHUB
                </a>
                <a href="https://www.linkedin.com/in/marcus-bruccoleri" target="_blank" className="flex-1 bg-white dark:bg-earth-700 hover:bg-[#0077b5]/10 dark:hover:bg-[#0077b5] text-earth-700 dark:text-white py-2 rounded text-center text-xs font-mono transition-colors flex items-center justify-center gap-2 border border-earth-200 dark:border-earth-600 shadow-sm hover:border-[#0077b5]">
                    <Linkedin className="w-3 h-3" /> LINKEDIN
                </a>
            </div>
        </div>

        {/* Right: Bio & Manifest */}
        <div className="flex-1 p-6 md:p-8 flex flex-col relative z-10 text-earth-900 dark:text-earth-200">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-earth-900 dark:text-white mb-2 font-sans tracking-tight">
                        Manifest<span className="text-moss-600 dark:text-moss-500">.json</span>
                    </h1>
                    <div className="flex items-center gap-2 text-earth-500 dark:text-earth-400 font-mono text-sm">
                         <MapPin className="w-4 h-4" /> Brooklyn, NYC
                    </div>
                </div>
                <div className="hidden md:block text-right">
                    <div className="text-[10px] font-mono text-earth-400 dark:text-earth-500">LAST UPDATE</div>
                    <div className="text-xs font-mono text-moss-600 dark:text-moss-400">2025-05-22</div>
                </div>
            </div>

            <div className="prose prose-sm max-w-none leading-relaxed font-sans text-earth-700 dark:text-earth-200">
                {isEngineerMode ? (
                    <div className="font-mono text-xs md:text-sm bg-earth-50 dark:bg-earth-900/50 p-4 rounded border border-earth-200 dark:border-earth-700 text-earth-600 dark:text-earth-300 shadow-inner">
                        <span className="text-clay-500 dark:text-clay-400">class</span> <span className="text-moss-600 dark:text-yellow-200">Engineer</span>(Human):<br/>
                        &nbsp;&nbsp;<span className="text-clay-500 dark:text-clay-400">def</span> <span className="text-blue-600 dark:text-blue-300">__init__</span>(self):<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;self.stack = [<span className="text-moss-600 dark:text-green-300">"AWS Glue"</span>, <span className="text-moss-600 dark:text-green-300">"PySpark"</span>, <span className="text-moss-600 dark:text-green-300">"Redshift"</span>]<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;self.focus = <span className="text-moss-600 dark:text-green-300">"Data Quality & Identity Resolution"</span><br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;self.mission = <span className="text-moss-600 dark:text-green-300">"Make CRM data trustworthy at scale"</span><br/>
                        <br/>
                        &nbsp;&nbsp;<span className="text-clay-500 dark:text-clay-400">def</span> <span className="text-blue-600 dark:text-blue-300">current_objective</span>(self):<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-600 dark:text-purple-300">return</span> <span className="text-moss-600 dark:text-green-300">"Building clean layers for MJFF"</span>
                    </div>
                ) : (
                    <p>
                        I’m a Senior Data Engineer focused on customer and constituent data quality. I build the standards, pipelines, and analytics layers that make data trustworthy. 
                        Currently tackling data quality at <strong className="text-earth-900 dark:text-white">The Michael J. Fox Foundation</strong>.
                        <br/><br/>
                        But I'm not just my code. I am an <strong className="text-moss-600 dark:text-moss-400">athlete, cyclist, and environmentalist</strong> who believes better data can drive better outcomes for our planet.
                    </p>
                )}
            </div>

            <div className="mt-8 pt-6 border-t border-earth-200 dark:border-earth-700/50 flex flex-wrap gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-earth-100 dark:bg-earth-700/50 rounded text-moss-600 dark:text-moss-400 border border-earth-200 dark:border-earth-600">
                        <Database className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-[10px] font-mono uppercase text-earth-500">Specialty</div>
                        <div className="text-sm font-bold text-earth-900 dark:text-white">Data Quality</div>
                    </div>
                </div>
                <div className="w-px h-10 bg-earth-200 dark:bg-earth-700"></div>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-earth-100 dark:bg-earth-700/50 rounded text-clay-500 dark:text-clay-400 border border-earth-200 dark:border-earth-600">
                        <Mountain className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-[10px] font-mono uppercase text-earth-500">Passion</div>
                        <div className="text-sm font-bold text-earth-900 dark:text-white">Alpinism</div>
                    </div>
                </div>
                 <div className="ml-auto flex items-center">
                    <a href="#" className="text-xs font-mono text-moss-600 dark:text-moss-400 hover:text-earth-900 dark:hover:text-white flex items-center gap-1 transition-colors">
                        DOWNLOAD_RESUME.PDF <ArrowUpRight className="w-3 h-3" />
                    </a>
                </div>
            </div>
        </div>
    </div>
  );
};