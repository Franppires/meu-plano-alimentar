
import React, { useState } from 'react';
import type { StorageTip } from '../types';
import { LightbulbIcon, XMarkIcon } from './IconComponents';

interface TipsViewProps {
  tips: StorageTip[];
  onAddTip: (tip: StorageTip) => void;
}

const AddTipModal: React.FC<{ onSave: (tip: StorageTip) => void; onClose: () => void }> = ({ onSave, onClose }) => {
  const [foodItem, setFoodItem] = useState('');
  const [tip, setTip] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodItem.trim() || !tip.trim()) return;
    onSave({ foodItem, tip });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-green-700">Nova dica</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <XMarkIcon />
          </button>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Alimento</label>
            <input
              type="text"
              value={foodItem}
              onChange={e => setFoodItem(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Dica</label>
            <textarea
              value={tip}
              onChange={e => setTip(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500 resize-y"
              rows={4}
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700">
              Salvar dica
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const TipsView: React.FC<TipsViewProps> = ({ tips, onAddTip }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-2xl font-bold text-green-700">Dicas de armazenamento</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          + Nova dica
        </button>
      </div>
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
          <p className="text-gray-500 col-span-full text-center">Nenhuma dica cadastrada. Adicione uma nova ou gere com IA.</p>
        )}
      </div>
      {isModalOpen && (
        <AddTipModal
          onClose={() => setIsModalOpen(false)}
          onSave={tip => {
            onAddTip(tip);
            setIsModalOpen(false);
          }}
        />
      )}
    </>
  );
};
