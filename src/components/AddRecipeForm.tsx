import React, { useState } from 'react';
import { Recipe } from '../types';
import { Plus, Minus } from 'lucide-react';

interface Props {
  onAddRecipe: (recipe: Omit<Recipe, 'id'>) => void;
  onCancel: () => void;
}

export const AddRecipeForm = ({ onAddRecipe, onCancel }: Props) => {
  const [recipe, setRecipe] = useState({
    name: '',
    ingredients: [''],
    instructions: [''],
    servings: 1,
    preparationTime: 30,
    mealType: 'comida' as Recipe['mealType'],
    calories: 0,
    isThermomix: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddRecipe({
      ...recipe,
      ingredients: recipe.ingredients.filter(Boolean),
      instructions: recipe.instructions.filter(Boolean),
    });
  };

  const addField = (field: 'ingredients' | 'instructions') => {
    setRecipe({
      ...recipe,
      [field]: [...recipe[field], ''],
    });
  };

  const removeField = (field: 'ingredients' | 'instructions', index: number) => {
    setRecipe({
      ...recipe,
      [field]: recipe[field].filter((_, i) => i !== index),
    });
  };

  const updateField = (field: 'ingredients' | 'instructions', index: number, value: string) => {
    setRecipe({
      ...recipe,
      [field]: recipe[field].map((item, i) => (i === index ? value : item)),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Receta</label>
        <input
          type="text"
          value={recipe.name}
          onChange={(e) => setRecipe({ ...recipe, name: e.target.value })}
          className="input"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Comida</label>
        <select
          value={recipe.mealType}
          onChange={(e) => setRecipe({ ...recipe, mealType: e.target.value as Recipe['mealType'] })}
          className="input"
        >
          <option value="comida">Comida</option>
          <option value="cena">Cena</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Porciones</label>
          <input
            type="number"
            min="1"
            value={recipe.servings}
            onChange={(e) => setRecipe({ ...recipe, servings: parseInt(e.target.value) })}
            className="input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tiempo (min)</label>
          <input
            type="number"
            min="1"
            value={recipe.preparationTime}
            onChange={(e) => setRecipe({ ...recipe, preparationTime: parseInt(e.target.value) })}
            className="input"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Calorías por ración</label>
        <input
          type="number"
          min="0"
          value={recipe.calories}
          onChange={(e) => setRecipe({ ...recipe, calories: parseInt(e.target.value) })}
          className="input"
        />
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={recipe.isThermomix}
            onChange={(e) => setRecipe({ ...recipe, isThermomix: e.target.checked })}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-sm font-medium text-gray-700">Receta para Thermomix</span>
        </label>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">Ingredientes</label>
          <button
            type="button"
            onClick={() => addField('ingredients')}
            className="btn btn-secondary py-1 px-2"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        {recipe.ingredients.map((ingredient, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={ingredient}
              onChange={(e) => updateField('ingredients', index, e.target.value)}
              className="input flex-1"
              placeholder="Añadir ingrediente"
            />
            {recipe.ingredients.length > 1 && (
              <button
                type="button"
                onClick={() => removeField('ingredients', index)}
                className="btn btn-secondary py-1 px-2"
              >
                <Minus className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">Instrucciones</label>
          <button
            type="button"
            onClick={() => addField('instructions')}
            className="btn btn-secondary py-1 px-2"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        {recipe.instructions.map((instruction, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={instruction}
              onChange={(e) => updateField('instructions', index, e.target.value)}
              className="input flex-1"
              placeholder="Añadir instrucción"
            />
            {recipe.instructions.length > 1 && (
              <button
                type="button"
                onClick={() => removeField('instructions', index)}
                className="btn btn-secondary py-1 px-2"
              >
                <Minus className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-3">
        <button type="button" onClick={onCancel} className="btn btn-secondary">
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary">
          Guardar Receta
        </button>
      </div>
    </form>
  );
};