import type { GeneratedDietPlan, MealTime, Recipe, StorageTip, UserProfile } from './types';
import { DAYS_OF_WEEK, MEAL_TIMES } from './constants';

export const FALLBACK_RECIPES: Recipe[] = [
  {
    recipeName: 'Frango grelhado com legumes assados',
    ingredients: [
      'Peito de frango em tiras',
      'Abobrinha, cenoura e brócolis',
      'Azeite de oliva extra virgem',
      'Alho picado, páprica e cúrcuma',
    ],
    steps:
      '1. Tempere o frango com azeite, alho, páprica, cúrcuma, sal e pimenta.\n' +
      '2. Grelhe em fogo médio até dourar.\n' +
      '3. Asse os legumes com azeite e ervas por 20 minutos e sirva junto.',
  },
  {
    recipeName: 'Arroz integral cremoso com feijão e rúcula',
    ingredients: [
      'Arroz integral cozido',
      'Feijão carioca cozido',
      'Rúcula fresca',
      'Tomate cereja',
      'Sementes de chia',
    ],
    steps:
      '1. Aqueça o feijão e misture com o arroz integral cozido.\n' +
      '2. Finalize com rúcula fresca, tomate cereja e chia para crocância.',
  },
  {
    recipeName: 'Wrap integral de atum com legumes crocantes',
    ingredients: ['Rap 10 integral', 'Atum em água', 'Iogurte natural', 'Cenoura ralada', 'Pepino em tiras'],
    steps:
      '1. Misture o atum com iogurte e temperos naturais.\n' +
      '2. Recheie o wrap com o creme de atum e legumes crocantes.\n' +
      '3. Enrole e grelhe rapidamente para selar.',
  },
  {
    recipeName: 'Overnight oats tropical',
    ingredients: ['Aveia em flocos', 'Leite ou bebida vegetal', 'Mamão em cubos', 'Chia', 'Castanhas picadas'],
    steps:
      '1. Misture a aveia com leite, chia e adoçante natural.\n' +
      '2. Deixe na geladeira durante a noite.\n' +
      '3. Sirva com mamão e castanhas ao acordar.',
  },
  {
    recipeName: 'Tilápia assada com purê de abóbora',
    ingredients: ['Filés de tilápia', 'Abóbora cabotiá', 'Azeite', 'Alho e ervas', 'Limão'],
    steps:
      '1. Tempere a tilápia com limão, alho e ervas. Asse por 15 minutos.\n' +
      '2. Cozinhe a abóbora e amasse com azeite e sal.\n' +
      '3. Sirva o peixe sobre o purê com salada verde.',
  },
];

export const FALLBACK_TIPS: StorageTip[] = [
  {
    foodItem: 'Folhas verdes',
    tip: 'Lave, seque bem e guarde em pote com papel-toalha para absorver umidade. Troque o papel a cada dois dias.',
  },
  {
    foodItem: 'Proteínas cozidas',
    tip: 'Divida o frango ou carne em porções individuais e congele por até 3 meses. Descongele na geladeira na noite anterior.',
  },
  {
    foodItem: 'Legumes para marmitas',
    tip: 'Asse bandejas de legumes de uma vez. Guarde em potes herméticos por até 4 dias na geladeira.',
  },
  {
    foodItem: 'Aveia e sementes',
    tip: 'Mantenha em potes de vidro ao abrigo da luz para preservar sabor e crocância.',
  },
  {
    foodItem: 'Frutas para lanches',
    tip: 'Porcione frutas já higienizadas em potes pequenos para facilitar os lanches da manhã e tarde.',
  },
];

const FALLBACK_MEALS: Record<MealTime, string[]> = {
  'Café da Manhã': [
    'Omelete com espinafre + pão integral + fruta',
    'Overnight oats de chia com mamão e castanhas',
    'Tapioca com queijo branco e salada de frutas',
  ],
  'Lanche da Manhã': [
    'Maçã com pasta de amendoim',
    'Banana com aveia e canela',
    'Iogurte com chia e morangos',
  ],
  Almoço: [
    'Frango grelhado, arroz integral, feijão e salada colorida',
    'Carne moída magra com mandioquinha e rúcula',
    'Peixe assado, purê de abóbora e legumes no vapor',
  ],
  'Lanche da Tarde': [
    'Iogurte natural com granola caseira',
    'Wrap integral de atum e folhas verdes',
    'Mix de castanhas com frutas secas',
  ],
  Jantar: [
    'Sopa de legumes com frango desfiado',
    'Ovos mexidos com brócolis e salada morna',
    'Tilápia grelhada com legumes salteados',
  ],
};

export const buildFallbackDietPlan = (profiles: UserProfile[]): GeneratedDietPlan => {
  const names = profiles.map(profile => profile.name || `Pessoa ${profile.id}`);

  return DAYS_OF_WEEK.reduce((planAcc, day, dayIndex) => {
    planAcc[day] = MEAL_TIMES.reduce((dailyMeals, mealTime) => {
      const options = FALLBACK_MEALS[mealTime as MealTime];
      const suggestion = options[dayIndex % options.length];
      dailyMeals[mealTime] = names.reduce((personAcc, personName) => {
        personAcc[personName] = suggestion;
        return personAcc;
      }, {} as Record<string, string>);
      return dailyMeals;
    }, {} as Record<string, Record<string, string>>);
    return planAcc;
  }, {} as GeneratedDietPlan);
};

