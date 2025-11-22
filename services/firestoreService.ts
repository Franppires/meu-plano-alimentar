import { 
  doc, 
  getDoc, 
  setDoc, 
  deleteDoc,
  Timestamp 
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebaseConfig';
import type { Ingredient, MealPlan, Recipe, StorageTip } from '../types';
import { INITIAL_SHOPPING_LIST, createEmptyMealPlan } from '../constants';

export interface UserData {
  userId: string;
  inventory: Ingredient[];
  mealPlan: MealPlan;
  recipes: Recipe[];
  tips: StorageTip[];
  updatedAt: Date;
}

const COLLECTION_NAME = 'userData';

export const firestoreService = {
  // Salvar dados do usuário
  saveUserData: async (data: Omit<UserData, 'updatedAt'>): Promise<void> => {
    if (!isFirebaseConfigured() || !db) {
      throw new Error('Firebase não está configurado');
    }

    try {
      const userDocRef = doc(db, COLLECTION_NAME, data.userId);
      await setDoc(userDocRef, {
        ...data,
        updatedAt: Timestamp.now(),
      }, { merge: true });
    } catch (error) {
      console.error('Erro ao salvar dados no Firestore:', error);
      throw error;
    }
  },

  // Carregar dados do usuário
  loadUserData: async (userId: string): Promise<UserData | null> => {
    if (!isFirebaseConfigured() || !db) {
      return null;
    }

    try {
      const userDocRef = doc(db, COLLECTION_NAME, userId);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // Retornar dados iniciais se não existir
        return {
          userId,
          inventory: INITIAL_SHOPPING_LIST,
          mealPlan: createEmptyMealPlan(),
          recipes: [],
          tips: [],
          updatedAt: new Date(),
        };
      }

      const data = userDoc.data();
      const updatedAt = data.updatedAt?.toDate() || new Date();

      return {
        userId: data.userId || userId,
        inventory: data.inventory || INITIAL_SHOPPING_LIST,
        mealPlan: data.mealPlan || createEmptyMealPlan(),
        recipes: data.recipes || [],
        tips: data.tips || [],
        updatedAt,
      };
    } catch (error) {
      console.error('Erro ao carregar dados do Firestore:', error);
      // Retornar dados iniciais em caso de erro
      return {
        userId,
        inventory: INITIAL_SHOPPING_LIST,
        mealPlan: createEmptyMealPlan(),
        recipes: [],
        tips: [],
        updatedAt: new Date(),
      };
    }
  },

  // Limpar dados do usuário
  clearUserData: async (userId: string): Promise<void> => {
    if (!isFirebaseConfigured() || !db) {
      return;
    }

    try {
      const userDocRef = doc(db, COLLECTION_NAME, userId);
      await deleteDoc(userDocRef);
    } catch (error) {
      console.error('Erro ao limpar dados do Firestore:', error);
      throw error;
    }
  },

  // Verificar se está configurado
  isConfigured: (): boolean => {
    return isFirebaseConfigured();
  },
};


