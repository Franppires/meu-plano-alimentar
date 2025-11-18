import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { PlannerView } from './components/PlannerView';
import { InventoryView } from './components/InventoryView';
import { RecipesView } from './components/RecipesView';
import { TipsView } from './components/TipsView';
import { DietPlanView } from './components/DietPlanView';
import { LoadingSpinner } from './components/LoadingSpinner';
import type { View, Ingredient, Recipe, StorageTip, MealPlan, UserProfile, GeneratedDietPlan } from './types';
import { INITIAL_SHOPPING_LIST, INITIAL_MEAL_PLAN } from './constants';
import { generateRecipes, generateStorageTips, generateDietPlan } from './services/geminiService';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('planner');
  const [inventory, setInventory] = useState<Ingredient[]>(INITIAL_SHOPPING_LIST);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [tips, setTips] = useState<StorageTip[]>([]);
  const [mealPlan, setMealPlan] = useState<MealPlan>(INITIAL_MEAL_PLAN);
  const [dietPlan, setDietPlan] = useState<GeneratedDietPlan | null>(null);
  
  const [isLoading, setIsLoading] = useState<boolean>(true); // For initial data
  const [isGenerating, setIsGenerating] = useState<boolean>(false); // For on-demand generations
  const [error, setError] = useState<string | null>(null);

  const fetchAiData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const ingredientNames = inventory.map(i => i.name);
      const [generatedRecipes, generatedTips] = await Promise.all([
        generateRecipes(ingredientNames),
        generateStorageTips(ingredientNames),
      ]);
      setRecipes(generatedRecipes);
      setTips(generatedTips);
    } catch (e) {
      setError('Falha ao buscar sugestões iniciais. Verifique sua conexão e a chave de API.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [inventory]);

  useEffect(() => {
    fetchAiData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const handleGenerateDietPlan = async (profiles: UserProfile[]) => {
    setIsGenerating(true);
    setError(null);
    setDietPlan(null);
    try {
        const ingredientNames = inventory.map(i => i.name);
        const plan = await generateDietPlan(profiles, ingredientNames);
        setDietPlan(plan);
    } catch (e: any) {
        setError(e.message || 'Ocorreu um erro ao gerar o plano alimentar.');
        console.error(e);
    } finally {
        setIsGenerating(false);
    }
  };

  const handleApplyPlanToPlanner = () => {
    if (!dietPlan) return;

    const newMealPlan: MealPlan = { ...INITIAL_MEAL_PLAN };

    for (const day in dietPlan) {
        if (newMealPlan[day]) {
            for (const mealTime in dietPlan[day]) {
                if (newMealPlan[day][mealTime] !== undefined) {
                    const meals = dietPlan[day][mealTime];
                    const combinedMeal = `P1: ${meals['Pessoa 1']}\nP2: ${meals['Pessoa 2']}`;
                    newMealPlan[day][mealTime] = combinedMeal;
                }
            }
        }
    }
    setMealPlan(newMealPlan);
    setActiveView('planner');
  };

  const handleUpdateMeal = (day: string, mealTime: string, value: string) => {
    setMealPlan(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [mealTime]: value,
      },
    }));
  };
  
  const renderView = () => {
    // Special handling for diet view as its loading is separate
    if (activeView === 'diet') {
        return <DietPlanView onGenerate={handleGenerateDietPlan} plan={dietPlan} isGenerating={isGenerating} error={error} onApplyPlan={handleApplyPlanToPlanner}/>;
    }

    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center text-center p-8 mt-10">
          <LoadingSpinner />
          <p className="mt-4 text-lg text-gray-600">
            A Gemini está preparando suas receitas e dicas...
          </p>
        </div>
      );
    }
    
    // Use the main error state for other views
    if (error && activeView !== 'diet') {
       return <div className="text-center p-8 mt-10 text-red-500">{error}</div>
    }

    switch (activeView) {
      case 'planner':
        return <PlannerView mealPlan={mealPlan} onUpdateMeal={handleUpdateMeal} />;
      case 'inventory':
        return <InventoryView inventory={inventory} setInventory={setInventory} />;
      case 'recipes':
        return <RecipesView recipes={recipes} />;
      case 'tips':
        return <TipsView tips={tips} />;
      default:
        return <PlannerView mealPlan={mealPlan} onUpdateMeal={handleUpdateMeal} />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800">
      <div className="container mx-auto p-4 md:p-6">
        <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-green-700">Meu Plano Saudável</h1>
            <p className="text-gray-500 mt-2 text-lg">Organize suas refeições, receitas e compras em um só lugar.</p>
        </div>
        <Header activeView={activeView} setActiveView={setActiveView} />
        <main className="mt-6">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;