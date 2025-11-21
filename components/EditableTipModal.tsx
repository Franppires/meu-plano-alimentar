import React, { useState } from 'react';
import type { StorageTip } from '../types';
// import { CheckIcon, TrashIcon, XMarkIcon } from './IconComponents';

interface EditableTipModalProps {
  tip: StorageTip;
  onSave: (updatedTip: StorageTip) => void;
  onDelete: (tipId: string) => void;
  onClose: () => void;
}

export const EditableTipModal: React.FC<EditableTipModalProps> = ({ tip, onSave, onDelete, onClose }) => {
  const [editedTip, setEditedTip] = useState<StorageTip>(tip);

  const handleSave = () => {
    onSave(editedTip);
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm(`Tem certeza que deseja excluir a dica para "${tip.foodItem}"?`)) {
      onDelete(tip.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-xl max-h-[95vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-green-800">Editar Dica</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition-colors">
            {/* <XMarkIcon /> */}
          </button>
        </div>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="foodItem" className="block text-lg font-semibold text-gray-700 mb-2">Alimento</label>
            <input
              id="foodItem"
              type="text"
              value={editedTip.foodItem}
              onChange={(e) => setEditedTip({ ...editedTip, foodItem: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
            />
          </div>

          <div>
            <label htmlFor="tip" className="block text-lg font-semibold text-gray-700 mb-2">Dica de Armazenamento</label>
            <textarea
              id="tip"
              value={editedTip.tip}
              onChange={(e) => setEditedTip({ ...editedTip, tip: e.target.value })}
              rows={5}
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
            Excluir Dica
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
