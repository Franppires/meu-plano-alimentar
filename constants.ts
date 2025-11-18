
import type { Ingredient, MealPlan, MealSchedule, MealSuggestion, MealTime, DailyMeals, Category } from './types';

export const INITIAL_SHOPPING_LIST: Ingredient[] = [
  { id: '1', name: 'Peito de frango', quantity: '2 kg', category: 'Proteínas', checked: false },
  { id: '2', name: 'Carne moída magra (patinho)', quantity: '1 kg', category: 'Proteínas', checked: false },
  { id: '3', name: 'Ovos', quantity: '30 unidades', category: 'Proteínas', checked: false },
  { id: '4', name: 'Atum ou sardinha em lata', quantity: '2 unidades', category: 'Proteínas', checked: false },
  { id: '5', name: 'Arroz integral', quantity: '1 kg', category: 'Carboidratos', checked: false },
  { id: '6', name: 'Feijão', quantity: '1 kg', category: 'Carboidratos', checked: false },
  { id: '7', name: 'Mandioquinha ou batata-doce', quantity: '1 kg', category: 'Carboidratos', checked: false },
  { id: '8', name: 'Pão integral', quantity: '1 pacote', category: 'Carboidratos', checked: false },
  { id: '9', name: 'Rap 10 integral', quantity: '2 pacotes', category: 'Carboidratos', checked: false },
  { id: '10', name: 'Tapioca', quantity: '1 pacote', category: 'Carboidratos', checked: false },
  { id: '11', name: 'Abobrinha', quantity: '3 und', category: 'Vegetais', checked: false },
  { id: '12', name: 'Cenoura', quantity: '3 und', category: 'Vegetais', checked: false },
  { id: '13', name: 'Brócolis', quantity: '2 cabeças', category: 'Vegetais', checked: false },
  { id: '14', name: 'Abóbora cabotiá / moranga', quantity: '1 pequena', category: 'Vegetais', checked: false },
  { id: '15', name: 'Alface', quantity: '2 maços', category: 'Vegetais', checked: false },
  { id: '16', name: 'Rúcula', quantity: '1 maço', category: 'Vegetais', checked: false },
  { id: '17', name: 'Tomate', quantity: '6 und', category: 'Vegetais', checked: false },
  { id: '18', name: 'Pepino', quantity: '2 und', category: 'Vegetais', checked: false },
  { id: '19', name: 'Maçã', quantity: '10', category: 'Frutas', checked: false },
  { id: '20', name: 'Banana', quantity: '10', category: 'Frutas', checked: false },
  { id: '21', name: 'Mamão', quantity: '2 pequenos', category: 'Frutas', checked: false },
  { id: '22', name: 'Pera', quantity: '5', category: 'Frutas', checked: false },
  { id: '23', name: 'Azeite extra virgem', quantity: '1', category: 'Gorduras', checked: false },
  { id: '24', name: 'Chia', quantity: '1 pacote', category: 'Outros', checked: false },
  { id: '25', name: 'Aveia em flocos', quantity: '1 pacote', category: 'Carboidratos', checked: false },
  { id: '26', name: 'Castanhas', quantity: 'pacote pequeno', category: 'Gorduras', checked: false },
  { id: '27', name: 'Iogurte natural ou grego light', quantity: '6-10 unid', category: 'Laticínios', checked: false },
  { id: '28', name: 'Cebola', quantity: '4 cebolas', category: 'Temperos', checked: false },
  { id: '29', name: 'Alho', quantity: '2 cabeças', category: 'Temperos', checked: false },
  { id: '30', name: 'Temperos (páprica, cúrcuma, etc)', quantity: 'a gosto', category: 'Temperos', checked: false },
];

export const CATEGORY_OPTIONS: Category[] = ['Proteínas', 'Carboidratos', 'Gorduras', 'Laticínios', 'Vegetais', 'Frutas', 'Temperos', 'Outros'];

export const DAYS_OF_WEEK = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

export const MEAL_TIME_CONFIG: ReadonlyArray<{
  id: string;
  label: MealTime;
  time: string;
  focus: string;
  suggestion: string;
}> = [
  {
    id: 'breakfast',
    label: 'Café da Manhã',
    time: '07:30',
    focus: 'Proteína magra + fruta + fibra',
    suggestion: 'Omelete de claras com espinafre, 1 fatia de pão integral e frutas vermelhas.',
  },
  {
    id: 'mid-morning',
    label: 'Lanche da Manhã',
    time: '10:30',
    focus: 'Fruta + oleaginosa',
    suggestion: 'Maçã com 1 colher de pasta de amendoim ou mix de castanhas.',
  },
  {
    id: 'lunch',
    label: 'Almoço',
    time: '13:00',
    focus: 'Prato completo (½ verduras, ¼ proteína, ¼ carboidrato)',
    suggestion: 'Peito de frango grelhado, arroz integral, feijão e salada verde com legumes assados.',
  },
  {
    id: 'afternoon',
    label: 'Lanche da Tarde',
    time: '16:30',
    focus: 'Proteína leve + fruta',
    suggestion: 'Iogurte natural com aveia, chia e pedaços de mamão.',
  },
  {
    id: 'dinner',
    label: 'Jantar',
    time: '19:30',
    focus: 'Proteína leve + vegetais cozidos',
    suggestion: 'Tilápia assada com purê de abóbora cabotiá e brócolis no vapor.',
  },
] as const;

export const MEAL_TIMES: MealTime[] = MEAL_TIME_CONFIG.map(slot => slot.label);

export const MEAL_TIME_SCHEDULE: MealSchedule = MEAL_TIME_CONFIG.reduce((acc, slot) => {
  acc[slot.label] = slot.time;
  return acc;
}, {} as MealSchedule);

export const MEAL_TIME_SUGGESTIONS: MealSuggestion = MEAL_TIME_CONFIG.reduce((acc, slot) => {
  acc[slot.label] = slot.suggestion;
  return acc;
}, {} as MealSuggestion);

export const createEmptyMealPlan = (): MealPlan =>
  DAYS_OF_WEEK.reduce((acc, day) => {
    const mealsForDay = MEAL_TIMES.reduce((meals, time) => {
      meals[time] = '';
      return meals;
    }, {} as DailyMeals);
    acc[day] = mealsForDay;
    return acc;
  }, {} as MealPlan);

export const INITIAL_MEAL_PLAN = createEmptyMealPlan();
