
import React from 'react';
import { DAYS_OF_WEEK, MEAL_TIMES } from '../constants';
import type { MealPlan } from '../types';
import { EditableMealCard } from './EditableMealCard';

interface PlannerViewProps {
  mealPlan: MealPlan;
  onUpdateMeal: (day: string, mealTime: string, value: string) => void;
}

export const PlannerView: React.FC<PlannerViewProps> = ({ mealPlan, onUpdateMeal }) => {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
      <div className="overflow-x-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-1 min-w-[700px] md:min-w-full">
          {/* Header for meal times */}
          <div className="hidden lg:block"></div>
          {MEAL_TIMES.map(time => (
            <div key={time} className="text-center font-bold text-green-700 p-2 col-span-1 lg:col-span-1 hidden md:block">{time}</div>
          ))}
          {/* Mobile headers inside grid */}
          <div className="md:hidden"></div>
          <div className="text-center font-bold text-green-700 p-2 md:hidden">Café da Manhã</div>
          <div className="text-center font-bold text-green-700 p-2 md:hidden">Almoço</div>
          <div className="text-center font-bold text-green-700 p-2 md:hidden">Jantar</div>

          {DAYS_OF_WEEK.map(day => (
            <React.Fragment key={day}>
              <div className="bg-green-100 text-green-800 font-semibold flex items-center justify-center p-3 rounded-lg text-center">{day}</div>
              {MEAL_TIMES.map(time => (
                <EditableMealCard
                  key={`${day}-${time}`}
                  day={day}
                  mealTime={time}
                  meal={mealPlan[day]?.[time] || ''}
                  onUpdateMeal={onUpdateMeal}
                />
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
