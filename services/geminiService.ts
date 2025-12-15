import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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

export const sendMessageToGemini = async (message: string, history: string[] = []): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    
    // Construct a simple prompt with history context if needed, 
    // but for simplicity in this stateless service, we'll just send the current message 
    // combined with the system instruction context implicitly handled by the model config if we were using chat sessions.
    // For single turn requests:
    
    const response = await ai.models.generateContent({
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