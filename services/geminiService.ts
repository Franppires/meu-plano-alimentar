import { GoogleGenAI, Type } from "@google/genai";
import type { Recipe, StorageTip, UserProfile, GeneratedDietPlan } from '../types';
import { DAYS_OF_WEEK, MEAL_TIMES } from "../constants";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

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

const dietPlanSchema = {
    type: Type.OBJECT,
    properties: DAYS_OF_WEEK.reduce((acc, day) => {
        acc[day] = {
            type: Type.OBJECT,
            properties: MEAL_TIMES.reduce((mealAcc, mealTime) => {
                mealAcc[mealTime] = {
                    type: Type.OBJECT,
                    properties: {
                        'Pessoa 1': { type: Type.STRING, description: `Sugestão de refeição para a Pessoa 1 no ${mealTime} de ${day}.` },
                        'Pessoa 2': { type: Type.STRING, description: `Sugestão de refeição para a Pessoa 2 no ${mealTime} de ${day}.` }
                    },
                    required: ['Pessoa 1', 'Pessoa 2']
                };
                return mealAcc;
            }, {} as Record<string, any>),
            required: MEAL_TIMES
        };
        return acc;
    }, {} as Record<string, any>),
    required: DAYS_OF_WEEK
};


export const generateRecipes = async (ingredients: string[]): Promise<Recipe[]> => {
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

    const jsonText = response.text.trim();
    const recipes = JSON.parse(jsonText);
    return recipes as Recipe[];
  } catch (error) {
    console.error("Error generating recipes:", error);
    return [];
  }
};

export const generateStorageTips = async (ingredients: string[]): Promise<StorageTip[]> => {
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

    const jsonText = response.text.trim();
    const tips = JSON.parse(jsonText);
    return tips as StorageTip[];
  } catch (error) {
    console.error("Error generating storage tips:", error);
    return [];
  }
};

export const generateDietPlan = async (profiles: UserProfile[], ingredients: string[]): Promise<GeneratedDietPlan> => {
  try {
    const profileDescriptions = profiles.map((p, index) => 
      `Pessoa ${index + 1}: ${p.gender} de ${p.age} anos, com ${p.weight} kg e ${p.height} cm de altura.`
    ).join(' ');

    const prompt = `
      Crie um plano alimentar semanal detalhado e saudável em formato JSON para as seguintes pessoas, com o objetivo de emagrecimento:
      ${profileDescriptions}

      Utilize principalmente os seguintes ingredientes da lista de compras: ${ingredients.join(', ')}.

      O plano deve incluir sugestões para café da manhã, almoço e jantar para cada dia da semana (Segunda a Domingo) para cada pessoa.
      Seja específico nas porções e preparações. O plano deve ser prático para quem prepara marmitas.
      Responda APENAS com o JSON.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: dietPlanSchema,
      },
    });
    
    const jsonText = response.text.trim();
    const plan = JSON.parse(jsonText);
    return plan as GeneratedDietPlan;
  } catch (error) {
    console.error("Error generating diet plan:", error);
    throw new Error("Não foi possível gerar o plano alimentar. Tente novamente.");
  }
};