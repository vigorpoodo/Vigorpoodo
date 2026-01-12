import { GoogleGenAI, Type } from "@google/genai";
import { CameraSettings, CinematicOptions, GeneratedPromptData, LightingSettings, SceneDetails } from "../types";

const initAI = () => {
  if (!process.env.API_KEY) {
    throw new Error("API Key missing");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateCinematicPrompt = async (
  camera: CameraSettings,
  lighting: LightingSettings,
  scene: SceneDetails,
  options: CinematicOptions
): Promise<GeneratedPromptData> => {
  const ai = initAI();
  const model = "gemini-3-flash-preview";

  const systemInstruction = `You are an expert Director of Photography (DP) and Cinematographer. 
  Your task is to translate technical camera coordinates, lighting setups, and artistic preferences into a precise JSON structure for image generation prompts.
  Calculate the precise X,Y,Z coordinates based on the polar coordinates provided (Distance, Azimuth, Elevation).
  
  Coordinate system assumption: Target is at (0,0,0). Y is Up.
  `;

  // Helper to join array or return default
  const joinOpts = (arr: string[], defaultText: string) => 
    (arr && arr.length > 0) ? arr.join(", ") : defaultText;

  const prompt = `
    **Technical Inputs:**
    - Azimuth (Horizontal): ${camera.azimuth} degrees
    - Elevation (Vertical): ${camera.elevation} degrees
    - Distance: ${camera.distance} meters
    - Lens/Focal Length: ${camera.focalLength}mm
    - Roll/Dutch: ${camera.roll} degrees
    
    **Detailed Camera Settings:**
    - Sensor Format: ${camera.sensorFormat} (Controls Field of View characteristics)
    - Aperture: ${camera.aperture} (Controls Depth of Field / Bokeh)
    - Shutter: ${camera.shutterAngle} (Controls Motion Blur characteristic)
    - ISO: ${camera.iso} (Controls Grain structure / Light sensitivity vibe)

    **Lighting Setup:**
    - Key Light Direction: ${lighting.direction} degrees (0=Front, 90=Side, 180=Back)
    - Key Light Height: ${lighting.elevation} degrees
    - Intensity: ${lighting.intensity}%
    - Type: ${lighting.type}
    - Temperature: ${lighting.temperature}

    **Subject & Staging (Use this for consistency):**
    - Number of Characters: ${options.characterCount}
    - Arrangement: ${options.characterArrangement}
    - Character Appearance (Locked): ${scene.characterDescription}
    - Action/Pose (Current): ${scene.characterAction}
    - Scene/Props: ${scene.clothingAndProps} / ${scene.environment}

    **Artistic Inputs:**
    - Theme/Genre: ${joinOpts(options.theme, "General Cinematic")}
    - Composition Rule: ${joinOpts(options.composition, "Standard")}
    - Artist/Director Style: ${joinOpts(options.artistStyle, "Neutral")}
    - Color Grade: ${joinOpts(options.colorGrade, "Standard")}
    - Atmospheric Elements: ${[...options.atmosphere, options.customAtmosphere].filter(Boolean).join(", ")}

    **Task:**
    1. Calculate the cartesian position (x,y,z) of the camera relative to the subject (0,0,0).
    2. Generate a highly detailed descriptive prompt. 
       **CRITICAL:** You must combine the 'Character Appearance' with the 'Action/Pose' and 'Scene' naturally.
       Ensure the visual consistency of the character description provided.
       Describe the lighting precisely based on the angle (e.g., "Rim lighting" if Direction is 135-225).
       Mention depth of field if Aperture is wide (low f-number).
    3. Return strictly JSON.
  `;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      json: {
        type: Type.OBJECT,
        properties: {
          camera: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING },
              lens: { type: Type.STRING },
              settings: {
                type: Type.OBJECT,
                properties: {
                  aperture: { type: Type.STRING },
                  shutter: { type: Type.STRING },
                  iso: { type: Type.STRING },
                  format: { type: Type.STRING },
                }
              },
              position: {
                type: Type.OBJECT,
                properties: { x: { type: Type.NUMBER }, y: { type: Type.NUMBER }, z: { type: Type.NUMBER } },
              },
              rotation: {
                type: Type.OBJECT,
                properties: { pitch: { type: Type.NUMBER }, yaw: { type: Type.NUMBER }, roll: { type: Type.NUMBER } },
              },
              description: { type: Type.STRING },
            },
          },
          subject: {
            type: Type.OBJECT,
            properties: {
              count: { type: Type.STRING },
              arrangement: { type: Type.STRING },
              visuals: { type: Type.STRING },
              action: { type: Type.STRING },
            }
          },
          lighting: { 
            type: Type.OBJECT,
            properties: {
              setup: { type: Type.STRING },
              position: { type: Type.OBJECT, properties: { azimuth: { type: Type.NUMBER }, elevation: { type: Type.NUMBER } } },
              parameters: { type: Type.OBJECT, properties: { intensity: { type: Type.STRING }, temperature: { type: Type.STRING } } }
            }
           },
          artDirection: {
            type: Type.OBJECT,
            properties: { theme: { type: Type.STRING }, style: { type: Type.STRING }, palette: { type: Type.STRING } },
          },
          elements: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
      },
      visualDescription: { type: Type.STRING, description: "A cohesive, poetic natural language prompt optimized for Stable Diffusion or Midjourney" },
    },
  };

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as GeneratedPromptData;
    }
    throw new Error("No response text");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const getAtmosphereSuggestions = async (input: string): Promise<string[]> => {
  if (!input || input.length < 3) return [];
  
  const ai = initAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `The user wants a cinematic atmosphere like "${input}". List 5 distinct, short (1-3 words) related atmospheric visual elements (e.g., "Neon Rain", "Dust Motes"). Return JSON array of strings.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    }
  });

  return JSON.parse(response.text || "[]");
};

export const reverseEngineerImage = async (
  imageBase64: string,
  additionalContext: string
): Promise<GeneratedPromptData> => {
  const ai = initAI();
  const model = "gemini-3-flash-preview";

  const systemInstruction = `You are an expert Director of Photography (DP) and Visual Stylist analyzing a reference image.
  Your task is to "reverse engineer" the photo to deduce the camera settings, lighting, composition, character details, and style used to create it.
  
  Detailed Tasks:
  1. Analyze Perspective: Estimate camera Azimuth, Elevation, Distance.
  2. Estimate Lens/Sensor: Focal length, Aperture (Depth of field), Shutter, ISO.
  3. Analyze Lighting: Direction (0-360), Height, Intensity, Temperature, Type.
  4. **Extract Character & Scene Details:** 
     - Describe the character's physical appearance (hair, face, body type) precisely.
     - Describe clothing and accessories.
     - Describe props and environment.
     - Describe the current action/pose.
  5. Identify artistic elements (Theme, Style, Color, Atmosphere).
  6. Return the standard JSON output AND a 'reconstructedParams' object mapping these to UI controls.
  `;

  const promptParts = [
    {
      inlineData: {
        mimeType: "image/png",
        data: imageBase64,
      },
    },
    {
      text: `Analyze this image.${additionalContext ? ` Context: ${additionalContext}` : ""} 
      Return the standard JSON prompt structure AND the reconstructedParams object so I can replicate this shot with consistency.`
    },
  ];

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      json: {
        type: Type.OBJECT,
        properties: {
          camera: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING },
              lens: { type: Type.STRING },
              settings: {
                type: Type.OBJECT,
                properties: {
                  aperture: { type: Type.STRING },
                  shutter: { type: Type.STRING },
                  iso: { type: Type.STRING },
                  format: { type: Type.STRING },
                }
              },
              position: {
                type: Type.OBJECT,
                properties: { x: { type: Type.NUMBER }, y: { type: Type.NUMBER }, z: { type: Type.NUMBER } },
              },
              rotation: {
                type: Type.OBJECT,
                properties: { pitch: { type: Type.NUMBER }, yaw: { type: Type.NUMBER }, roll: { type: Type.NUMBER } },
              },
              description: { type: Type.STRING },
            },
          },
          subject: {
            type: Type.OBJECT,
            properties: { 
              count: { type: Type.STRING }, 
              arrangement: { type: Type.STRING },
              visuals: { type: Type.STRING },
              action: { type: Type.STRING }
            }
          },
          lighting: { type: Type.STRING },
          artDirection: {
            type: Type.OBJECT,
            properties: { theme: { type: Type.STRING }, style: { type: Type.STRING }, palette: { type: Type.STRING } },
          },
          elements: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
      },
      visualDescription: { type: Type.STRING },
      reconstructedParams: {
        type: Type.OBJECT,
        description: "Estimated parameters for the UI controls",
        properties: {
          camera: {
              type: Type.OBJECT,
              properties: {
                  azimuth: { type: Type.NUMBER },
                  elevation: { type: Type.NUMBER },
                  distance: { type: Type.NUMBER },
                  focalLength: { type: Type.NUMBER },
                  roll: { type: Type.NUMBER },
                  iso: { type: Type.NUMBER },
                  aperture: { type: Type.STRING },
                  shutterAngle: { type: Type.STRING },
                  sensorFormat: { type: Type.STRING },
              }
          },
          lighting: {
              type: Type.OBJECT,
              properties: {
                  direction: { type: Type.NUMBER },
                  elevation: { type: Type.NUMBER },
                  intensity: { type: Type.NUMBER },
                  temperature: { type: Type.STRING },
                  type: { type: Type.STRING },
              }
          },
          scene: {
              type: Type.OBJECT,
              properties: {
                  characterDescription: { type: Type.STRING },
                  characterAction: { type: Type.STRING },
                  clothingAndProps: { type: Type.STRING },
                  environment: { type: Type.STRING },
              }
          },
          options: {
              type: Type.OBJECT,
              properties: {
                  characterCount: { type: Type.STRING },
                  characterArrangement: { type: Type.STRING },
                  themes: { type: Type.ARRAY, items: { type: Type.STRING } },
                  compositions: { type: Type.ARRAY, items: { type: Type.STRING } },
                  styles: { type: Type.ARRAY, items: { type: Type.STRING } },
                  colors: { type: Type.ARRAY, items: { type: Type.STRING } },
                  atmospheres: { type: Type.ARRAY, items: { type: Type.STRING } },
              }
          }
        }
      }
    },
  };

  try {
    const response = await ai.models.generateContent({
      model,
      contents: { parts: promptParts },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as GeneratedPromptData;
    }
    throw new Error("No response text");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
