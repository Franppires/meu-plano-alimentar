import React, { useState } from 'react';
import type { Recipe } from '../types';
import { XMarkIcon } from './IconComponents';

const RecipeModal: React.FC<{ recipe: Recipe; onClose: () => void }> = ({ recipe, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-green-700">{recipe.recipeName}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <XMarkIcon />
          </button>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Ingredientes:</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-600 mb-4">
            {recipe.ingredients.map((ing, index) => <li key={index}>{ing}</li>)}
          </ul>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Modo de Preparo:</h3>
          <div className="text-gray-600 whitespace-pre-wrap space-y-2">
            {recipe.steps.split('\n').map((step, index) => <p key={index}>{step}</p>)}
          </div>
        </div>
      </div>
    </div>
  );
};

const AddRecipeModal: React.FC<{ onSave: (recipe: Recipe) => void; onClose: () => void }> = ({ onSave, onClose }) => {
  const [recipeName, setRecipeName] = useState('');
  const [ingredientsText, setIngredientsText] = useState('');
  const [steps, setSteps] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipeName.trim() || !ingredientsText.trim() || !steps.trim()) return;
    const ingredients = ingredientsText.split('\n').map(line => line.trim()).filter(Boolean);
    onSave({ recipeName, ingredients, steps });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-green-700">Nova Receita</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <XMarkIcon />
          </button>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nome da receita</label>
            <input
              type="text"
              value={recipeName}
              onChange={e => setRecipeName(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Ingredientes (um por linha)</label>
            <textarea
              value={ingredientsText}
              onChange={e => setIngredientsText(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500 resize-y"
              rows={4}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Modo de preparo</label>
            <textarea
              value={steps}
              onChange={e => setSteps(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500 resize-y"
              rows={5}
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700">
              Salvar receita
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


interface RecipesViewProps {
  recipes: Recipe[];
  onAddRecipe: (recipe: Recipe) => void;
}

export const RecipesView: React.FC<RecipesViewProps> = ({ recipes, onAddRecipe }) => {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <>
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
      <h2 className="text-2xl font-bold text-green-700">Receitas sugeridas</h2>
      <button
        onClick={() => setIsAddModalOpen(true)}
        className="bg-green-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
      >
        + Nova receita
      </button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.length > 0 ? (
        recipes.map((recipe, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg p-6 cursor-pointer transform hover:-translate-y-1 transition-transform duration-300 flex flex-col justify-between"
            onClick={() => setSelectedRecipe(recipe)}
          >
            <div>
              <h3 className="text-xl font-bold text-green-700 mb-2">{recipe.recipeName}</h3>
              <p className="text-gray-500 text-sm mb-4">
                {recipe.ingredients.slice(0, 4).join(', ')}{recipe.ingredients.length > 4 ? '...' : ''}
              </p>
            </div>
            <span className="text-green-600 font-semibold hover:underline self-start">Ver Receita</span>
          </div>
        ))
      ) : (
        <p className="text-gray-500 col-span-full text-center">Nenhuma receita disponível. Adicione uma nova ou gere com IA.</p>
      )}
    </div>
    {selectedRecipe && <RecipeModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />}
    {isAddModalOpen && (
      <AddRecipeModal
        onClose={() => setIsAddModalOpen(false)}
        onSave={recipe => {
          onAddRecipe(recipe);
          setIsAddModalOpen(false);
        }}
      />
    )}
    </>
  );
};