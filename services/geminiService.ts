import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateProductDescription = async (
  title: string,
  condition: string,
  category: string,
  details: string
): Promise<string> => {
  if (!apiKey) return "Descrição automática indisponível (Chave API ausente).";

  try {
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
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Não foi possível gerar a descrição.";
  } catch (error) {
    console.error("Erro ao gerar descrição:", error);
    return "Erro ao conectar com a IA para gerar descrição.";
  }
};