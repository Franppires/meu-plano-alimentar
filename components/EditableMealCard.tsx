
import React, { useState, useRef, useEffect } from 'react';

interface EditableMealCardProps {
  day: string;
  mealTime: string;
  meal: string;
  onUpdateMeal: (day: string, mealTime: string, value: string) => void;
}

export const EditableMealCard: React.FC<EditableMealCardProps> = ({ day, mealTime, meal, onUpdateMeal }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(meal);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setText(meal);
  }, [meal]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    if (text !== meal) {
      onUpdateMeal(day, mealTime, text);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleBlur();
    }
  };
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  }

  return (
    <div
      className="bg-gray-100 rounded-lg p-3 min-h-[100px] flex items-center justify-center cursor-pointer hover:bg-green-50 transition-colors"
      onClick={() => !isEditing && setIsEditing(true)}
    >
      {isEditing ? (
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full h-full bg-transparent resize-none border-none focus:ring-0 p-0 text-center text-sm text-gray-700"
          placeholder="Adicionar refeição..."
        />
      ) : (
        <p className={`text-sm text-center ${text ? 'text-gray-700' : 'text-gray-400'}`}>
          {text || '+ Adicionar'}
        </p>
      )}
    </div>
  );
};
