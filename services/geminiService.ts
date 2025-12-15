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

let ai: GoogleGenAI | null = null;

const getAiInstance = () => {
  if (ai) return ai;

  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey.length < 5) {
      console.warn("Gemini API Key is missing or invalid");
      return null;
  }

  try {
    ai = new GoogleGenAI({ apiKey });
    return ai;
  } catch (e) {
    console.error("Failed to initialize Gemini Client", e);
    return null;
  }
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  try {
    const client = getAiInstance();
    if (!client) {
      return "⚠️ No puedo conectar con el servidor de IA. Por favor, asegúrate de que la API Key está configurada correctamente en el archivo .env.";
    }

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    return response.text || "Lo siento, recibí una respuesta vacía.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Ocurrió un error temporal al conectar con el asistente. Por favor, inténtalo de nuevo en unos segundos.";
  }
};