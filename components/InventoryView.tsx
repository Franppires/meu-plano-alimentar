

import React, { useState } from 'react';
import type { Ingredient, Category } from '../types';
import { CATEGORY_OPTIONS } from '../constants';

interface InventoryViewProps {
  inventory: Ingredient[];
  setInventory: React.Dispatch<React.SetStateAction<Ingredient[]>>;
}

export const InventoryView: React.FC<InventoryViewProps> = ({ inventory, setInventory }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState<{ name: string; quantity: string; category: Category }>({
    name: '',
    quantity: '',
    category: CATEGORY_OPTIONS[0],
  });

  const toggleCheck = (id: string) => {
    setInventory(
      inventory.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name || !newItem.quantity) return;
    const newIngredient: Ingredient = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: newItem.name,
      quantity: newItem.quantity,
      category: newItem.category,
      checked: false,
    };
    setInventory(prev => [...prev, newIngredient]);
    setNewItem({ name: '', quantity: '', category: CATEGORY_OPTIONS[0] });
    setIsAdding(false);
  };

  const groupedInventory = inventory.reduce((acc: Record<Category, Ingredient[]>, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<Category, Ingredient[]>);

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-2xl font-bold text-green-700">Lista de Compras e Inventário</h2>
        <button
          onClick={() => setIsAdding(prev => !prev)}
          className="self-start sm:self-auto bg-green-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          {isAdding ? 'Cancelar' : '+ Adicionar item'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAddItem} className="bg-green-50 border border-green-100 rounded-lg p-4 mb-6 grid gap-4 md:grid-cols-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nome</label>
            <input
              type="text"
              value={newItem.name}
              onChange={e => setNewItem(prev => ({ ...prev, name: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Ex: Peito de frango"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Quantidade</label>
            <input
              type="text"
              value={newItem.quantity}
              onChange={e => setNewItem(prev => ({ ...prev, quantity: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Ex: 2 kg"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Categoria</label>
            <select
              value={newItem.category}
              onChange={e => setNewItem(prev => ({ ...prev, category: e.target.value as Category }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500"
            >
              {CATEGORY_OPTIONS.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-4 flex justify-end">
            <button type="submit" className="bg-green-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              Salvar item
            </button>
          </div>
        </form>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* FIX: Use Object.keys with a type assertion to ensure type safety when iterating over groupedInventory, as Object.entries can lead to 'unknown' type for values with some TypeScript configurations. */}
        {(Object.keys(groupedInventory) as Category[]).map((category) => (
          <div key={category} className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg text-gray-800 border-b-2 border-green-200 pb-2 mb-3">{category}</h3>
            <ul className="space-y-2">
              {groupedInventory[category].map(item => (
                <li key={item.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`item-${item.id}`}
                    checked={item.checked}
                    onChange={() => toggleCheck(item.id)}
                    className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer"
                  />
                  <label
                    htmlFor={`item-${item.id}`}
                    className={`ml-3 text-gray-700 cursor-pointer ${item.checked ? 'line-through text-gray-400' : ''}`}
                  >
                    {item.name} - <span className="text-sm text-gray-500">{item.quantity}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};