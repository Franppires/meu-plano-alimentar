export interface Ingredient {
  id: string;
  name: string;
  quantity: string;
  category: Category;
  checked: boolean;
}

export type Category = 'Proteínas' | 'Carboidratos' | 'Gorduras' | 'Laticínios' | 'Vegetais' | 'Frutas' | 'Temperos' | 'Outros';

export type MealTime = 'Café da Manhã' | 'Lanche da Manhã' | 'Almoço' | 'Lanche da Tarde' | 'Jantar';

export type MealSchedule = Record<MealTime, string>;

export type MealSuggestion = Record<MealTime, string>;

export interface Recipe {
  recipeName: string;
  ingredients: string[];
  steps: string;
}

export interface StorageTip {
  foodItem: string;
  tip: string;
}

export type DailyMeals = Record<MealTime, string>;

export interface MealPlan {
  [day: string]: DailyMeals;
}

export type GeneratedDietPlan = {
    [day: string]: {
        [mealTime: string]: {
            [personName: string]: string;
        };
    };
};

export type View = 'planner' | 'inventory' | 'recipes' | 'tips' | 'diet';

export interface UserProfile {
    id: number;
    name: string;
    gender: 'Mulher' | 'Homem';
    age: string;
    weight: string;
    height: string;
}