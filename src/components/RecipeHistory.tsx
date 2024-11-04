import React from 'react';
import { Clock, Users } from 'lucide-react';
import { useMenuStore } from '../store/menuStore';

export const RecipeHistory = () => {
  const { recipeHistory } = useMenuStore();

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <h2 className="text-xl font-semibold mb-4">Historial de Recetas</h2>
      <div className="space-y-4">
        {recipeHistory.map((recipe) => (
          <div
            key={recipe.id}
            className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-semibold mb-2">{recipe.name}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{recipe.servings} personas</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{recipe.preparationTime} min</span>
              </div>
            </div>
            {recipe.completed && (
              <span className="inline-block mt-2 text-sm text-green-600 bg-green-50 px-2 py-1 rounded">
                Completada
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};