export interface Ingredient {
  id: string;
  name: string;
  quantity: string;
  category: Category;
  checked: boolean;
}

export type Category = 'Proteínas' | 'Carboidratos' | 'Gorduras' | 'Laticínios' | 'Vegetais' | 'Frutas' | 'Temperos' | 'Outros';

export interface Recipe {
  recipeName: string;
  ingredients: string[];
  steps: string;
}

export interface StorageTip {
  foodItem: string;
  tip: string;
}

export interface MealPlan {
  [day: string]: {
    [mealTime: string]: string;
  };
}

export type GeneratedDietPlan = {
    [day: string]: {
        [mealTime: string]: {
            'Pessoa 1': string;
            'Pessoa 2': string;
        };
    };
};

export type View = 'planner' | 'inventory' | 'recipes' | 'tips' | 'diet';

export interface UserProfile {
    id: number;
    gender: 'Mulher' | 'Homem';
    age: string;
    weight: string;
    height: string;
}