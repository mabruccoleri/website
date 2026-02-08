import React, { useState } from 'react';
import { Map, Navigation, MapPin, Bike, Heart, ZoomOut, Check, Globe } from 'lucide-react';
import { Adventure, CyclingRoute } from '../types';
import { CodeBlock } from './CodeBlock';

interface PinProps {
  adventure: Adventure;
  index: number;
  isZoomed: boolean;
  isMapZoomed: boolean;
  isWishlisted: boolean;
  isJustAdded: boolean;
  onClick: (e: React.MouseEvent, adv: Adventure) => void;
  onClose: () => void;
}

const Pin: React.FC<PinProps> = ({
  adventure: adv,
  index,
  isZoomed,
  isMapZoomed,
  isWishlisted,
  isJustAdded,
  onClick,
  onClose
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Show pulse if map is not zoomed and this pin is not currently being hovered
  const showPulse = !isMapZoomed && !isHovered;

  // Determine styles based on state
  const getPinStyles = () => {
      // Base classes
      let classes = "relative flex items-center justify-center w-6 h-6 rounded-none rotate-45 border border-earth-900 shadow-lg transition-all duration-300 ";
      
      if (adv.type === 'past') {
          if (isZoomed) {
              return classes + "bg-moss-500 scale-125 shadow-[0_0_20px_rgba(88,129,87,0.8)] border-moss-300";
          }
          if (isHovered) {
              return classes + "bg-moss-500 scale-125 shadow-[0_0_20px_rgba(16,185,129,0.6)] border-moss-400";
          }
          return classes + "bg-moss-600 hover:scale-110";
      } else {
          // Future/Wishlist
          if (isJustAdded) {
               return classes + "bg-moss-500 scale-125 shadow-[0_0_15px_rgba(88,129,87,0.8)] border-moss-400";
          }
          if (isWishlisted) {
              return classes + "bg-clay-500 border-clay-400";
          }
          return classes + "bg-earth-600 border-earth-500 hover:scale-110 hover:border-earth-300";
      }
  };

  const pulseColorClass = adv.type === 'past' 
    ? 'bg-moss-500' 
    : (isWishlisted ? 'bg-clay-500' : 'bg-earth-400');

  return (
    <div
        className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-30 hover:z-50 transition-all duration-700 ${isZoomed ? 'z-40' : ''}`}
        style={{ 
            left: `${adv.coordinates.x}%`, 
            top: `${adv.coordinates.y}%`,
            transform: isMapZoomed 
                ? `translate(-50%, -50%) scale(${isZoomed ? 0.6 : 0.4})` 
                : `translate(-50%, -50%) scale(1)`
        }}
        onClick={(e) => onClick(e, adv)}
        onMouseEnter={() => !isMapZoomed && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
    >
        <div className={getPinStyles()}>
            {showPulse && (
                <>
                    <div 
                        className={`absolute inset-0 ${pulseColorClass} rounded-none -z-10 opacity-30 pointer-events-none`}
                        style={{ animation: `ping 3s cubic-bezier(0, 0, 0.2, 1) infinite ${index * 0.4}s` }}
                    ></div>
                    <div 
                        className={`absolute -inset-1 ${pulseColorClass} rounded-none -z-10 opacity-10 blur-[1px] pointer-events-none`}
                        style={{ animation: `pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite ${index * 0.4}s` }}
                    ></div>
                </>
            )}

             {isJustAdded && (
                <div className="absolute -inset-1 bg-moss-500 rounded-none animate-ping opacity-75 pointer-events-none"></div>
            )}

            <div className="-rotate-45">
                {adv.type === 'past' ? (
                    <MapPin className="w-3 h-3 text-white" />
                ) : (
                    isJustAdded ? (
                        <Check className="w-3 h-3 text-white animate-in zoom-in duration-300" />
                    ) : (
                        isWishlisted ? <Heart className="w-3 h-3 text-white fill-current animate-in zoom-in duration-300" /> : <Navigation className="w-3 h-3 text-earth-300" />
                    )
                )}
            </div>
        </div>

        {/* Tooltip */}
        {isHovered && !isMapZoomed && (
            <div className="absolute bottom-full mb-4 left-1/2 transform -translate-x-1/2 w-48 bg-white dark:bg-earth-800 border border-earth-200 dark:border-earth-600 p-3 z-50 animate-in fade-in zoom-in duration-200 pointer-events-none rounded-none tech-border shadow-lg">
                <p className="font-mono font-bold text-moss-600 dark:text-moss-400 text-xs tracking-wider uppercase mb-1">{adv.name}</p>
                <p className="text-[10px] text-earth-600 dark:text-earth-400">
                    {adv.type === 'past' ? '>> ACCESS LOGS' : (isWishlisted ? '>> TRACKED' : '>> ADD TO TRACKER')}
                </p>
            </div>
        )}

        {/* Zoomed Card */}
        {isZoomed && (
            <div className="absolute top-1/2 left-full ml-8 transform -translate-y-1/2 w-80 bg-white/95 dark:bg-earth-900/95 backdrop-blur border border-earth-200 dark:border-earth-600 z-50 text-left cursor-default animate-in fade-in slide-in-from-left-4 duration-500 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="h-40 w-full relative overflow-hidden">
                    <div className="absolute inset-0 bg-moss-900/10 dark:bg-moss-900/20 mix-blend-overlay z-10"></div>
                    {adv.photoUrl && <img src={adv.photoUrl} alt={adv.name} className="w-full h-full object-cover filter contrast-125" />}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white dark:from-earth-900 to-transparent h-12 z-20"></div>
                </div>
                <div className="p-5 border-t border-earth-200 dark:border-earth-700">
                    <h4 className="text-lg font-bold text-moss-600 dark:text-moss-400 font-mono mb-2 uppercase">{adv.name}</h4>
                    <p className="text-earth-700 dark:text-earth-300 leading-relaxed text-xs font-mono mb-4 border-l-2 border-earth-200 dark:border-earth-700 pl-3">
                        "{adv.description}"
                    </p>
                    <button 
                        className="w-full py-2 bg-earth-100 dark:bg-earth-800 hover:bg-earth-200 dark:hover:bg-earth-700 text-earth-900 dark:text-earth-200 border border-earth-200 dark:border-earth-700 text-xs font-mono transition-colors flex items-center justify-center gap-2 uppercase tracking-wide"
                        onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                        }}
                    >
                        [ Close Transmission ]
                    </button>
                </div>
            </div>
        )}
    </div>
  );
};

interface Props {
  adventures: Adventure[];
  routes: CyclingRoute[];
  isEngineerMode: boolean;
}

export const AdventureMap: React.FC<Props> = ({ adventures, routes, isEngineerMode }) => {
  const [activeRoute, setActiveRoute] = useState<string | null>(null);
  const [zoomId, setZoomId] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [justAdded, setJustAdded] = useState<string | null>(null);

  const zoomedAdventure = adventures.find(a => a.id === zoomId);
  const ZOOM_SCALE = 2.5;

  const handlePinClick = (e: React.MouseEvent, adv: Adventure) => {
    e.stopPropagation();
    if (adv.type === 'past') {
      setZoomId(zoomId === adv.id ? null : adv.id);
    } else {
      const next = new Set(wishlist);
      if (next.has(adv.id)) {
        next.delete(adv.id);
      } else {
        next.add(adv.id);
        setJustAdded(adv.id);
        setTimeout(() => setJustAdded(null), 1000);
      }
      setWishlist(next);
    }
  };

  const resetZoom = () => setZoomId(null);

  if (isEngineerMode) {
    const geoJson = {
      type: "FeatureCollection",
      metadata: { source: "Garmin/Strava", projection: "Mercator" },
      features: [
        ...adventures.map(adv => ({
          type: "Feature",
          properties: { id: adv.id, name: adv.name, status: adv.type },
          geometry: { type: "Point", coordinates: [adv.coordinates.x, adv.coordinates.y] }
        }))
      ]
    };
    return (
        <div className="h-full bg-white dark:bg-earth-800 rounded-xl border border-earth-200 dark:border-earth-700 p-4 font-mono text-xs overflow-auto shadow-sm dark:shadow-none transition-colors duration-300">
            <div className="flex items-center gap-2 mb-2 text-moss-600 dark:text-moss-400 border-b border-earth-200 dark:border-earth-700 pb-2">
                <Globe className="w-4 h-4" />
                SPATIAL_DATA_LAYER
            </div>
            <CodeBlock language="json" code={JSON.stringify(geoJson, null, 2)} />
        </div>
    );
  }

  const getPathString = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return '';
    const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    return d;
  };

  return (
    <div className="bg-white dark:bg-earth-900 rounded-xl overflow-hidden border border-earth-200 dark:border-earth-700 relative h-[500px] group tech-border shadow-sm dark:shadow-none transition-colors duration-300">
      
      {/* Map Header Overlay */}
      <div className="absolute top-0 left-0 right-0 p-4 z-20 flex justify-between items-start pointer-events-none">
        <div className="bg-white/90 dark:bg-earth-900/90 backdrop-blur border border-earth-200 dark:border-earth-700 rounded px-3 py-2 pointer-events-auto shadow-sm">
            <h3 className="text-sm font-bold text-earth-900 dark:text-earth-100 flex items-center gap-2 font-mono">
            <Map className="w-4 h-4 text-moss-600 dark:text-moss-500" />
            TERRAIN_VIEW
            </h3>
        </div>

        <div className="flex gap-2 pointer-events-auto">
            {wishlist.size > 0 && (
                <div className="bg-white/90 dark:bg-earth-900/90 backdrop-blur border border-earth-200 dark:border-earth-700 px-3 py-2 rounded flex items-center gap-2 animate-in fade-in slide-in-from-top-4 shadow-sm">
                    <Heart className="w-3 h-3 text-clay-500 fill-clay-500" />
                    <span className="text-xs font-mono text-earth-600 dark:text-earth-300">{wishlist.size} SAVED</span>
                </div>
            )}
        </div>
      </div>

      {zoomId && (
          <button 
            onClick={resetZoom}
            className="absolute bottom-6 right-6 z-20 bg-white dark:bg-earth-800 text-earth-700 dark:text-earth-200 px-4 py-2 rounded border border-earth-300 dark:border-earth-600 hover:border-earth-400 flex items-center gap-2 font-mono text-xs transition-all shadow-xl"
          >
              <ZoomOut className="w-3 h-3" />
              RESET_CAM
          </button>
      )}

      {/* Map Surface */}
      <div 
        className="w-full h-full bg-earth-50 dark:bg-[#151515] relative overflow-hidden transition-all duration-700 cursor-grab active:cursor-grabbing"
        onClick={resetZoom}
      >
        {/* Grid Lines */}
        <div className="absolute inset-0 opacity-10 dark:opacity-20 pointer-events-none" 
             style={{ 
                 backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)', 
                 backgroundSize: '40px 40px',
                 color: 'inherit'
            }}>
        </div>

        <div 
            className="w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
            style={{
                transform: zoomedAdventure 
                    ? `translate(${(50 - zoomedAdventure.coordinates.x) * ZOOM_SCALE}%, ${(50 - zoomedAdventure.coordinates.y) * ZOOM_SCALE}%) scale(${ZOOM_SCALE})`
                    : 'translate(0,0) scale(1)',
                transformOrigin: '50% 50%'
            }}
        >
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full absolute inset-0 pointer-events-none">
            
            {/* Landmasses - Dark Mode: Darker, Light Mode: Beige/Grey */}
            <g className="text-earth-200 dark:text-earth-800 fill-current opacity-100 dark:opacity-60 transition-colors duration-300">
                <path d="M20,20 Q40,10 50,30 T80,30 T90,50 T70,80 T40,70 T20,60 Z" /> 
                <path d="M10,20 Q15,15 25,25 T20,40 Z" />
                <path d="M55,20 Q65,15 75,25 T70,40 Z" />
                <path d="M30,50 Q40,45 45,60 T35,80 Z" />
                <path d="M55,50 Q65,45 70,60 T60,80 Z" />
                <path d="M80,60 Q90,55 95,70 T85,85 Z" />
            </g>

            {/* Cycling Routes */}
            {routes.map((route) => (
                <g key={route.id} 
                    className="pointer-events-auto cursor-pointer"
                    onMouseEnter={() => setActiveRoute(route.id)}
                    onMouseLeave={() => setActiveRoute(null)}
                >
                    {/* Hit area */}
                    <path d={getPathString(route.path)} stroke="transparent" strokeWidth="15" fill="none" />
                    
                    {/* Glowing Effect */}
                    <path 
                        d={getPathString(route.path)} 
                        stroke="#10b981" 
                        strokeWidth={activeRoute === route.id ? "6" : "0"}
                        strokeOpacity={activeRoute === route.id ? "0.3" : "0"}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                        className={`transition-all duration-300 filter blur-md ${activeRoute === route.id ? 'animate-pulse' : ''}`}
                    />

                    {/* Main Line */}
                    <path 
                        d={getPathString(route.path)} 
                        stroke={activeRoute === route.id ? "#34d399" : "#10b981"}
                        strokeWidth={activeRoute === route.id ? 2.5 : 1}
                        strokeDasharray={activeRoute === route.id ? "4 2" : "2 2"}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                        className="transition-all duration-300"
                    >
                        <animate 
                            attributeName="stroke-dashoffset" 
                            from="20" 
                            to="0" 
                            dur={activeRoute === route.id ? "0.5s" : "3s"} 
                            repeatCount="indefinite" 
                        />
                    </path>
                </g>
            ))}
            </svg>

            {/* Pins */}
            {adventures.map((adv, index) => (
                <Pin 
                    key={adv.id}
                    adventure={adv}
                    index={index}
                    isZoomed={zoomId === adv.id}
                    isMapZoomed={!!zoomId}
                    isWishlisted={wishlist.has(adv.id)}
                    isJustAdded={justAdded === adv.id}
                    onClick={handlePinClick}
                    onClose={resetZoom}
                />
            ))}
        </div>
      </div>
      
       {routes.map((route) => (
             activeRoute === route.id && !zoomedAdventure && (
                <div 
                    key={`tooltip-${route.id}`}
                    className="absolute z-50 pointer-events-none transform -translate-y-full -translate-x-1/2 mb-4 bg-white dark:bg-earth-800 border border-earth-200 dark:border-earth-600 text-earth-900 dark:text-white text-xs px-3 py-2 rounded-none shadow-xl font-mono"
                    style={{ 
                        left: `${route.path[0].x}%`, 
                        top: `${route.path[0].y}%`,
                        transform: `translate(-50%, -100%)`
                    }}
                >
                    <div className="flex items-center gap-2 mb-1 border-b border-earth-200 dark:border-earth-700 pb-1">
                        <Bike className="w-3 h-3 text-moss-600 dark:text-moss-400" />
                        <span className="text-moss-600 dark:text-moss-400">{route.name}</span>
                    </div>
                    <div className="text-earth-600 dark:text-earth-400 text-[10px]">{route.stats}</div>
                </div>
             )
        ))}
    </div>
  );
};