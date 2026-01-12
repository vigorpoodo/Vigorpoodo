import React from 'react';
import { CameraSettings, LightingSettings } from '../types';
import { UI_TEXT } from '../constants';

interface Props {
  settings: CameraSettings;
  lighting: LightingSettings;
  characterCount: string;
  arrangement?: string;
  currentLang: 'en' | 'zh';
}

const CameraVisualizer: React.FC<Props> = ({ settings, lighting, characterCount, arrangement, currentLang }) => {
  const t = UI_TEXT[currentLang];
  
  // Scale Factors
  // distance in meters -> pixels
  const camDist = Math.max(50, settings.distance * 30); 
  const lightDist = 220; // Fixed ring for lighting to keep it distinct

  // FOV Cone Width scaling (rough approximation)
  // 50mm = scale 1. 
  // 16mm = scale 3 (wide). 
  // 200mm = scale 0.25 (narrow).
  const fovWidth = Math.min(150, Math.max(10, (50 / settings.focalLength) * 40));

  // Determine subject visual based on count and arrangement
  const renderSubject = () => {
    const boxClass = "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-t from-purple-600 to-purple-400 shadow-[0_0_10px_#a855f7]";
    const charStyle = "w-3 h-8 rounded-sm"; // Slimmer humanoid shape
    
    // 1 Character
    if (characterCount === '1') {
        return <div className={boxClass + " " + charStyle}></div>;
    }

    // 2 Characters
    if (characterCount === '2') {
        if (arrangement?.includes('Face')) {
             // Face to Face (Gap in middle)
             return (
                <div className="relative w-12 h-8 flex justify-between items-center -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                    <div className={`${charStyle} bg-purple-500`}></div>
                    <div className={`${charStyle} bg-purple-500`}></div>
                </div>
             );
        }
        if (arrangement?.includes('Back')) {
             // Back to Back (Touching)
             return (
                <div className="relative w-8 h-8 flex justify-center items-center gap-0.5 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                    <div className={`${charStyle} bg-purple-500`}></div>
                    <div className={`${charStyle} bg-purple-500`}></div>
                </div>
             );
        }
        // Default / Side by Side
        return (
            <div className="relative w-10 h-8 flex justify-center items-center gap-2 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                <div className={`${charStyle} bg-purple-500`}></div>
                <div className={`${charStyle} bg-purple-500`}></div>
            </div>
        );
    }

    // 3+ Characters
    if (characterCount === '3+') {
        if (arrangement?.includes('Triangle')) {
            return (
                <div className="relative w-12 h-12 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                    <div className={`absolute top-0 left-1/2 -translate-x-1/2 ${charStyle} bg-purple-500`}></div>
                    <div className={`absolute bottom-0 left-0 ${charStyle} bg-purple-500`}></div>
                    <div className={`absolute bottom-0 right-0 ${charStyle} bg-purple-500`}></div>
                </div>
            );
        }
        // Linear
        return (
             <div className="relative w-20 h-8 flex justify-between items-center -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                <div className={`${charStyle} bg-purple-500`}></div>
                <div className={`${charStyle} bg-purple-500`}></div>
                <div className={`${charStyle} bg-purple-500`}></div>
            </div>
        );
    }

     // Crowd
     if (characterCount === 'crowd') {
        return (
            <div className="relative w-24 h-16 flex flex-wrap gap-2 justify-center items-center opacity-80 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="w-2 h-4 bg-purple-500 rounded-sm"></div>
                ))}
            </div>
        );
    }
    
    return <div className={boxClass + " " + charStyle}></div>;
  };

  return (
    <div className="w-full h-80 lg:h-96 bg-slate-950 rounded-xl overflow-hidden relative shadow-2xl border border-slate-800">
        
        {/* TITLE */}
        <div className="absolute top-3 left-4 z-10 pointer-events-none">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-900/80 px-2 py-1 rounded backdrop-blur border border-slate-800">{t.visualizerTitle}</h3>
        </div>

        {/* 3D SCENE CONTAINER */}
        <div className="w-full h-full flex items-center justify-center overflow-hidden perspective-800">
            
            {/* WORLD GROUP - Tilted for Isometric View */}
            {/* rotateX(60deg) gives us the floor plane view */}
            <div className="transform-style-3d relative transition-transform duration-500"
                 style={{ transform: 'rotateX(55deg) rotateZ(-45deg) scale(0.7)' }}>

                {/* --- FLOOR --- */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-slate-800 bg-[radial-gradient(circle,rgba(15,23,42,1)_0%,rgba(2,6,23,0.5)_100%)]">
                     {/* Concentric Circles for Distance */}
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150px] h-[150px] border border-slate-800 rounded-full opacity-30"></div>
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-slate-800 rounded-full opacity-30"></div>
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] border border-slate-800 rounded-full opacity-30"></div>
                     
                     {/* Axes */}
                     <div className="absolute top-0 left-1/2 w-px h-full bg-slate-800"></div>
                     <div className="absolute left-0 top-1/2 h-px w-full bg-slate-800"></div>

                     {/* Labels */}
                     <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[20px] font-black text-slate-800 select-none opacity-50">BACK</div>
                     <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[20px] font-black text-slate-800 select-none opacity-50">FRONT</div>
                </div>

                {/* --- SUBJECT --- */}
                <div className="absolute top-1/2 left-1/2 transform-style-3d z-0">
                    <div className="transform -rotate-x-55 rotate-z-45 transition-all duration-300"> {/* Billboard effect to face camera roughly or just stand up */}
                       {renderSubject()}
                    </div>
                    {/* Shadow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-8 bg-black/60 blur-lg rounded-full -z-10"></div>
                </div>

                {/* --- CAMERA RIG --- */}
                <div className="absolute top-1/2 left-1/2 w-0 h-0 transform-style-3d transition-transform duration-500 ease-out z-20"
                     style={{ transform: `rotateZ(${settings.azimuth}deg)` }}>
                    
                    <div className="absolute transform-style-3d origin-left transition-transform duration-500 ease-out"
                         style={{ transform: `translateX(${camDist}px) rotateY(${-settings.elevation}deg)` }}>
                         
                         {/* Connection Line (Ground) */}
                         <div className="absolute right-full top-0 h-px bg-cyan-500/20 w-[600px] origin-right pointer-events-none"></div>

                         {/* Height Drop Line (Visual guide for elevation) */}
                         <div className="absolute top-0 left-0 w-px h-[200px] bg-gradient-to-b from-cyan-500/50 to-transparent origin-top transform -rotate-y-90 rotate-x-90 opacity-50"></div>

                         {/* CAMERA ICON */}
                         <div className="relative transform-style-3d transition-transform duration-300"
                              style={{ transform: `rotateX(${settings.roll}deg)` }}>
                             
                             {/* Body */}
                             <div className="w-12 h-8 bg-cyan-600 border border-cyan-400 rounded flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.4)] relative z-20">
                                 <span className="text-[8px] font-bold text-white">CAM</span>
                             </div>
                             
                             {/* Lens / FOV Cone */}
                             {/* The cone needs to point towards center (Left in this local space) */}
                             <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-r-[60px] border-r-cyan-500/10 border-t-[transparent] border-b-[transparent] z-10 pointer-events-none transition-all duration-300"
                                  style={{
                                      borderTopWidth: `${fovWidth}px`,
                                      borderBottomWidth: `${fovWidth}px`,
                                  }}>
                                  {/* Center ray */}
                                  <div className="absolute right-[-60px] top-[-1px] w-[60px] h-[2px] bg-cyan-400/30"></div>
                             </div>

                             {/* Roll Indicator Ring */}
                             {Math.abs(settings.roll) > 0 && (
                                <div className="absolute -inset-2 border border-dashed border-red-500/50 rounded-full animate-pulse"></div>
                             )}
                         </div>
                    </div>
                </div>

                {/* --- LIGHTING RIG --- */}
                <div className="absolute top-1/2 left-1/2 w-0 h-0 transform-style-3d transition-transform duration-500 ease-out z-30"
                     style={{ transform: `rotateZ(${lighting.direction}deg)` }}>
                    
                    <div className="absolute transform-style-3d origin-left transition-transform duration-500 ease-out"
                         style={{ transform: `translateX(${lightDist}px) rotateY(${-lighting.elevation}deg)` }}>
                         
                         {/* Light Source */}
                         <div className="relative">
                             <div className="w-8 h-8 bg-yellow-400 rounded-full shadow-[0_0_30px_#facc15] flex items-center justify-center border-2 border-yellow-100 z-20 relative">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-800" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                                </svg>
                             </div>
                             
                             {/* Light Ray to Center */}
                             <div className="absolute right-4 top-1/2 -translate-y-1/2 w-[300px] h-[40px] bg-gradient-to-r from-yellow-500/20 to-transparent origin-right transform rotate-180 pointer-events-none blur-sm"
                                  style={{ transform: `translateX(-100%) scaleX(${lighting.intensity / 50})` }}></div>
                         </div>
                    </div>
                </div>

            </div>
        </div>

        {/* HUD OVERLAY - Fixed 2D Elements */}
        <div className="absolute bottom-0 w-full p-3 bg-gradient-to-t from-slate-950 to-transparent flex justify-between items-end pointer-events-none">
            <div className="space-y-1 font-mono text-[10px] text-slate-400">
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full shadow-[0_0_5px_cyan]"></span>
                    <span className="bg-slate-900/50 px-1 rounded backdrop-blur">CAM: {settings.azimuth}° / {settings.elevation}°</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full shadow-[0_0_5px_yellow]"></span>
                    <span className="bg-slate-900/50 px-1 rounded backdrop-blur">LIGHT: {lighting.intensity}%</span>
                </div>
            </div>
            
            {/* Focal Length Visualizer Bar */}
            <div className="w-32">
                <div className="flex justify-between text-[8px] text-slate-500 mb-1">
                    <span>WIDE</span>
                    <span>TELE</span>
                </div>
                <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 transition-all duration-300" style={{ width: `${((settings.focalLength - 12) / (200 - 12)) * 100}%` }}></div>
                </div>
                <div className="text-right text-[8px] text-purple-400 mt-1">{settings.focalLength}mm</div>
            </div>
        </div>

    </div>
  );
};

export default CameraVisualizer;
