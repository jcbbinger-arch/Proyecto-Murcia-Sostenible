import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `Eres un consultor gastronómico experto y mentor para estudiantes de hostelería en la Región de Murcia. 
Estás ayudando a un equipo de alumnos con su proyecto final "Murcia Sostenible".
Su objetivo es crear un restaurante sostenible.
Tu tono debe ser profesional, alentador, creativo y enfocado en la sostenibilidad y rentabilidad.
Conoces perfectamente las 10 zonas gastronómicas de Murcia (Altiplano, Noroeste, etc.) y sus productos.

Cuando te pregunten:
1. Ofrece ideas concretas basadas en ingredientes locales (Km 0).
2. Ayuda a refinar nombres de platos para que sean atractivos.
3. Sugiere mejoras en la rentabilidad (aprovechamiento, escandallos).
4. No hagas el trabajo por ellos, guíalos para que aprendan.
`;

// Lazy initialization holder
let ai: GoogleGenAI | null = null;

const getAiInstance = () => {
  if (!ai) {
    // We access process.env only when the function is called, not at module level
    // This prevents "process is not defined" errors from crashing the whole app on startup
    try {
      ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    } catch (e) {
      console.error("Failed to initialize Gemini Client", e);
      return null;
    }
  }
  return ai;
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  try {
    const client = getAiInstance();
    if (!client) {
      return "Error de configuración: No se pudo iniciar el asistente de IA.";
    }

    const model = 'gemini-2.5-flash';
    
    const response = await client.models.generateContent({
      model: model,
      contents: message,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    return response.text || "Lo siento, no pude generar una respuesta.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Ocurrió un error al conectar con el asistente virtual.";
  }
};