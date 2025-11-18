import { GoogleGenAI, Type } from "@google/genai";
import type { Recipe, StorageTip, UserProfile, GeneratedDietPlan } from '../types';
import { DAYS_OF_WEEK, MEAL_TIMES, MEAL_TIME_CONFIG } from "../constants";
import { FALLBACK_RECIPES, FALLBACK_TIPS, buildFallbackDietPlan } from "../sampleData";

const apiKey =
  import.meta.env?.VITE_GEMINI_API_KEY ||
  (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY ?? process.env?.API_KEY : undefined);

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const recipeSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      recipeName: {
        type: Type.STRING,
        description: 'O nome da receita.',
      },
      ingredients: {
        type: Type.ARRAY,
        items: {
          type: Type.STRING,
        },
        description: 'Uma lista dos ingredientes necessários para a receita.',
      },
      steps: {
        type: Type.STRING,
        description: 'As instruções passo a passo para preparar a receita, com cada passo em uma nova linha.',
      },
    },
    required: ["recipeName", "ingredients", "steps"],
  },
};

const storageTipSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      foodItem: {
        type: Type.STRING,
        description: 'O nome do alimento.',
      },
      tip: {
        type: Type.STRING,
        description: 'Uma dica concisa e prática sobre como armazenar o alimento para maximizar a frescura, incluindo sugestões de porcionamento.',
      },
    },
    required: ["foodItem", "tip"],
  },
};

export const generateRecipes = async (ingredients: string[]): Promise<Recipe[]> => {
  if (!ai) {
    console.warn("Gemini API key não encontrada. Usando receitas padrão.");
    return FALLBACK_RECIPES;
  }

  try {
    const prompt = `Com base nos seguintes ingredientes: ${ingredients.join(', ')}, gere 5 ideias de receitas saudáveis e simples, adequadas para marmitas e planejamento semanal. Formate a resposta como um JSON.`;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: recipeSchema,
      },
    });

    const jsonText = response.text().trim();
    const recipes = JSON.parse(jsonText);
    return recipes as Recipe[];
  } catch (error) {
    console.error("Error generating recipes:", error);
    return FALLBACK_RECIPES;
  }
};

export const generateStorageTips = async (ingredients: string[]): Promise<StorageTip[]> => {
  if (!ai) {
    console.warn("Gemini API key não encontrada. Usando dicas padrão.");
    return FALLBACK_TIPS;
  }

  try {
    const prompt = `Para os seguintes alimentos: ${ingredients.join(', ')}, forneça dicas ideais de armazenamento para maximizar a frescura e facilitar o preparo de refeições durante a semana. Inclua dicas sobre porcionamento. Formate a resposta como um JSON.`;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: storageTipSchema,
      },
    });

    const jsonText = response.text().trim();
    const tips = JSON.parse(jsonText);
    return tips as StorageTip[];
  } catch (error) {
    console.error("Error generating storage tips:", error);
    return FALLBACK_TIPS;
  }
};

export const generateDietPlan = async (profiles: UserProfile[], ingredients: string[]): Promise<GeneratedDietPlan> => {
  if (!ai) {
    console.warn("Gemini API key não encontrada. Usando plano alimentar padrão.");
    return buildFallbackDietPlan(profiles);
  }

  try {
    const personProperties = profiles.reduce((acc, profile) => {
        if (profile.name) {
            acc[profile.name] = { type: Type.STRING, description: `Sugestão de refeição para ${profile.name}.` };
        }
        return acc;
    }, {} as Record<string, any>);

    const personNames = profiles.map(p => p.name).filter(Boolean);

    const dynamicDietPlanSchema = {
        type: Type.OBJECT,
        properties: DAYS_OF_WEEK.reduce((acc, day) => {
            acc[day] = {
                type: Type.OBJECT,
                properties: MEAL_TIMES.reduce((mealAcc, mealTime) => {
                    mealAcc[mealTime] = {
                        type: Type.OBJECT,
                        properties: personProperties,
                        required: personNames
                    };
                    return mealAcc;
                }, {} as Record<string, any>),
                required: MEAL_TIMES
            };
            return acc;
        }, {} as Record<string, any>),
        required: DAYS_OF_WEEK
    };
    
    const profileDescriptions = profiles.map(p => 
      `${p.name}: ${p.gender} de ${p.age} anos, com ${p.weight} kg e ${p.height} cm de altura.`
    ).join(' ');

    const scheduleText = MEAL_TIME_CONFIG.map(slot => `${slot.label} às ${slot.time}`).join(', ');

    const prompt = `
      Crie um plano alimentar semanal detalhado e saudável em formato JSON para as seguintes pessoas, com o objetivo de emagrecimento:
      ${profileDescriptions}

      Os nomes das pessoas são ${personNames.join(' e ')}. Use estes nomes como chaves no JSON de resposta para cada refeição.

      Utilize EXCLUSIVAMENTE os ingredientes disponíveis nesta lista de compras (não invente novos itens): ${ingredients.join(', ')}.
      Se precisar de variações, reutilize as mesmas bases (por exemplo, "frango desfiado" conta como usar "peito de frango").
      Caso realmente necessite de algo que não esteja na lista, descreva a substituição usando ingredientes existentes (ex.: "use brócolis no lugar de couve-flor").

      O plano deve incluir sugestões para café da manhã, lanche da manhã, almoço, lanche da tarde e jantar para cada dia da semana (Segunda a Domingo) para cada pessoa.
      Considere os horários sugeridos: ${scheduleText}. As sugestões devem ser práticas para quem prepara marmitas e já mencionar porções claras (gramas, unidades ou xícaras).
      Responda APENAS com o JSON.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: dynamicDietPlanSchema,
      },
    });
    
    const jsonText = response.text().trim();
    const plan = JSON.parse(jsonText);
    return plan as GeneratedDietPlan;
  } catch (error) {
    console.error("Error generating diet plan:", error);
    return buildFallbackDietPlan(profiles);
  }
};