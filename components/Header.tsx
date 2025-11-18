import React from 'react';
import type { View } from '../types';
import { CalendarIcon, ClipboardListIcon, BookOpenIcon, LightbulbIcon, UserGroupIcon } from './IconComponents';

interface HeaderProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeView, setActiveView }) => {
  const navItems = [
    { id: 'planner', label: 'Planejador', icon: <CalendarIcon /> },
    { id: 'inventory', label: 'Inventário', icon: <ClipboardListIcon /> },
    { id: 'recipes', label: 'Receitas', icon: <BookOpenIcon /> },
    { id: 'tips', label: 'Dicas', icon: <LightbulbIcon /> },
    { id: 'diet', label: 'Plano Alimentar', icon: <UserGroupIcon /> },
  ];

  return (
    <header className="bg-white rounded-lg shadow-md p-2 sticky top-4 z-10">
      <nav className="flex items-center justify-center space-x-1 sm:space-x-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id as View)}
            className={`flex flex-col sm:flex-row items-center justify-center space-x-0 sm:space-x-2 px-2 py-2 text-xs sm:text-sm font-medium rounded-md transition-all duration-200 ease-in-out w-full sm:w-auto
              ${
                activeView === item.id
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-green-100 hover:text-green-800'
              }
            `}
            aria-current={activeView === item.id ? 'page' : undefined}
          >
            {item.icon}
            <span className="mt-1 sm:mt-0">{item.label}</span>
          </button>
        ))}
      </nav>
    </header>
  );
};
