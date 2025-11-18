import React, { useState } from 'react';
import type { UserProfile, GeneratedDietPlan } from '../types';
import { LoadingSpinner } from './LoadingSpinner';
import { DAYS_OF_WEEK, MEAL_TIMES } from '../constants';


interface DietPlanViewProps {
    onGenerate: (profiles: UserProfile[]) => void;
    plan: GeneratedDietPlan | null;
    isGenerating: boolean;
    error: string | null;
    onApplyPlan: () => void;
}

const ProfileInput: React.FC<{ profile: UserProfile, onChange: (field: keyof Omit<UserProfile, 'id'>, value: string) => void }> = ({ profile, onChange }) => {
    return (
        <div className="bg-gray-50 p-4 rounded-lg border">
            <h3 className="font-semibold text-lg text-gray-800 mb-4">Pessoa {profile.id}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor={`gender-${profile.id}`} className="block text-sm font-medium text-gray-700">Gênero</label>
                    <select
                        id={`gender-${profile.id}`}
                        value={profile.gender}
                        onChange={(e) => onChange('gender', e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                    >
                        <option>Mulher</option>
                        <option>Homem</option>
                    </select>
                </div>
                <div>
                    <label htmlFor={`age-${profile.id}`} className="block text-sm font-medium text-gray-700">Idade</label>
                    <input
                        type="number"
                        id={`age-${profile.id}`}
                        value={profile.age}
                        onChange={(e) => onChange('age', e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        placeholder="ex: 35"
                        aria-label={`Idade da Pessoa ${profile.id}`}
                    />
                </div>
                <div>
                    <label htmlFor={`weight-${profile.id}`} className="block text-sm font-medium text-gray-700">Peso (kg)</label>
                    <input
                        type="number"
                        id={`weight-${profile.id}`}
                        value={profile.weight}
                        onChange={(e) => onChange('weight', e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        placeholder="ex: 82"
                        aria-label={`Peso da Pessoa ${profile.id}`}
                    />
                </div>
                <div>
                    <label htmlFor={`height-${profile.id}`} className="block text-sm font-medium text-gray-700">Altura (cm)</label>
                    <input
                        type="number"
                        id={`height-${profile.id}`}
                        value={profile.height}
                        onChange={(e) => onChange('height', e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        placeholder="ex: 150"
                        aria-label={`Altura da Pessoa ${profile.id}`}
                    />
                </div>
            </div>
        </div>
    );
};

const PlanDisplay: React.FC<{ plan: GeneratedDietPlan }> = ({ plan }) => {
    return (
        <div className="space-y-6">
            {DAYS_OF_WEEK.map(day => (
                plan[day] && (
                    <div key={day}>
                        <h3 className="text-xl font-bold text-green-700 mb-3">{day}</h3>
                        <div className="space-y-4 pl-4 border-l-2 border-green-200">
                            {MEAL_TIMES.map(mealTime => (
                                plan[day][mealTime] && (
                                    <div key={mealTime}>
                                        <h4 className="font-semibold text-gray-800">{mealTime}</h4>
                                        <div className="text-sm text-gray-600 mt-1 space-y-1">
                                            <p><strong>Pessoa 1:</strong> {plan[day][mealTime]['Pessoa 1']}</p>
                                            <p><strong>Pessoa 2:</strong> {plan[day][mealTime]['Pessoa 2']}</p>
                                        </div>
                                    </div>
                                )
                            ))}
                        </div>
                    </div>
                )
            ))}
        </div>
    );
};


export const DietPlanView: React.FC<DietPlanViewProps> = ({ onGenerate, plan, isGenerating, error, onApplyPlan }) => {
    const [profiles, setProfiles] = useState<UserProfile[]>([
        { id: 1, gender: 'Mulher', age: '35', weight: '82', height: '150' },
        { id: 2, gender: 'Homem', age: '32', weight: '100', height: '170' },
    ]);

    const handleProfileChange = (id: number, field: keyof Omit<UserProfile, 'id'>, value: string) => {
        setProfiles(profiles.map(p => p.id === id ? { ...p, [field]: value } : p));
    };

    const handleSubmit = () => {
        // Basic validation
        if (profiles.some(p => !p.age || !p.weight || !p.height)) {
            alert('Por favor, preencha todos os campos de perfil.');
            return;
        }
        onGenerate(profiles);
    }
    
    return (
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
            <div className="max-w-4xl mx-auto">
                 <h2 className="text-2xl font-bold text-green-700 mb-2">Gerador de Plano Alimentar</h2>
                 <p className="text-gray-600 mb-6">Insira os dados abaixo para gerar um plano alimentar personalizado com base no seu inventário de alimentos.</p>
                
                <div className="space-y-6">
                    {profiles.map(p => (
                       <ProfileInput key={p.id} profile={p} onChange={(field, value) => handleProfileChange(p.id, field, value)} />
                    ))}
                </div>

                <div className="mt-8 text-center">
                    <button
                        onClick={handleSubmit}
                        disabled={isGenerating}
                        className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
                    >
                        {isGenerating ? (
                           <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                           </svg>
                        ) : null}
                        <span>
                           {isGenerating ? 'Gerando Plano...' : 'Gerar Plano Alimentar'}
                        </span>
                    </button>
                </div>
                
                {error && <div className="mt-6 text-center p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}

                {plan && !isGenerating && (
                    <div className="mt-8 pt-6 border-t">
                         <div className="text-center mb-6">
                             <h3 className="text-2xl font-bold text-green-700 mb-4">Seu Plano Alimentar Sugerido</h3>
                             <button
                                 onClick={onApplyPlan}
                                 className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                             >
                                 Aplicar ao Planejador
                             </button>
                         </div>
                         <div className="p-4 bg-gray-50 rounded-lg text-gray-700 font-sans text-sm leading-relaxed">
                            <PlanDisplay plan={plan} />
                         </div>
                    </div>
                )}
            </div>
        </div>
    );
};