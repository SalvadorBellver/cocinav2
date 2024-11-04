import React, { useState } from 'react';
import { Clock, CheckCircle2, Trash2, RefreshCw, AlertCircle, Wand2, MoreVertical } from 'lucide-react';
import { Recipe } from '../types';
import { useMenuStore } from '../store/menuStore';
import { SwapMenu } from './SwapMenu';

interface Props {
  recipe: Recipe;
  date: string;
  mealType: Recipe['mealType'];
}

export const DraggableRecipe = ({ recipe, date, mealType }: Props) => {
  const { markRecipeCompleted, removeRecipeFromDay, swapRecipes, regenerateRecipe } = useMenuStore();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSwapMenu, setShowSwapMenu] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleDelete = () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }
    removeRecipeFromDay(date, mealType, recipe.id);
    setShowDeleteConfirm(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const handleSwap = (targetDate: string, targetMealType: Recipe['mealType']) => {
    swapRecipes(date, mealType, recipe.id, targetDate, targetMealType);
    setShowSwapMenu(false);
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      regenerateRecipe(date, mealType, recipe.id);
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <>
      <div className="meal-card card p-4 flex items-center gap-4 animate-slide-up group hover:scale-[1.02] transition-transform duration-300">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h5 className="font-medium text-gray-900 truncate">{recipe.name}</h5>
            {recipe.isThermomix && (
              <span className="px-2 py-0.5 bg-pastel-blue-100 text-pastel-blue-600 rounded-full text-xs">
                Thermomix
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-500 mt-1 flex-wrap">
            <span className="flex items-center gap-1.5 glass-effect px-2 py-1 rounded-lg">
              <Clock className="w-3.5 h-3.5" />
              {recipe.preparationTime} min
            </span>
            {recipe.calories && (
              <span className="flex items-center gap-1.5 glass-effect px-2 py-1 rounded-lg">
                {recipe.calories} kcal/ración
              </span>
            )}
          </div>
        </div>
        
        {/* Desktop Actions */}
        <div className="hidden sm:flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <button
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="btn p-2 rounded-xl text-pastel-pink-500 hover:text-pastel-pink-600 hover:bg-pastel-pink-50 transition-all duration-300"
            title="Generar otra receta"
          >
            <Wand2 className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setShowSwapMenu(true)}
            className="btn p-2 rounded-xl text-pastel-blue-500 hover:text-pastel-blue-600 hover:bg-pastel-blue-50 transition-all duration-300"
            title="Intercambiar receta"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => markRecipeCompleted(date, mealType, recipe.id, !recipe.completed)}
            className={`btn p-2 rounded-xl transition-all duration-300 ${
              recipe.completed 
                ? 'text-success-500 bg-success-50 hover:bg-success-100' 
                : 'text-gray-400 hover:text-success-500 hover:bg-success-50'
            }`}
            title={recipe.completed ? 'Marcar como no completada' : 'Marcar como completada'}
          >
            <CheckCircle2 className="w-4 h-4" />
          </button>

          <button
            onClick={handleDelete}
            className={`btn p-2 rounded-xl transition-all duration-300 ${
              showDeleteConfirm
                ? 'text-danger-500 bg-danger-50'
                : 'text-gray-400 hover:text-danger-500 hover:bg-danger-50'
            }`}
            title={showDeleteConfirm ? 'Confirmar eliminación' : 'Eliminar receta'}
          >
            {showDeleteConfirm ? (
              <AlertCircle className="w-4 h-4" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Mobile Actions Button */}
        <div className="sm:hidden">
          <button
            onClick={() => setShowActions(!showActions)}
            className="btn p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-50"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Actions Menu */}
        {showActions && (
          <div className="absolute right-4 top-full mt-2 bg-white rounded-lg shadow-lg p-2 z-10 animate-fade-in sm:hidden">
            <div className="space-y-1">
              <button
                onClick={handleRegenerate}
                disabled={isRegenerating}
                className="btn w-full text-left px-3 py-2 text-sm rounded-lg flex items-center gap-2"
              >
                <Wand2 className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
                Regenerar
              </button>
              <button
                onClick={() => {
                  setShowSwapMenu(true);
                  setShowActions(false);
                }}
                className="btn w-full text-left px-3 py-2 text-sm rounded-lg flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Intercambiar
              </button>
              <button
                onClick={() => {
                  markRecipeCompleted(date, mealType, recipe.id, !recipe.completed);
                  setShowActions(false);
                }}
                className="btn w-full text-left px-3 py-2 text-sm rounded-lg flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                {recipe.completed ? 'Desmarcar' : 'Completar'}
              </button>
              <button
                onClick={() => {
                  handleDelete();
                  setShowActions(false);
                }}
                className="btn w-full text-left px-3 py-2 text-sm rounded-lg flex items-center gap-2 text-danger-500"
              >
                <Trash2 className="w-4 h-4" />
                Eliminar
              </button>
            </div>
          </div>
        )}

        {showDeleteConfirm && (
          <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg p-4 z-10 animate-fade-in">
            <p className="text-sm text-gray-700 mb-3">¿Estás seguro de eliminar esta receta?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={handleCancelDelete}
                className="btn btn-secondary text-xs py-1"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="btn btn-primary text-xs py-1"
              >
                Eliminar
              </button>
            </div>
          </div>
        )}
      </div>

      {showSwapMenu && (
        <SwapMenu
          currentDate={date}
          currentMealType={mealType}
          onSwap={handleSwap}
          onClose={() => setShowSwapMenu(false)}
        />
      )}
    </>
  );
};