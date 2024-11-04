import React, { useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Recipe } from '../types';
import { useMenuStore } from '../store/menuStore';
import { X, ArrowLeftRight } from 'lucide-react';

interface Props {
  currentDate: string;
  currentMealType: Recipe['mealType'];
  onSwap: (targetDate: string, targetMealType: Recipe['mealType']) => void;
  onClose: () => void;
}

export const SwapMenu = ({ currentDate, currentMealType, onSwap, onClose }: Props) => {
  const { currentMenu } = useMenuStore();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  if (!currentMenu) return null;

  const mealTypes: Record<Recipe['mealType'], string> = {
    desayuno: 'Desayuno',
    comida: 'Comida',
    cena: 'Cena'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-500/20 backdrop-blur-sm">
      <div 
        ref={menuRef}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 animate-slide-up"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary-50 rounded-lg">
              <ArrowLeftRight className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Intercambiar Receta</h3>
              <p className="text-sm text-gray-500">Selecciona con qué comida intercambiar</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {currentMenu.days.map((day) => (
            <div key={day.date} className="space-y-2">
              <div className="text-sm font-medium text-gray-900 capitalize">
                {format(new Date(day.date), 'EEEE d MMM', { locale: es })}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(mealTypes)
                  .filter(([type]) => type !== 'desayuno')
                  .map(([type, label]) => {
                    // Skip current meal slot
                    if (day.date === currentDate && type === currentMealType) {
                      return null;
                    }

                    const recipes = day.meals[type as Recipe['mealType']];
                    const hasRecipes = recipes.length > 0;

                    return (
                      <button
                        key={`${day.date}-${type}`}
                        onClick={() => onSwap(day.date, type as Recipe['mealType'])}
                        disabled={!hasRecipes}
                        className={`text-left px-4 py-3 rounded-xl transition-all duration-300 ${
                          hasRecipes
                            ? 'hover:bg-primary-50 hover:text-primary-700 hover:ring-2 hover:ring-primary-100'
                            : 'opacity-50 cursor-not-allowed bg-gray-50'
                        }`}
                      >
                        <div className="text-sm font-medium">{label}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {hasRecipes 
                            ? recipes[0].name
                            : 'Sin receta'
                          }
                        </div>
                      </button>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};