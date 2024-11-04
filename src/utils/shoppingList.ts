import type { WeeklyMenu } from '../types';

interface IngredientItem {
  ingredient: string;
  quantity: number;
  unit: string;
}

const parseIngredient = (ingredient: string): IngredientItem => {
  // Match patterns like "300g pasta" or "2 unidades tomate"
  const match = ingredient.match(/^(\d+(?:\.\d+)?)\s*([a-zA-Z]+)?\s*(.+)$/);
  if (match) {
    return {
      quantity: parseFloat(match[1]),
      unit: match[2] || 'unidades',
      ingredient: match[3].toLowerCase().trim(),
    };
  }
  return {
    quantity: 1,
    unit: 'unidades',
    ingredient: ingredient.toLowerCase().trim(),
  };
};

export const calculateShoppingList = (menu: WeeklyMenu | null): Map<string, { count: number; servings: number }> => {
  if (!menu?.days) return new Map();

  const shoppingList = new Map<string, { count: number; servings: number }>();

  menu.days.forEach(day => {
    Object.values(day.meals).forEach(mealList => {
      mealList.forEach(meal => {
        if (!meal?.ingredients) return;
        
        meal.ingredients.forEach(ingredientStr => {
          const { ingredient, quantity, unit } = parseIngredient(ingredientStr);
          const key = `${quantity} ${unit} ${ingredient}`;
          
          const current = shoppingList.get(key) || { count: 0, servings: meal.servings };
          shoppingList.set(key, {
            count: current.count + 1,
            servings: meal.servings
          });
        });
      });
    });
  });

  return shoppingList;
}