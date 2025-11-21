import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { LoginView } from './components/LoginView';
import { PlannerView } from './components/PlannerView';
import { InventoryView } from './components/InventoryView';
import { RecipesView } from './components/RecipesView';
import { TipsView } from './components/TipsView';
import { DietPlanView } from './components/DietPlanView';
import { LoadingSpinner } from './components/LoadingSpinner';
import type { View, Ingredient, Recipe, StorageTip, MealPlan, UserProfile, GeneratedDietPlan } from './types';
import { createEmptyMealPlan } from './constants';
import { generateRecipes, generateStorageTips, generateDietPlan } from './services/geminiService';
import { storageService } from './services/storageService';
import { authService, type User } from './services/authService';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | { username: string } | null>(() => {
    return authService.getCurrentUser();
  });
  const [activeView, setActiveView] = useState<View>('planner');
  const [inventory, setInventory] = useState<Ingredient[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [tips, setTips] = useState<StorageTip[]>([]);
  const [mealPlan, setMealPlan] = useState<MealPlan>(createEmptyMealPlan());
  const [dietPlan, setDietPlan] = useState<GeneratedDietPlan | null>(null);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [viewError, setViewError] = useState<string | null>(null);
  const [dietPlanError, setDietPlanError] = useState<string | null>(null);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);

  // Observar mudanças no estado de autenticação
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange((user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
        setDataLoaded(false);
        setInventory([]);
        setRecipes([]);
        setTips([]);
        setMealPlan(createEmptyMealPlan());
      }
    });

    return () => unsubscribe();
  }, []);

  // Carregar dados do usuário quando ele faz login ou quando o componente monta
  useEffect(() => {
    const loadUserData = async () => {
      if (currentUser && !dataLoaded) {
        console.log('🔄 Iniciando carregamento de dados para:', 'uid' in currentUser ? currentUser.email : currentUser.username);
        setIsLoading(true);
        try {
          const identifier = 'uid' in currentUser ? currentUser.uid : currentUser.username;
          const userData = await storageService.loadUserData(
            identifier,
            'uid' in currentUser ? currentUser : null
          );
          
          if (userData) {
            console.log('📊 Dados carregados:', {
              inventory: userData.inventory.length,
              recipes: userData.recipes.length,
              tips: userData.tips.length,
              mealPlanDays: Object.keys(userData.mealPlan).length
            });
            setInventory(userData.inventory);
            setMealPlan(userData.mealPlan);
            setRecipes(userData.recipes);
            setTips(userData.tips);
          } else {
            console.warn('⚠️ Nenhum dado retornado do storageService. Exibindo estado vazio.');
            setInventory([]);
            setRecipes([]);
            setTips([]);
            setMealPlan(createEmptyMealPlan());
          }
          setDataLoaded(true); // Marca que o carregamento inicial terminou.
        } catch (error) {
          console.error('❌ Erro ao carregar dados:', error);
          // Mesmo com erro, marcamos como carregado para não tentar de novo em loop.
          setDataLoaded(true); 
        } finally {
          setIsLoading(false); // Garante que o loading pare.
        }
      } else if (!currentUser) {
        setDataLoaded(false);
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [currentUser, dataLoaded]);

  // Salvar dados automaticamente quando mudarem
  useEffect(() => {
    const saveData = async () => {
      if (currentUser && dataLoaded) {
        try {
          const userForStorage = 'uid' in currentUser ? currentUser : null;
          await storageService.saveUserData({
            userId: 'uid' in currentUser ? currentUser.uid : undefined,
            username: 'username' in currentUser ? currentUser.username : currentUser.email || currentUser.displayName || undefined,
            inventory,
            mealPlan,
            recipes,
            tips,
          }, userForStorage);
        } catch (error) {
          console.error('Erro ao salvar dados:', error);
        }
      }
    };

    // Debounce para evitar muitas chamadas
    const timeoutId = setTimeout(saveData, 1000);
    return () => clearTimeout(timeoutId);
  }, [currentUser, dataLoaded, inventory, mealPlan, recipes, tips]);

  const fetchAiData = useCallback(async () => {
    if (inventory.length === 0) {
      console.log('⚠️ Inventário vazio, pulando busca da IA');
      setIsLoading(false);
      return;
    }
    
    console.log('🤖 Iniciando busca de receitas e dicas da IA...', { 
      ingredientCount: inventory.length,
      ingredients: inventory.slice(0, 5).map(i => i.name)
    });
    
    setIsLoading(true);
    setViewError(null);
    try {
      const ingredientNames = inventory.map(i => i.name);
      console.log('📞 Chamando Gemini API...');
      
      const [generatedRecipes, generatedTips] = await Promise.all([
        generateRecipes(ingredientNames),
        generateStorageTips(ingredientNames),
      ]);
      
      console.log('✅ Dados da IA recebidos:', {
        recipes: generatedRecipes.length,
        tips: generatedTips.length
      });
      
      setRecipes(generatedRecipes);
      setTips(generatedTips);
    } catch (e: any) {
      console.error('❌ Erro ao buscar dados da IA:', e);
      setViewError('Falha ao buscar sugestões iniciais. Verifique sua conexão e a chave de API.');
      // Continuar mesmo com erro - usar dados padrão
      setIsLoading(false);
    } finally {
      setIsLoading(false);
      console.log('✅ Busca da IA finalizada');
    }
  }, [inventory]);

  // Buscar dados da IA quando o inventário for carregado (apenas se não houver dados salvos)
  useEffect(() => {
    if (currentUser && dataLoaded && inventory.length > 0) {
      // Só buscar da IA se realmente não houver receitas E dicas
      const needsAiData = recipes.length === 0 && tips.length === 0;
      console.log('🔍 Verificando se precisa buscar dados da IA:', {
        needsAiData,
        recipesCount: recipes.length,
        tipsCount: tips.length,
        isLoading,
        inventoryCount: inventory.length
      });
      
      if (needsAiData && !isLoading) {
        console.log('🚀 Iniciando busca da IA...');
        fetchAiData();
      } else if (!needsAiData) {
        console.log('✅ Já existem receitas e dicas, não precisa buscar da IA');
        setIsLoading(false);
      }
    } else if (currentUser && dataLoaded && inventory.length === 0) {
      console.log('⚠️ Inventário vazio após carregar dados');
      setIsLoading(false);
    }
  }, [currentUser, dataLoaded, inventory.length, recipes.length, tips.length, isLoading, fetchAiData]);
  
  const handleGenerateDietPlan = async (profiles: UserProfile[]) => {
    setIsGenerating(true);
    setDietPlanError(null);
    setDietPlan(null);
    try {
        const ingredientNames = inventory.map(i => i.name);
        const plan = await generateDietPlan(profiles, ingredientNames);
        setDietPlan(plan);
    } catch (e: any) {
        setDietPlanError(e.message || 'Ocorreu um erro ao gerar o plano alimentar.');
        console.error(e);
    } finally {
        setIsGenerating(false);
    }
  };

  const handleApplyPlanToPlanner = () => {
    if (!dietPlan) return;

    const newMealPlan: MealPlan = createEmptyMealPlan();

    for (const day in dietPlan) {
        if (newMealPlan[day]) {
            for (const mealTime in dietPlan[day]) {
                if (newMealPlan[day][mealTime] !== undefined) {
                    const meals = dietPlan[day][mealTime];
                    const combinedMeal = Object.entries(meals)
                      .map(([personName, meal]) => `${personName}: ${meal}`)
                      .join('\n');
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

  const handleAddRecipe = (recipe: Recipe) => {
    setRecipes(prev => [...prev, recipe]);
  };

  const handleAddTip = (tip: StorageTip) => {
    setTips(prev => [...prev, tip]);
  };

  const handleLogin = async (user: User | { username: string }) => {
    setCurrentUser(user);
    // Resetar flag para forçar recarregamento dos dados
    setDataLoaded(false);
  };

  const handleLogout = async () => {
    if (window.confirm('Tem certeza que deseja sair? Seus dados serão mantidos.')) {
      try {
        if ('uid' in currentUser && currentUser.uid) {
          await authService.signOut();
        }
        setCurrentUser(null);
        // Limpar estado
        setInventory([]);
        setRecipes([]);
        setTips([]);
        setMealPlan(createEmptyMealPlan());
        setDietPlan(null);
        setDataLoaded(false);
        setIsLoading(false);
        setViewError(null);
        setDietPlanError(null);
      } catch (error) {
        console.error('Erro ao fazer logout:', error);
        // Mesmo com erro, limpar estado local
        setCurrentUser(null);
      }
    }
  };

  const handleClearData = async () => {
    if (window.confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita!')) {
      if (currentUser) {
        try {
          const identifier = 'uid' in currentUser ? currentUser.uid : currentUser.username;
          const userForStorage = 'uid' in currentUser ? currentUser : null;
          await storageService.clearUserData(identifier, userForStorage);
          
          // Recarregar dados iniciais
          const userData = await storageService.loadUserData(identifier, userForStorage);
          if (userData) {
            setInventory(userData.inventory);
            setMealPlan(userData.mealPlan);
            setRecipes(userData.recipes);
            setTips(userData.tips);
          }
        } catch (error) {
          console.error('Erro ao limpar dados:', error);
        }
      }
    }
  };
  
  const renderView = () => {
    // Special handling for diet view as its loading is separate
    if (activeView === 'diet') {
        return (
          <DietPlanView
            onGenerate={handleGenerateDietPlan}
            plan={dietPlan}
            isGenerating={isGenerating}
            error={dietPlanError}
            onApplyPlan={handleApplyPlanToPlanner}
          />
        );
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
    if (viewError) {
       return <div className="text-center p-8 mt-10 text-red-500">{viewError}</div>
    }

    switch (activeView) {
      case 'planner':
        return <PlannerView mealPlan={mealPlan} onUpdateMeal={handleUpdateMeal} />;
      case 'inventory':
        return <InventoryView inventory={inventory} setInventory={setInventory} />;
      case 'recipes':
        return <RecipesView recipes={recipes} onAddRecipe={handleAddRecipe} />;
      case 'tips':
        return <TipsView tips={tips} onAddTip={handleAddTip} />;
      default:
        return <PlannerView mealPlan={mealPlan} onUpdateMeal={handleUpdateMeal} />;
    }
  };

  // Se não estiver logado, mostrar tela de login
  if (!currentUser) {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800">
      <div className="container mx-auto p-4 md:p-6">
        <div className="text-center mb-4 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-green-700">Meu Plano Saudável</h1>
              <p className="text-gray-500 mt-2 text-sm sm:text-lg">Organize suas refeições, receitas e compras em um só lugar.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <div className="flex items-center gap-2 text-sm sm:text-base text-gray-600 bg-white px-3 py-2 rounded-lg shadow-sm">
                {'photoURL' in currentUser && currentUser.photoURL ? (
                  <img src={currentUser.photoURL} alt="Avatar" className="w-6 h-6 rounded-full" />
                ) : (
                  <span>👤</span>
                )}
                <span>{'displayName' in currentUser ? currentUser.displayName || currentUser.email : currentUser.username}</span>
              </div>
              <button
                onClick={handleClearData}
                className="bg-red-500 text-white font-semibold px-3 sm:px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm sm:text-base shadow-sm"
                title="Limpar todos os dados"
              >
                🗑️ Limpar Dados
              </button>
              <button
                onClick={handleLogout}
                className="bg-gray-500 text-white font-semibold px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm sm:text-base shadow-sm"
                title="Sair"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
        <Header activeView={activeView} setActiveView={setActiveView} />
        <main className="mt-4 sm:mt-6">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;