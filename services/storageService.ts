import type { Ingredient, MealPlan, Recipe, StorageTip } from '../types';
import { INITIAL_SHOPPING_LIST, createEmptyMealPlan } from '../constants';
import { firestoreService } from './firestoreService';
import type { User } from './authService';

const STORAGE_PREFIX = 'meu-plano-saudavel';
const CURRENT_USER_KEY = `${STORAGE_PREFIX}:current-user`;

export interface UserData {
  username?: string;
  userId?: string;
  inventory: Ingredient[];
  mealPlan: MealPlan;
  recipes: Recipe[];
  tips: StorageTip[];
}

export const storageService = {
  // Salvar dados (usa Firestore se disponível, senão localStorage)
  saveUserData: async (data: UserData, user?: User | null): Promise<void> => {
    // Se tiver Firebase configurado e usuário autenticado, usar Firestore
    if (firestoreService.isConfigured() && user?.uid) {
      try {
        await firestoreService.saveUserData({
          userId: user.uid,
          inventory: data.inventory,
          mealPlan: data.mealPlan,
          recipes: data.recipes,
          tips: data.tips,
        });
        return;
      } catch (error) {
        console.error('Erro ao salvar no Firestore, usando localStorage:', error);
        // Fallback para localStorage
      }
    }

    // Fallback para localStorage
    if (typeof window === 'undefined') return;
    const identifier = user?.uid || data.userId || data.username || 'guest';
    const key = `${STORAGE_PREFIX}:user:${identifier}`;
    window.localStorage.setItem(key, JSON.stringify({
      ...data,
      userId: user?.uid || data.userId,
      username: data.username || user?.email || identifier,
    }));
  },

  // Carregar dados (usa Firestore se disponível, senão localStorage)
  loadUserData: async (identifier: string, user?: User | null): Promise<UserData | null> => {
    // Se tiver Firebase configurado e usuário autenticado, usar Firestore
    if (firestoreService.isConfigured() && user?.uid) {
      try {
        console.log('📥 Carregando dados do Firestore para usuário:', user.uid);
        const firestoreData = await firestoreService.loadUserData(user.uid);
        
        if (firestoreData) {
          console.log('✅ Dados carregados do Firestore:', {
            inventory: firestoreData.inventory.length,
            recipes: firestoreData.recipes.length,
            tips: firestoreData.tips.length,
            hasMealPlan: Object.keys(firestoreData.mealPlan).length > 0
          });
          
          // Se os dados do Firestore estão vazios (primeira vez), tentar migrar do localStorage
          const isEmpty = firestoreData.inventory.length === INITIAL_SHOPPING_LIST.length &&
                         firestoreData.recipes.length === 0 &&
                         firestoreData.tips.length === 0;
          
          if (isEmpty) {
            console.log('🔄 Firestore vazio, verificando localStorage para migração...');
            // Tentar encontrar dados antigos no localStorage
            const localStorageKeys: string[] = [];
            for (let i = 0; i < window.localStorage.length; i++) {
              const key = window.localStorage.key(i);
              if (key && key.startsWith(STORAGE_PREFIX + ':user:')) {
                localStorageKeys.push(key);
              }
            }
            
            // Tentar carregar o primeiro conjunto de dados encontrado
            for (const key of localStorageKeys) {
              try {
                const stored = window.localStorage.getItem(key);
                if (stored) {
                  const localData = JSON.parse(stored) as UserData;
                  if (localData.inventory.length > INITIAL_SHOPPING_LIST.length || 
                      localData.recipes.length > 0 || 
                      localData.tips.length > 0) {
                    console.log('📦 Dados encontrados no localStorage, migrando para Firestore...');
                    // Migrar dados para Firestore
                    await firestoreService.saveUserData({
                      userId: user.uid,
                      inventory: localData.inventory,
                      mealPlan: localData.mealPlan,
                      recipes: localData.recipes,
                      tips: localData.tips,
                    });
                    console.log('✅ Dados migrados com sucesso!');
                    return {
                      userId: user.uid,
                      username: user.email || user.displayName || undefined,
                      inventory: localData.inventory,
                      mealPlan: localData.mealPlan,
                      recipes: localData.recipes,
                      tips: localData.tips,
                    };
                  }
                }
              } catch (e) {
                console.warn('Erro ao processar dados do localStorage:', e);
              }
            }
          }
          
          return {
            userId: firestoreData.userId,
            username: user.email || user.displayName || undefined,
            inventory: firestoreData.inventory,
            mealPlan: firestoreData.mealPlan,
            recipes: firestoreData.recipes,
            tips: firestoreData.tips,
          };
        }
      } catch (error) {
        console.error('❌ Erro ao carregar do Firestore, usando localStorage:', error);
        // Fallback para localStorage
      }
    }

    // Fallback para localStorage
    if (typeof window === 'undefined') return null;
    const key = `${STORAGE_PREFIX}:user:${identifier}`;
    const stored = window.localStorage.getItem(key);
    
    if (!stored) {
      return {
        userId: user?.uid,
        username: identifier,
        inventory: INITIAL_SHOPPING_LIST,
        mealPlan: createEmptyMealPlan(),
        recipes: [],
        tips: [],
      };
    }

    try {
      const data = JSON.parse(stored) as UserData;
      return {
        userId: data.userId || user?.uid,
        username: data.username || identifier,
        inventory: data.inventory || INITIAL_SHOPPING_LIST,
        mealPlan: data.mealPlan || createEmptyMealPlan(),
        recipes: data.recipes || [],
        tips: data.tips || [],
      };
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
      return {
        userId: user?.uid,
        username: identifier,
        inventory: INITIAL_SHOPPING_LIST,
        mealPlan: createEmptyMealPlan(),
        recipes: [],
        tips: [],
      };
    }
  },

  // Limpar dados
  clearUserData: async (identifier: string, user?: User | null): Promise<void> => {
    // Se tiver Firebase configurado e usuário autenticado, usar Firestore
    if (firestoreService.isConfigured() && user?.uid) {
      try {
        await firestoreService.clearUserData(user.uid);
        return;
      } catch (error) {
        console.error('Erro ao limpar do Firestore, usando localStorage:', error);
      }
    }

    // Fallback para localStorage
    if (typeof window === 'undefined') return;
    const key = `${STORAGE_PREFIX}:user:${identifier}`;
    window.localStorage.removeItem(key);
  },
};

