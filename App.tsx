import React, { useState, useEffect, useCallback } from 'react';
import { CameraSettings, CinematicOptions, GeneratedPromptData, Language, LightingSettings, SceneDetails } from './types';
import { 
  THEMES, COMPOSITIONS, ARTISTS, COLOR_GRADES, ATMOSPHERES, 
  CAMERA_PRESETS, UI_TEXT, F_STOPS, SHUTTER_ANGLES, SENSOR_FORMATS,
  CHARACTER_COUNTS, CHARACTER_ARRANGEMENTS, LIGHTING_TYPES, LIGHTING_TEMPS
} from './constants';
import CameraVisualizer from './components/CameraVisualizer';
import OptionSelector from './components/OptionSelector';
import { generateCinematicPrompt, getAtmosphereSuggestions, reverseEngineerImage } from './services/geminiService';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('zh'); 
  const [activeMode, setActiveMode] = useState<'generator' | 'reverse'>('generator');
  
  // Track if reverse engineering analysis has completed
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const [camera, setCamera] = useState<CameraSettings>({
    azimuth: 45,
    elevation: 15,
    distance: 4,
    focalLength: 50,
    roll: 0,
    aperture: "f/2.8",
    shutterAngle: "180° (Standard)",
    iso: 800,
    sensorFormat: "Super 35"
  });

  const [lighting, setLighting] = useState<LightingSettings>({
    direction: 45,
    elevation: 45,
    intensity: 80,
    temperature: "Neutral (5600K)",
    type: "Softbox / Diffused"
  });

  const [scene, setScene] = useState<SceneDetails>({
    characterDescription: "", // Extracted
    characterAction: "", // Editable
    clothingAndProps: "",
    environment: ""
  });

  const [options, setOptions] = useState<CinematicOptions>({
    theme: [],
    composition: [],
    artistStyle: [],
    colorGrade: [],
    atmosphere: [],
    customAtmosphere: '',
    characterCount: '1',
    characterArrangement: 'Center Frame'
  });

  const [promptResult, setPromptResult] = useState<GeneratedPromptData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [atmosphereSuggestions, setAtmosphereSuggestions] = useState<string[]>([]);
  
  // Image Upload State
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageContext, setImageContext] = useState('');

  const t = UI_TEXT[lang];

  // Apply a preset
  const applyPreset = (name: string) => {
    const preset = CAMERA_PRESETS[name];
    if (preset) {
      setCamera(prev => ({ 
        ...prev, 
        azimuth: preset.az, 
        elevation: preset.el, 
        distance: preset.dist, 
        focalLength: preset.focal,
        aperture: preset.ap,
        shutterAngle: preset.shut,
        iso: preset.iso,
        sensorFormat: preset.sensor
      }));
    }
  };

  const handleOptionChange = (key: keyof CinematicOptions, val: string[]) => {
    setOptions(prev => ({ ...prev, [key]: val }));
  };

  const handleCountChange = (count: string) => {
    const defaultArrangement = CHARACTER_ARRANGEMENTS[count]?.[0]?.value || "";
    setOptions(prev => ({
        ...prev,
        characterCount: count,
        characterArrangement: defaultArrangement
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setUploadedImage(base64String);
        setHasAnalyzed(false); // Reset analysis state on new upload
        setPromptResult(null); // Clear previous results
      };
      reader.readAsDataURL(file);
    }
  };

  // Randomize Functions
  const randomizeCamera = () => {
    setCamera(prev => ({
      ...prev,
      azimuth: Math.floor(Math.random() * 360),
      elevation: Math.floor(Math.random() * 90) - 30, // -30 to 60 mostly
      distance: 1 + Math.random() * 6,
      focalLength: [16, 24, 35, 50, 85, 135][Math.floor(Math.random() * 6)],
      roll: Math.random() > 0.8 ? Math.floor(Math.random() * 20) - 10 : 0
    }));
  };

  const randomizeLighting = () => {
    setLighting(prev => ({
      ...prev,
      direction: Math.floor(Math.random() * 360),
      elevation: Math.floor(Math.random() * 80) + 10,
      intensity: 50 + Math.floor(Math.random() * 50),
      temperature: LIGHTING_TEMPS[Math.floor(Math.random() * LIGHTING_TEMPS.length)],
      type: LIGHTING_TYPES[Math.floor(Math.random() * LIGHTING_TYPES.length)]
    }));
  };

  const fetchSuggestions = useCallback(async (val: string) => {
    try {
        const suggestions = await getAtmosphereSuggestions(val);
        setAtmosphereSuggestions(suggestions);
    } catch (e) {
        console.error(e);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
        if(options.customAtmosphere.length > 2) {
            fetchSuggestions(options.customAtmosphere);
        }
    }, 800);
    return () => clearTimeout(timer);
  }, [options.customAtmosphere, fetchSuggestions]);

  // STEP 1: Analyze Image (Reverse Mode Only)
  const handleAnalyze = async () => {
    if (!uploadedImage) {
        alert("Please upload an image first.");
        return;
    }
    setIsGenerating(true);
    try {
        const base64Data = uploadedImage.split(',')[1];
        const result = await reverseEngineerImage(base64Data, imageContext);
        setPromptResult(result);
        
        // Populate controls from analysis result
        if (result.reconstructedParams) {
          const p = result.reconstructedParams;
          setCamera(prev => ({ ...prev, ...p.camera }));
          setLighting(prev => ({ ...prev, ...p.lighting }));
          setScene(prev => ({ ...prev, ...p.scene }));
          setOptions(prev => ({
            ...prev,
            characterCount: p.options.characterCount,
            characterArrangement: p.options.characterArrangement,
            theme: p.options.themes || [],
            composition: p.options.compositions || [],
            artistStyle: p.options.styles || [],
            colorGrade: p.options.colors || [],
            atmosphere: p.options.atmospheres || []
          }));
          setHasAnalyzed(true); // Unlock controls
        }
    } catch (error) {
      console.error(error);
      alert("Error analyzing image. Please check your API Key and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // STEP 2: Generate Prompt (Generator Mode OR Reverse Mode after modification)
  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
        // Uses the CURRENT state of controls. 
        // In Reverse Mode, this combines the initial analysis (which populated the state) 
        // with any user modifications.
        const result = await generateCinematicPrompt(camera, lighting, scene, options);
        setPromptResult(result);
    } catch (error) {
      console.error(error);
      alert("Error generating prompt.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-900 selection:text-cyan-100">
      
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-tr from-cyan-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">CP</div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
                    {t.appTitle}
                </h1>
            </div>
            
            <div className="flex items-center gap-4">
                <div className="flex bg-slate-800 rounded-full p-1 border border-slate-700">
                  <button 
                    onClick={() => setActiveMode('generator')}
                    className={`px-3 py-1 text-xs rounded-full transition-all ${activeMode === 'generator' ? 'bg-cyan-900 text-cyan-100 font-bold' : 'text-slate-400 hover:text-white'}`}
                  >
                    {t.tabs.generator}
                  </button>
                  <button 
                    onClick={() => setActiveMode('reverse')}
                    className={`px-3 py-1 text-xs rounded-full transition-all ${activeMode === 'reverse' ? 'bg-purple-900 text-purple-100 font-bold' : 'text-slate-400 hover:text-white'}`}
                  >
                    {t.tabs.reverse}
                  </button>
                </div>
                <button 
                  onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
                  className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold text-cyan-400 hover:bg-slate-700 transition-colors"
                >
                    {lang === 'en' ? '中文' : 'English'}
                </button>
            </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
        
        {/* LEFT COLUMN: VISUALIZER (STICKY) */}
        <div className="lg:col-span-5 h-full">
            <div className="sticky top-24 space-y-4">
                <CameraVisualizer 
                  settings={camera} 
                  lighting={lighting} 
                  characterCount={options.characterCount} 
                  arrangement={options.characterArrangement}
                  currentLang={lang} 
                />
                
                {/* Result Mini-Display (Visual Description Only - keeps user inspired) */}
                {promptResult && (
                    <div className="bg-slate-900/80 p-4 rounded-xl border border-cyan-900/30 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2">
                         <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-2 flex justify-between">
                            {t.naturalPrompt}
                            <button onClick={() => navigator.clipboard.writeText(promptResult.visualDescription)} className="text-slate-400 hover:text-white text-[10px]">{t.copy}</button>
                         </h3>
                         <p className="text-xs text-slate-300 leading-relaxed font-serif italic max-h-40 overflow-y-auto custom-scrollbar">
                            "{promptResult.visualDescription}"
                         </p>
                    </div>
                )}
            </div>
        </div>

        {/* RIGHT COLUMN: SCROLLABLE CONTROLS */}
        <div className="lg:col-span-7 space-y-6 pb-20">
            
            {/* 1. UPLOAD SECTION (Visible Only in Reverse Mode) */}
            {activeMode === 'reverse' && (
              <section className="bg-slate-900/50 p-6 rounded-xl border border-purple-500/30">
                <h2 className="text-sm font-bold text-purple-400 mb-4 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1 h-4 bg-purple-500 rounded-full"></span>
                    {t.upload.title}
                </h2>
                <div className="relative border-2 border-dashed border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center hover:border-purple-500 transition-colors bg-black/20 group">
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  {uploadedImage ? (
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-slate-700">
                      <img src={uploadedImage} alt="Uploaded" className="w-full h-full object-contain bg-black" />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2 text-center text-xs text-white">Click to change image</div>
                    </div>
                  ) : (
                    <div className="text-center">
                        <p className="text-sm text-slate-400">{t.upload.desc}</p>
                    </div>
                  )}
                </div>
                <textarea
                  value={imageContext}
                  onChange={(e) => setImageContext(e.target.value)}
                  placeholder={t.upload.contextPlaceholder}
                  className="w-full mt-4 bg-slate-950 border border-slate-700 rounded p-2 text-sm focus:border-purple-500 focus:outline-none h-20 resize-none"
                />
                
                {/* ANALYZE BUTTON - Step 1 of Reverse Workflow */}
                <button 
                  onClick={handleAnalyze}
                  disabled={isGenerating || !uploadedImage}
                  className={`w-full mt-4 py-3 rounded-lg font-bold tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all ${isGenerating ? 'bg-slate-700' : 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-900/50'}`}
                >
                  {isGenerating ? t.analyzing : (hasAnalyzed ? t.reAnalyze : t.upload.analyzeButton)}
                </button>
              </section>
            )}

            {/* CONTROLS CONTAINER */}
            {/* In Reverse Mode, this section is semi-transparent and disabled until analysis is complete. */}
            <div className={`transition-all duration-500 space-y-6 ${activeMode === 'reverse' && !hasAnalyzed ? 'opacity-40 pointer-events-none grayscale' : 'opacity-100'}`}>

              {/* 2. SUBJECT & STAGING */}
              <section className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                   <h2 className="text-sm font-bold text-green-400 mb-4 uppercase tracking-widest flex items-center gap-2">
                      <span className="w-1 h-4 bg-green-500 rounded-full"></span>
                      {t.sections.subject}
                   </h2>

                   <div className="mb-6 grid grid-cols-1 gap-4">
                       <div className="space-y-1">
                          <label className="text-xs text-slate-400">{t.labels.characterCount}</label>
                          <select 
                              value={options.characterCount}
                              onChange={(e) => handleCountChange(e.target.value)}
                              className="w-full bg-slate-800 border border-slate-700 text-xs rounded p-2 focus:border-green-500 outline-none"
                          >
                              {CHARACTER_COUNTS.map(c => <option key={c.value} value={c.value}>{c.label[lang]}</option>)}
                          </select>
                      </div>
                      
                      <div className="space-y-1">
                          <label className="text-xs text-slate-400">{t.labels.characterArrangement}</label>
                          <div className="w-full bg-slate-800 border border-slate-700 rounded p-2 h-40 overflow-y-auto custom-scrollbar flex flex-col gap-1">
                              {CHARACTER_ARRANGEMENTS[options.characterCount]?.map(a => (
                                  <button
                                      key={a.value}
                                      onClick={() => setOptions(prev => ({...prev, characterArrangement: a.value}))}
                                      className={`
                                          text-left px-3 py-2 text-xs rounded transition-colors
                                          ${options.characterArrangement === a.value 
                                              ? 'bg-green-900/50 text-green-100 border border-green-500/50' 
                                              : 'text-slate-400 hover:bg-slate-700 hover:text-white'}
                                      `}
                                  >
                                      {a.label[lang]}
                                  </button>
                              ))}
                          </div>
                      </div>
                   </div>

                   {/* Director's Notes */}
                   <div className="space-y-4 p-4 bg-slate-950/50 rounded border border-slate-800">
                      <h3 className="text-[10px] font-bold text-slate-500 uppercase">{t.directorNotes}</h3>
                      <div>
                          <label className="text-xs text-slate-500 mb-1 block">{t.charDesc}</label>
                          <textarea 
                              value={scene.characterDescription}
                              onChange={(e) => setScene({...scene, characterDescription: e.target.value})}
                              className={`w-full bg-slate-900 border ${activeMode === 'reverse' && scene.characterDescription ? 'border-green-500/50 text-green-100' : 'border-slate-700'} rounded p-2 text-xs h-16 resize-none focus:outline-none`}
                              placeholder={activeMode === 'reverse' && !hasAnalyzed ? "Waiting for analysis..." : "Character visual details..."}
                          />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                           <div>
                              <label className="text-xs text-slate-500 mb-1 block">{t.charAction}</label>
                              <input type="text" value={scene.characterAction} onChange={(e) => setScene({...scene, characterAction: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs focus:border-green-500 outline-none" />
                           </div>
                           <div>
                              <label className="text-xs text-slate-500 mb-1 block">{t.sceneProps}</label>
                              <input type="text" value={scene.clothingAndProps} onChange={(e) => setScene({...scene, clothingAndProps: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs focus:border-green-500 outline-none" />
                           </div>
                      </div>
                   </div>
              </section>

              {/* 3. CAMERA RIG */}
              <section className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                  <div className="flex justify-between items-center mb-4">
                      <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                          <span className="w-1 h-4 bg-cyan-500 rounded-full"></span>
                          {t.cameraRig}
                      </h2>
                      <div className="flex gap-2">
                          <button onClick={randomizeCamera} className="text-[10px] bg-slate-800 px-2 py-1 rounded hover:bg-cyan-900 text-cyan-500 border border-cyan-900/50">{t.randomize}</button>
                      </div>
                  </div>

                  {/* Presets - Contextually placed, only visible in Generator mode to avoid overriding analysis immediately */}
                  {activeMode === 'generator' && (
                    <div className="mb-6 flex gap-2 overflow-x-auto pb-2 custom-scrollbar border-b border-slate-800">
                        {Object.entries(CAMERA_PRESETS).map(([key, preset]) => (
                            <button key={key} onClick={() => applyPreset(key)} className="px-3 py-1 bg-slate-800 hover:bg-cyan-900 text-[10px] border border-slate-700 hover:border-cyan-500 rounded whitespace-nowrap transition-colors">
                                {preset.label[lang]}
                            </button>
                        ))}
                    </div>
                  )}
                  
                  <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                              <div className="flex justify-between text-xs text-slate-400"><span>{t.orbit}</span><span>{camera.azimuth}°</span></div>
                              <input type="range" min="0" max="360" value={camera.azimuth} onChange={(e) => setCamera({...camera, azimuth: Number(e.target.value)})} className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
                          </div>
                          <div className="space-y-1">
                              <div className="flex justify-between text-xs text-slate-400"><span>{t.angle}</span><span>{camera.elevation}°</span></div>
                              <input type="range" min="-90" max="90" value={camera.elevation} onChange={(e) => setCamera({...camera, elevation: Number(e.target.value)})} className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
                          </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-1">
                              <div className="flex justify-between text-xs text-slate-400"><span>{t.distance}</span><span>{camera.distance}m</span></div>
                              <input type="range" min="1" max="10" step="0.5" value={camera.distance} onChange={(e) => setCamera({...camera, distance: Number(e.target.value)})} className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
                          </div>
                           <div className="space-y-1">
                              <div className="flex justify-between text-xs text-slate-400"><span>{t.dutchAngle}</span><span>{camera.roll}°</span></div>
                              <input type="range" min="-45" max="45" step="1" value={camera.roll} onChange={(e) => setCamera({...camera, roll: Number(e.target.value)})} className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500" />
                          </div>
                      </div>
                      <div className="space-y-1 pt-2">
                          <div className="flex justify-between text-xs text-purple-400 font-bold"><span>{t.focalLength}</span><span>{camera.focalLength}mm</span></div>
                          <input type="range" min="12" max="200" step="1" value={camera.focalLength} onChange={(e) => setCamera({...camera, focalLength: Number(e.target.value)})} className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500" />
                      </div>
                      <div className="grid grid-cols-4 gap-2 pt-2">
                           <div className="space-y-1">
                              <label className="text-[10px] text-slate-500">{t.aperture}</label>
                              <select value={camera.aperture} onChange={(e) => setCamera({...camera, aperture: e.target.value})} className="w-full bg-slate-800 border border-slate-700 text-[10px] rounded p-1.5 focus:border-cyan-500 outline-none">{F_STOPS.map(f => <option key={f} value={f}>{f}</option>)}</select>
                           </div>
                           <div className="space-y-1">
                              <label className="text-[10px] text-slate-500">{t.shutter}</label>
                              <select value={camera.shutterAngle} onChange={(e) => setCamera({...camera, shutterAngle: e.target.value})} className="w-full bg-slate-800 border border-slate-700 text-[10px] rounded p-1.5 focus:border-cyan-500 outline-none">{SHUTTER_ANGLES.map(s => <option key={s} value={s}>{s}</option>)}</select>
                           </div>
                           <div className="space-y-1">
                              <label className="text-[10px] text-slate-500">{t.sensor}</label>
                              <select value={camera.sensorFormat} onChange={(e) => setCamera({...camera, sensorFormat: e.target.value})} className="w-full bg-slate-800 border border-slate-700 text-[10px] rounded p-1.5 focus:border-cyan-500 outline-none">{SENSOR_FORMATS.map(s => <option key={s} value={s}>{s}</option>)}</select>
                           </div>
                           <div className="space-y-1">
                               <label className="text-[10px] text-slate-500">{t.iso} ({camera.iso})</label>
                               <input type="range" min="100" max="6400" step="100" value={camera.iso} onChange={(e) => setCamera({...camera, iso: Number(e.target.value)})} className="w-full h-6 bg-slate-700 rounded appearance-none cursor-pointer accent-yellow-500" />
                           </div>
                      </div>
                  </div>
              </section>

              {/* 4. LIGHTING STUDIO */}
              <section className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                 <div className="flex justify-between items-center mb-4">
                    <h2 className="text-sm font-bold text-yellow-400 uppercase tracking-widest flex items-center gap-2">
                      <span className="w-1 h-4 bg-yellow-500 rounded-full"></span>
                      {t.lightingStudio}
                    </h2>
                    <button onClick={randomizeLighting} className="text-[10px] bg-slate-800 px-2 py-1 rounded hover:bg-yellow-900 text-yellow-500 border border-yellow-900/50">{t.randomize}</button>
                 </div>
                 <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs text-slate-400"><span>{t.lightDir}</span><span>{lighting.direction}°</span></div>
                            <input type="range" min="0" max="360" value={lighting.direction} onChange={(e) => setLighting({...lighting, direction: Number(e.target.value)})} className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"/>
                        </div>
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs text-slate-400"><span>{t.lightHeight}</span><span>{lighting.elevation}°</span></div>
                            <input type="range" min="0" max="90" value={lighting.elevation} onChange={(e) => setLighting({...lighting, elevation: Number(e.target.value)})} className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"/>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <select value={lighting.type} onChange={(e) => setLighting({...lighting, type: e.target.value})} className="bg-slate-800 border border-slate-700 text-xs rounded p-1.5 focus:border-yellow-500 outline-none">
                           {LIGHTING_TYPES.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                        <select value={lighting.temperature} onChange={(e) => setLighting({...lighting, temperature: e.target.value})} className="bg-slate-800 border border-slate-700 text-xs rounded p-1.5 focus:border-yellow-500 outline-none">
                           {LIGHTING_TEMPS.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                    </div>
                 </div>
              </section>

              {/* 5. ARTISTIC CONTROLS */}
              <section className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                  <h2 className="text-sm font-bold text-purple-400 mb-6 uppercase tracking-widest flex items-center gap-2">
                      <span className="w-1 h-4 bg-purple-500 rounded-full"></span>
                      {t.sections.artist}
                  </h2>
                  
                  <OptionSelector title={t.sections.theme} options={THEMES} selected={options.theme} onChange={(val) => handleOptionChange('theme', val)} currentLang={lang} />
                  <OptionSelector title={t.sections.composition} options={COMPOSITIONS} selected={options.composition} onChange={(val) => handleOptionChange('composition', val)} currentLang={lang} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <OptionSelector title={t.sections.color} options={COLOR_GRADES} selected={options.colorGrade} onChange={(val) => handleOptionChange('colorGrade', val)} currentLang={lang} />
                      <OptionSelector title={t.sections.atmosphere} options={ATMOSPHERES} selected={options.atmosphere} onChange={(val) => handleOptionChange('atmosphere', val)} currentLang={lang} />
                  </div>
                  
                  {/* Atmosphere Generator */}
                  <div className="mt-4 relative">
                      <label className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2 block">{t.atmosphereGenerator}</label>
                      <input type="text" value={options.customAtmosphere} onChange={(e) => setOptions({...options, customAtmosphere: e.target.value})} placeholder={t.atmospherePlaceholder} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm focus:border-cyan-500 focus:outline-none" />
                      {atmosphereSuggestions.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2 animate-in fade-in zoom-in duration-300">
                              <span className="text-xs text-slate-500 w-full">{t.aiSuggestions}:</span>
                              {atmosphereSuggestions.map(sugg => (
                                  <button key={sugg} onClick={() => handleOptionChange('atmosphere', [...options.atmosphere, sugg])} className="px-2 py-1 bg-purple-900/30 border border-purple-500/30 rounded text-xs text-purple-200 hover:bg-purple-800/50">+ {sugg}</button>
                              ))}
                          </div>
                      )}
                  </div>
              </section>

            </div>

            {/* ACTION BUTTON (Bottom) */}
            {/* Shows in Generator Mode OR (Reverse Mode AFTER Analysis) */}
            {(activeMode === 'generator' || (activeMode === 'reverse' && hasAnalyzed)) && (
                <button 
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className={`
                        w-full py-4 rounded-xl font-bold text-lg tracking-wider shadow-lg flex items-center justify-center gap-2
                        transition-all duration-300
                        ${isGenerating 
                            ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white shadow-cyan-900/50'}
                    `}
                >
                    {isGenerating ? (
                        <>
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            {t.computing}
                        </>
                    ) : (
                        <>{activeMode === 'reverse' ? t.generateModified : t.generateButton}</>
                    )}
                </button>
            )}

            {/* FINAL RESULTS - JSON OUTPUT */}
            {promptResult && (
                <div className="bg-black p-4 rounded-xl border border-slate-800 overflow-hidden relative group">
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => navigator.clipboard.writeText(JSON.stringify(promptResult.json, null, 2))} className="px-2 py-1 bg-slate-800 text-xs rounded border border-slate-600 hover:bg-slate-700 text-white">{t.copyJson}</button>
                    </div>
                    <h3 className="text-xs font-mono text-purple-400 mb-2">{t.jsonOutput}</h3>
                    <pre className="text-xs font-mono text-green-400 overflow-x-auto p-2 custom-scrollbar">{JSON.stringify(promptResult.json, null, 2)}</pre>
                </div>
            )}

        </div>
      </main>
    </div>
  );
};

export default App;
