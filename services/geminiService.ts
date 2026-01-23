import { GoogleGenAI } from "@google/genai";

// Use import.meta.env for Vite environment variables
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

export const generateProductDescription = async (
  title: string,
  condition: string,
  category: string,
  details: string
): Promise<string> => {
  if (!apiKey) {
    console.warn("API Key do Gemini não encontrada. Configure VITE_GEMINI_API_KEY no arquivo .env");
    return "Descrição automática indisponível (Chave API ausente).";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `
      Atue como um especialista em moda vintage e curadoria de brechós.
      Escreva uma descrição atraente, vendedora e com estilo "aesthetic" para um produto de brechó online.
      
      Detalhes do produto:
      - Nome: ${title}
      - Categoria: ${category}
      - Condição: ${condition}
      - Detalhes extras: ${details}

      A descrição deve ser em Português do Brasil, ter no máximo 3 parágrafos curtos, enfatizar a sustentabilidade e exclusividade.
      Não use markdown complexo, apenas texto corrido.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    // Fix for potential type mismatch in preview SDK
    const responseText = (response as any).text ? (response as any).text() : (response as any).response?.text();
    return responseText || "Não foi possível gerar a descrição.";
  } catch (error) {
    console.error("Erro ao gerar descrição:", error);
    return "Erro ao conectar com a IA para gerar descrição.";
  }
};