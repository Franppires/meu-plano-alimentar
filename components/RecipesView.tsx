import React, { useState } from 'react';
import type { Recipe } from '../types';
// import { XMarkIcon, PencilIcon } from './IconComponents';
import { EditableRecipeModal } from './EditableRecipeModal';

const RecipeModal: React.FC<{ recipe: Recipe; onClose: () => void; onEdit: () => void }> = ({ recipe, onClose, onEdit }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-green-700">{recipe.recipeName}</h2>
          <div className="flex items-center gap-4">
            <button onClick={onEdit} className="text-gray-500 hover:text-blue-600">
              {/* <PencilIcon /> */}
            </button>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
              {/* <XMarkIcon /> */}
            </button>
          </div>
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

interface RecipesViewProps {
  recipes: Recipe[];
  onSave: (updatedRecipe: Recipe) => void;
  onDelete: (recipeId: string) => void;
}

export const RecipesView: React.FC<RecipesViewProps> = ({ recipes, onSave, onDelete }) => {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCloseModal = () => {
    setSelectedRecipe(null);
    setIsEditing(false);
  };

  return (
    <>
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-green-700 mb-6">Receitas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-gray-50 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow relative"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedRecipe(recipe);
                  setIsEditing(true);
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-blue-600 p-1 rounded-full transition-colors"
                aria-label="Editar receita"
              >
                {/* <PencilIcon /> */}
              </button>
              <div className="cursor-pointer" onClick={() => setSelectedRecipe(recipe)}>
                <h3 className="text-xl font-bold text-green-700 mb-2 pr-8">{recipe.recipeName}</h3>
                <p className="text-gray-500 text-sm mb-4">
                  {recipe.ingredients.slice(0, 4).join(', ')}{recipe.ingredients.length > 4 ? '...' : ''}
                </p>
                <span className="text-green-600 font-semibold hover:underline">Ver Receita</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {selectedRecipe && !isEditing && (
        <RecipeModal recipe={selectedRecipe} onClose={handleCloseModal} onEdit={handleEditClick} />
      )}
      {selectedRecipe && isEditing && (
        <EditableRecipeModal
          recipe={selectedRecipe}
          onSave={onSave}
          onDelete={onDelete}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};