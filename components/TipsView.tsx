import React, { useState } from 'react';
import type { StorageTip } from '../types';
import { LightbulbIcon, PencilIcon, XMarkIcon } from './IconComponents';
import { EditableTipModal } from './EditableTipModal';

const TipModal: React.FC<{ tip: StorageTip; onClose: () => void; onEdit: () => void }> = ({ tip, onClose, onEdit }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-green-700 flex items-center">
            <LightbulbIcon />
            <span className="ml-2">{tip.foodItem}</span>
          </h2>
          <div className="flex items-center gap-4">
            <button onClick={onEdit} className="text-gray-500 hover:text-blue-600">
              {/* <PencilIcon /> */}
            </button>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
              {/* <XMarkIcon /> */}
            </button>
          </div>
        </div>
        <p className="text-gray-600">{tip.tip}</p>
      </div>
    </div>
  );
};

interface TipsViewProps {
  tips: StorageTip[];
  onSave: (updatedTip: StorageTip) => void;
  onDelete: (tipId: string) => void;
}

export const TipsView: React.FC<TipsViewProps> = ({ tips, onSave, onDelete }) => {
  const [selectedTip, setSelectedTip] = useState<StorageTip | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCloseModal = () => {
    setSelectedTip(null);
    setIsEditing(false);
  };

  return (
    <>
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-green-700 mb-6">Dicas de armazenamento</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {tips.length > 0 ? (
            tips.map((tip) => (
              <div
                key={tip.id}
                className="bg-gray-50 rounded-xl shadow-md p-4 sm:p-6 flex items-start border border-gray-200 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedTip(tip)}
              >
                <div className="flex-shrink-0 mr-3 sm:mr-4">
                  <div className="bg-yellow-100 text-yellow-600 rounded-full p-2 sm:p-3">
                    <LightbulbIcon />
                  </div>
                </div>
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-gray-800 break-words">{tip.foodItem}</h3>
                  <p className="text-sm sm:text-base text-gray-600 mt-1 break-words">{tip.tip}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center py-8">Nenhuma dica de armazenamento disponível.</p>
          )}
        </div>
      </div>
      {selectedTip && !isEditing && (
        <TipModal tip={selectedTip} onClose={handleCloseModal} onEdit={handleEditClick} />
      )}
      {selectedTip && isEditing && (
        <EditableTipModal
          tip={selectedTip}
          onSave={onSave}
          onDelete={onDelete}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};