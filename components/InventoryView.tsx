

import React from 'react';
import type { Ingredient, Category } from '../types';

interface InventoryViewProps {
  inventory: Ingredient[];
  setInventory: React.Dispatch<React.SetStateAction<Ingredient[]>>;
}

export const InventoryView: React.FC<InventoryViewProps> = ({ inventory, setInventory }) => {
  const toggleCheck = (id: string) => {
    setInventory(
      inventory.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
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
      <h2 className="text-2xl font-bold text-green-700 mb-6">Lista de Compras e Inventário</h2>
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