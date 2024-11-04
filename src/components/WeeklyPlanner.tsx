import React, { useState } from 'react';
import { ChefHat, Loader2, Sparkles, Users } from 'lucide-react';
import { useMenuStore } from '../store/menuStore';
import type { PlannerPreferences } from '../types';

interface Props {
  onSuccess?: () => void;
}

export const WeeklyPlanner = ({ onSuccess }: Props) => {
  const { generateWeeklyPlan } = useMenuStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [preferences, setPreferences] = useState<PlannerPreferences>({
    servings: 4,
    includeThermomix: false,
    thermomixPercentage: 30,
    dietaryPreferences: '',
  });

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await generateWeeklyPlan(preferences);
      onSuccess?.();
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-neutral-50 rounded-lg">
          <ChefHat className="w-6 h-6 text-neutral-600" />
        </div>
        <h2 className="text-xl font-medium text-gray-900">Generar Plan Semanal</h2>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Número de Personas
          </label>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-400" />
            <input
              type="number"
              min="1"
              max="12"
              value={preferences.servings}
              onChange={(e) => setPreferences({
                ...preferences,
                servings: parseInt(e.target.value) || 4
              })}
              className="input flex-1"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Preferencias Dietéticas
          </label>
          <textarea
            className="input min-h-[80px] resize-none"
            placeholder="Ej: sin gluten, bajo en carbohidratos, vegetariano..."
            value={preferences.dietaryPreferences}
            onChange={(e) => setPreferences({
              ...preferences,
              dietaryPreferences: e.target.value
            })}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="useThermomix"
            checked={preferences.includeThermomix}
            onChange={(e) => setPreferences({
              ...preferences,
              includeThermomix: e.target.checked
            })}
            className="rounded border-gray-300 text-neutral-600 focus:ring-neutral-500"
          />
          <label htmlFor="useThermomix" className="text-sm text-gray-700">
            Incluir recetas para Thermomix
          </label>
        </div>

        {preferences.includeThermomix && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Porcentaje de recetas Thermomix
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="10"
              value={preferences.thermomixPercentage}
              onChange={(e) => setPreferences({
                ...preferences,
                thermomixPercentage: parseInt(e.target.value)
              })}
              className="w-full"
            />
            <div className="text-sm text-gray-500 mt-1">
              {preferences.thermomixPercentage}% de las recetas
            </div>
          </div>
        )}
      </div>

      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="btn btn-primary w-full py-3 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Generando Plan...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5 mr-2" />
            Generar Plan Semanal
          </>
        )}
      </button>
    </div>
  );
};