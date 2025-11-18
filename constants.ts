
import type { Ingredient } from './types';

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

export const DAYS_OF_WEEK = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
export const MEAL_TIMES = ['Café da Manhã', 'Almoço', 'Jantar'];

export const INITIAL_MEAL_PLAN = DAYS_OF_WEEK.reduce((acc, day) => {
    acc[day] = MEAL_TIMES.reduce((meals, time) => {
        meals[time] = '';
        return meals;
    }, {} as { [key: string]: string });
    return acc;
}, {} as { [key: string]: { [key: string]: string } });
