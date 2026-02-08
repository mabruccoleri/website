import React, { useEffect, useRef, useState } from 'react';
import { Globe as GlobeIcon, Activity, Orbit, Navigation } from 'lucide-react';
import { CodeBlock } from './CodeBlock';

interface Props {
  totalMiles: number;
  isEngineerMode: boolean;
  isDarkMode: boolean;
}

export const GlobeWidget: React.FC<Props> = ({ totalMiles, isEngineerMode, isDarkMode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Interactive State & Refs
  const tooltipRef = useRef<HTMLDivElement>(null);
  const mousePosRef = useRef<{x: number, y: number} | null>(null);
  const isHoveringRef = useRef(false); // To avoid stale closures in animation loop
  const [isHovering, setIsHovering] = useState(false);
  
  const EARTH_CIRCUMFERENCE = 24901;
  const orbits = totalMiles / EARTH_CIRCUMFERENCE;
  const percentage = (orbits % 1) * 100;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mousePosRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
  };

  const handleMouseLeave = () => {
    mousePosRef.current = null;
    isHoveringRef.current = false;
    setIsHovering(false);
  };
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let rotation = 0;
    
    // Globe configuration
    const DOTS_COUNT = 400;
    const RADIUS = 80;
    const DOT_RADIUS = 1.5;
    const dots: { lat: number; lon: number }[] = [];

    // Generate random points on a sphere
    for (let i = 0; i < DOTS_COUNT; i++) {
        // Fibonacci sphere distribution for even spread
        const phi = Math.acos(1 - 2 * (i + 0.5) / DOTS_COUNT);
        const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);
        
        dots.push({
            lat: phi - Math.PI / 2, // -PI/2 to PI/2
            lon: theta // 0 to 2PI
        });
    }

    const render = () => {
        if (!canvas || !ctx) return;
        
        // Resize handling
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        ctx.clearRect(0, 0, rect.width, rect.height);
        
        // Update rotation
        rotation += 0.005;

        // Colors based on mode
        const DOT_COLOR = isDarkMode ? 'rgba(163, 177, 138,' : 'rgba(88, 129, 87,'; // moss-400 vs moss-500
        const ORBIT_COLOR = isDarkMode ? 'rgba(224, 122, 95, 0.3)' : 'rgba(209, 96, 66, 0.3)'; // clay-400 vs clay-500
        const SAT_COLOR = isDarkMode ? '#e07a5f' : '#d16042';

        // Draw Globe Dots
        dots.forEach(dot => {
            const r = RADIUS;
            const x3d = r * Math.cos(dot.lat) * Math.cos(dot.lon + rotation);
            const y3d = r * Math.sin(dot.lat);
            const z3d = r * Math.cos(dot.lat) * Math.sin(dot.lon + rotation);
            
            const perspective = 300;
            const scale = perspective / (perspective - z3d);
            
            const x2d = centerX + x3d * scale;
            const y2d = centerY + y3d * scale;
            
            const alpha = Math.max(0.1, (z3d + r) / (2 * r));
            
            ctx.beginPath();
            ctx.arc(x2d, y2d, DOT_RADIUS * scale, 0, Math.PI * 2);
            ctx.fillStyle = `${DOT_COLOR} ${alpha})`; 
            ctx.fill();
        });

        // Draw Orbit Path
        ctx.beginPath();
        for (let i = 0; i <= 360; i += 5) {
            const rad = (i * Math.PI) / 180;
            const x3d = (RADIUS + 15) * Math.cos(rad + rotation * 0.5);
            const z3d = (RADIUS + 15) * Math.sin(rad + rotation * 0.5);
            const y3d = Math.sin(rad * 2) * 20;

            const perspective = 300;
            const scale = perspective / (perspective - z3d);
            const x2d = centerX + x3d * scale;
            const y2d = centerY + y3d * scale;

            if (z3d > -50) {
                if (i === 0) ctx.moveTo(x2d, y2d);
                else ctx.lineTo(x2d, y2d);
            }
        }
        ctx.strokeStyle = ORBIT_COLOR;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Draw "Me" (Satellite)
        const now = Date.now();
        const satAngle = -now / 1000;
        const satR = RADIUS + 15;
        const satX = satR * Math.cos(satAngle);
        const satZ = satR * Math.sin(satAngle);
        const satY = Math.sin(satAngle * 4) * 20;

        const satScale = 300 / (300 - satZ);
        const satScreenX = centerX + satX * satScale;
        const satScreenY = centerY + satY * satScale;
        const isVisible = satZ < 100;

        // Draw satellite if in front
        if (isVisible) {
             // Pulsing Radar Ring
             const pulsePhase = (now % 2000) / 2000;
             const pulseRadius = (6 * satScale) + (25 * pulsePhase * satScale);
             const pulseAlpha = Math.max(0, 1 - pulsePhase);
             
             ctx.beginPath();
             ctx.arc(satScreenX, satScreenY, pulseRadius, 0, Math.PI * 2);
             ctx.strokeStyle = `rgba(224, 122, 95, ${pulseAlpha * 0.8})`;
             ctx.lineWidth = 1;
             ctx.stroke();

             // Main Body
             ctx.beginPath();
             ctx.arc(satScreenX, satScreenY, 4 * satScale, 0, Math.PI * 2);
             ctx.fillStyle = SAT_COLOR;
             ctx.fill();
             
             // Glow
             ctx.shadowColor = SAT_COLOR;
             ctx.shadowBlur = 10;
             ctx.stroke();
             ctx.shadowBlur = 0;
        }

        // --- Interaction Logic ---
        
        // Update tooltip position to follow satellite (if element exists)
        if (tooltipRef.current) {
            tooltipRef.current.style.transform = `translate(${satScreenX}px, ${satScreenY}px)`;
        }

        // Check collision with mouse
        let shouldHover = false;
        if (mousePosRef.current && isVisible) {
            const dist = Math.sqrt(
                Math.pow(mousePosRef.current.x - satScreenX, 2) + 
                Math.pow(mousePosRef.current.y - satScreenY, 2)
            );
            // Hit radius of 25px
            if (dist < 25) {
                shouldHover = true;
            }
        }

        // Update React state only on change
        if (shouldHover !== isHoveringRef.current) {
            isHoveringRef.current = shouldHover;
            setIsHovering(shouldHover);
        }

        animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
        cancelAnimationFrame(animationFrameId);
    };
  }, [totalMiles, isDarkMode]); // Re-init if totalMiles or theme changes

  if (isEngineerMode) {
    const telemetry = {
        entity: "CYCLIST_01",
        reference_frame: "WGS84",
        orbital_parameters: {
            semimajor_axis: "6378 km + 2m",
            eccentricity: 0.0,
            inclination: "23.5 deg"
        },
        mission_stats: {
            total_distance_miles: totalMiles,
            earth_circums: parseFloat(orbits.toFixed(4)),
            status: "IN_PROGRESS"
        }
    };

    return (
       <div className="h-full bg-white dark:bg-earth-800 rounded-xl border border-earth-200 dark:border-earth-700 p-4 font-mono text-xs flex flex-col justify-between shadow-sm dark:shadow-none transition-colors duration-300">
           <div>
               <div className="flex items-center gap-2 mb-2 text-clay-500 dark:text-clay-400 border-b border-earth-200 dark:border-earth-700 pb-2">
                   <Orbit className="w-4 h-4" />
                   ORBITAL_MECHANICS
               </div>
               <CodeBlock language="json" code={JSON.stringify(telemetry, null, 2)} />
           </div>
       </div>
    );
 }

  return (
    <div 
        ref={containerRef} 
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="bg-white dark:bg-earth-800 p-6 rounded-xl border border-earth-200 dark:border-earth-700 h-full flex flex-col relative overflow-hidden group tech-border shadow-sm dark:shadow-none transition-colors duration-300"
    >
      
      {/* HUD Elements */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <h3 className="text-sm font-bold text-moss-600 dark:text-moss-400 flex items-center gap-2 font-mono tracking-wider uppercase">
            <GlobeIcon className="w-4 h-4" />
            Global_Traverse
        </h3>
      </div>

      <div className="absolute top-4 right-4 z-10 text-right pointer-events-none">
         <div className="text-2xl font-bold text-earth-900 dark:text-white font-mono">{orbits.toFixed(2)}x</div>
         <div className="text-[10px] text-earth-500 uppercase tracking-widest">Earth Circumnavigations</div>
      </div>

      <div className="flex-1 flex items-center justify-center relative min-h-[200px]">
        <canvas ref={canvasRef} className="w-full h-full cursor-crosshair" />
        
        {/* Floating Tooltip - Positioned via Ref */}
        <div 
            ref={tooltipRef}
            className={`absolute top-0 left-0 pointer-events-none transition-opacity duration-200 z-50 ${isHovering ? 'opacity-100' : 'opacity-0'}`}
            style={{ 
                // Initial offset to center above the satellite
                marginTop: '-12px',
                marginLeft: '0px'
            }}
        >
            <div className={`bg-white/90 dark:bg-earth-950/90 backdrop-blur border border-earth-300 dark:border-clay-500/50 text-xs px-3 py-2 rounded shadow-xl transform -translate-x-1/2 -translate-y-full min-w-[180px] ${isDarkMode ? 'text-white' : 'text-earth-900'}`}>
                <div className="flex items-center gap-2 mb-1 border-b border-earth-200 dark:border-earth-800 pb-1">
                    <Navigation className="w-3 h-3 text-clay-500 dark:text-clay-400" />
                    <span className="font-bold font-mono text-clay-500 dark:text-clay-400">STATUS: ORBITING</span>
                </div>
                <div className="space-y-0.5 font-mono text-[10px] text-earth-600 dark:text-earth-300">
                    <div className="flex justify-between">
                        <span>TOTAL MILES:</span>
                        <span className="text-earth-900 dark:text-white">{totalMiles.toLocaleString()} mi</span>
                    </div>
                    <div className="flex justify-between">
                        <span>ORBITS:</span>
                        <span className="text-earth-900 dark:text-white">{orbits.toFixed(4)}</span>
                    </div>
                </div>
                {/* Connector Arrow */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-2 h-2 bg-white/90 dark:bg-earth-950 border-r border-b border-earth-300 dark:border-clay-500/50 rotate-45"></div>
            </div>
        </div>

        {/* Central Data Overlay */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 text-xs font-mono z-10 pointer-events-none">
             <div className="bg-white/80 dark:bg-earth-900/80 backdrop-blur border border-earth-200 dark:border-earth-700 px-3 py-1 rounded text-moss-600 dark:text-moss-300 flex items-center gap-2">
                <Activity className="w-3 h-3" />
                {percentage.toFixed(1)}% to next orbit
             </div>
        </div>
      </div>
    </div>
  );
};