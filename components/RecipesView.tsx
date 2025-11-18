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


export const RecipesView: React.FC<{ recipes: Recipe[] }> = ({ recipes }) => {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  return (
    <>
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
        <p className="text-gray-500 col-span-full text-center">Nenhuma receita gerada. Verifique seu inventário e tente novamente.</p>
      )}
    </div>
    {selectedRecipe && <RecipeModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />}
    </>
  );
};