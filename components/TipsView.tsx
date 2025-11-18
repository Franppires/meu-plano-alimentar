
import React from 'react';
import type { StorageTip } from '../types';
import { LightbulbIcon } from './IconComponents';

export const TipsView: React.FC<{ tips: StorageTip[] }> = ({ tips }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tips.length > 0 ? (
        tips.map((tip, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg p-6 flex">
            <div className="flex-shrink-0 mr-4">
              <div className="bg-yellow-100 text-yellow-600 rounded-full p-3">
                <LightbulbIcon />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">{tip.foodItem}</h3>
              <p className="text-gray-600 mt-1">{tip.tip}</p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 col-span-full text-center">Nenhuma dica de armazenamento gerada.</p>
      )}
    </div>
  );
};
