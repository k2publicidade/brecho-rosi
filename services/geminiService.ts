// Serviço de geração de descrições usando OpenRouter API (DeepSeek free)
const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || '';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'deepseek/deepseek-r1-0528:free';

export const generateProductDescription = async (
  title: string,
  condition: string,
  category: string,
  details: string
): Promise<string> => {
  if (!apiKey) {
    return "Descrição automática indisponível. Configure a chave da OpenRouter no arquivo .env para ativar este recurso.";
  }

  try {
    const prompt = `Atue como um especialista em moda vintage e curadoria de brechós do Brechó da Rosi.
Escreva uma descrição atraente, vendedora e com tom acolhedor para um produto de brechó online.

Detalhes do produto:
- Nome: ${title}
- Categoria: ${category}
- Condição: ${condition}
- Detalhes extras: ${details}

IMPORTANTE:
- Use o tom acolhedor do Brechó da Rosi
- Máximo 2 parágrafos curtos
- Em Português do Brasil
- Enfatize: curadoria afetiva, sustentabilidade, peça única
- Use expressões como: "Achado especial!", "Garimpado e aprovado pela Rosi ✓", "Aquele básico que não pode faltar"
- Seja direta e vendedora
- SEM markdown, apenas texto corrido`;

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Brechó da Rosi'
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 300
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const description = data.choices?.[0]?.message?.content;

    if (!description) {
      throw new Error('Nenhuma descrição gerada');
    }

    return description.trim();
  } catch (error) {
    console.error("Erro ao gerar descrição:", error);
    return "Erro ao conectar com a IA para gerar descrição. Verifique sua chave de API.";
  }
};