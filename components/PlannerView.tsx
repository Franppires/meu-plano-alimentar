
import React from 'react';
import { DAYS_OF_WEEK, MEAL_TIME_CONFIG, MEAL_TIME_SUGGESTIONS } from '../constants';
import type { MealPlan } from '../types';
import { EditableMealCard } from './EditableMealCard';

interface PlannerViewProps {
  mealPlan: MealPlan;
  onUpdateMeal: (day: string, mealTime: string, value: string) => void;
}

export const PlannerView: React.FC<PlannerViewProps> = ({ mealPlan, onUpdateMeal }) => {
  const renderDesktopTable = () => (
    <div className="hidden md:block">
      <div className="overflow-x-auto">
        <div className="space-y-2 min-w-[960px]">
          <div className="grid gap-2 grid-cols-[140px_repeat(5,minmax(0,1fr))]">
            <div aria-hidden="true" />
            {MEAL_TIME_CONFIG.map(slot => (
              <div key={slot.id} className="rounded-lg bg-green-600 text-white text-center p-3">
                <p className="text-base font-semibold">{slot.label}</p>
                <p className="text-sm text-green-100 font-medium">{slot.time}</p>
              </div>
            ))}
          </div>
          {DAYS_OF_WEEK.map(day => (
            <div key={day} className="grid gap-2 grid-cols-[140px_repeat(5,minmax(0,1fr))]">
              <div className="bg-green-100 text-green-800 font-semibold flex items-center justify-center rounded-lg p-3">
                {day}
              </div>
              {MEAL_TIME_CONFIG.map(slot => (
                <EditableMealCard
                  key={`${day}-${slot.id}-desktop`}
                  day={day}
                  mealTime={slot.label}
                  meal={mealPlan[day]?.[slot.label] || ''}
                  placeholder={MEAL_TIME_SUGGESTIONS[slot.label]}
                  onUpdateMeal={onUpdateMeal}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMobileList = () => (
    <div className="md:hidden space-y-4">
      {DAYS_OF_WEEK.map(day => (
        <div key={`${day}-mobile`} className="border border-green-100 rounded-xl overflow-hidden shadow-sm">
          <div className="bg-green-100 text-green-800 font-semibold px-4 py-3">{day}</div>
          <div className="space-y-1 p-4">
            {MEAL_TIME_CONFIG.map(slot => (
              <div key={`${day}-${slot.id}-mobile`} className="space-y-2">
                <div className="flex items-center justify-between text-sm font-semibold text-green-700">
                  <span>{slot.label}</span>
                  <span className="text-gray-500">{slot.time}</span>
                </div>
                <EditableMealCard
                  day={day}
                  mealTime={slot.label}
                  meal={mealPlan[day]?.[slot.label] || ''}
                  placeholder={MEAL_TIME_SUGGESTIONS[slot.label]}
                  onUpdateMeal={onUpdateMeal}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
      {renderDesktopTable()}
      {renderMobileList()}
    </div>
  );
};
