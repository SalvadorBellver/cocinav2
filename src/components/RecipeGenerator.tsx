import React, { useState } from 'react';
import { ChefHat, Loader2, Sparkles } from 'lucide-react';
import { Recipe } from '../types';

interface Props {
  onRecipeGenerated: (recipe: Recipe) => void;
}

export const RecipeGenerator = ({ onRecipeGenerated }: Props) => {
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState('');

  const generateRecipe = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const mockRecipe: Recipe = {
        id: Date.now().toString(),
        name: "Pasta con Verduras",
        ingredients: ["300g de pasta", "2 zanahorias", "1 pimiento", "Aceite de oliva"],
        instructions: ["Cocer la pasta", "Saltear las verduras", "Mezclar todo"],
        servings: 4,
        preparationTime: 30,
        mealType: 'comida'
      };
      onRecipeGenerated(mockRecipe);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary-50 rounded-lg">
          <ChefHat className="w-6 h-6 text-primary-600" />
        </div>
        <h2 className="text-xl font-medium text-gray-900">Generar Nueva Receta</h2>
      </div>
      
      <textarea
        className="input mb-4 min-h-[100px] resize-none"
        placeholder="Describe tus preferencias o restricciones dietéticas..."
        value={preferences}
        onChange={(e) => setPreferences(e.target.value)}
      />
      
      <button
        onClick={generateRecipe}
        disabled={loading}
        className="btn btn-primary w-full py-2.5 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Generando...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5 mr-2" />
            Generar Receta
          </>
        )}
      </button>
    </div>
  );
};