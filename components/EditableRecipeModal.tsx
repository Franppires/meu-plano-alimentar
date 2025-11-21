import React, { useState } from 'react';
import type { Recipe } from '../types';
// import { CheckIcon, TrashIcon, XMarkIcon } from './IconComponents';

interface EditableRecipeModalProps {
  recipe: Recipe;
  onSave: (updatedRecipe: Recipe) => void;
  onDelete: (recipeId: string) => void;
  onClose: () => void;
}

export const EditableRecipeModal: React.FC<EditableRecipeModalProps> = ({ recipe, onSave, onDelete, onClose }) => {
  const [editedRecipe, setEditedRecipe] = useState<Recipe>(recipe);

  const handleIngredientChange = (index: number, value: string) => {
    const newIngredients = [...editedRecipe.ingredients];
    newIngredients[index] = value;
    setEditedRecipe({ ...editedRecipe, ingredients: newIngredients });
  };

  const handleAddIngredient = () => {
    setEditedRecipe({ ...editedRecipe, ingredients: [...editedRecipe.ingredients, ''] });
  };

  const handleRemoveIngredient = (index: number) => {
    const newIngredients = editedRecipe.ingredients.filter((_, i) => i !== index);
    setEditedRecipe({ ...editedRecipe, ingredients: newIngredients });
  };

  const handleSave = () => {
    onSave(editedRecipe);
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm(`Tem certeza que deseja excluir a receita "${recipe.recipeName}"?`)) {
      onDelete(recipe.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-3xl max-h-[95vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-green-800">Editar Receita</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition-colors">
            {/* <XMarkIcon /> */}
          </button>
        </div>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="recipeName" className="block text-lg font-semibold text-gray-700 mb-2">Nome da Receita</label>
            <input
              id="recipeName"
              type="text"
              value={editedRecipe.recipeName}
              onChange={(e) => setEditedRecipe({ ...editedRecipe, recipeName: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Ingredientes</h3>
            <div className="space-y-3">
              {editedRecipe.ingredients.map((ing, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={ing}
                    onChange={(e) => handleIngredientChange(index, e.target.value)}
                    className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                  <button onClick={() => handleRemoveIngredient(index)} className="p-2 text-red-500 hover:bg-red-100 rounded-full transition">
                    {/* <TrashIcon /> */}
                  </button>
                </div>
              ))}
            </div>
            <button onClick={handleAddIngredient} className="mt-4 text-green-600 font-semibold hover:text-green-800 transition">
              + Adicionar Ingrediente
            </button>
          </div>

          <div>
            <label htmlFor="steps" className="block text-lg font-semibold text-gray-700 mb-2">Modo de Preparo</label>
            <textarea
              id="steps"
              value={editedRecipe.steps}
              onChange={(e) => setEditedRecipe({ ...editedRecipe, steps: e.target.value })}
              rows={8}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
            />
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <button
            onClick={handleDelete}
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 text-red-600 font-bold bg-red-100 rounded-lg hover:bg-red-200 transition-all"
          >
            {/* <TrashIcon /> */}
            Excluir Receita
          </button>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-3 text-gray-700 font-semibold bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 text-white font-bold bg-green-600 rounded-lg hover:bg-green-700 transition-all"
            >
              {/* <CheckIcon /> */}
              Salvar Alterações
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
