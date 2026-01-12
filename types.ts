export interface CameraSettings {
  azimuth: number; // Horizontal angle (0-360)
  elevation: number; // Vertical angle (-90 to 90)
  distance: number; // Distance from subject (1-10)
  focalLength: number; // Lens mm (e.g., 16, 35, 50, 85)
  roll: number; // Dutch angle
  
  // Advanced parameters
  aperture: string; // f-stop (e.g., "f/2.8")
  shutterAngle: string; // Shutter angle/speed (e.g., "180°")
  iso: number; // Film speed
  sensorFormat: string; // Sensor size (e.g., "Full Frame", "IMAX")
}

export interface LightingSettings {
  direction: number; // 0-360 degrees (Clock face)
  elevation: number; // 0-90 degrees
  intensity: number; // 0-100%
  temperature: string; // Warm, Cool, Neutral, Neon
  type: string; // Softbox, Hard Sun, Ring Light, etc.
}

export interface SceneDetails {
  characterDescription: string; // Visuals extracted from image for consistency
  characterAction: string; // User editable action
  clothingAndProps: string; // Specific details
  environment: string; // Scene description
}

export interface CinematicOptions {
  theme: string[];
  composition: string[];
  artistStyle: string[];
  colorGrade: string[];
  atmosphere: string[];
  customAtmosphere: string;
  characterCount: string;
  characterArrangement: string;
}

export interface GeneratedPromptData {
  json: {
    camera: {
      type: string;
      lens: string;
      settings: {
        aperture: string;
        shutter: string;
        iso: string;
        format: string;
      };
      position: { x: number; y: number; z: number };
      rotation: { pitch: number; yaw: number; roll: number };
      description: string;
    };
    subject: {
      count: string;
      arrangement: string;
      visuals: string; // Detailed appearance
      action: string;
    };
    lighting: {
      setup: string;
      position: { azimuth: number; elevation: number };
      parameters: { intensity: string; temperature: string };
    };
    artDirection: {
      theme: string;
      style: string;
      palette: string;
    };
    elements: string[];
  };
  visualDescription: string;
  // New field to map AI analysis back to UI controls
  reconstructedParams?: {
    camera: CameraSettings;
    lighting: LightingSettings;
    scene: SceneDetails;
    options: {
      characterCount: string;
      characterArrangement: string;
      themes: string[];
      compositions: string[];
      styles: string[];
      colors: string[];
      atmospheres: string[];
    }
  };
}

export type Category = 'theme' | 'composition' | 'artistStyle' | 'colorGrade' | 'atmosphere';

export interface OptionItem {
  value: string;
  label: {
    en: string;
    zh: string;
  };
}

export type Language = 'en' | 'zh';
