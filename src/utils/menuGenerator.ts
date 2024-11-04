import type { Recipe } from '../types';

export const getRandomRecipe = (
  recipes: Recipe[], 
  usedNames: Set<string>,
  mealType: Recipe['mealType'],
  currentRecipeName?: string
): Recipe | null => {
  // Filter available recipes
  const availableRecipes = recipes.filter(recipe => {
    const isCorrectType = recipe.mealType === mealType;
    const isUnused = !usedNames.has(recipe.name.toLowerCase());
    const isDifferent = !currentRecipeName || 
      recipe.name.toLowerCase() !== currentRecipeName.toLowerCase();
    
    return isCorrectType && isUnused && isDifferent;
  });

  if (availableRecipes.length === 0) {
    // If no unused recipes are available, reset the used names and try again
    usedNames.clear();
    return getRandomRecipe(recipes, usedNames, mealType, currentRecipeName);
  }
  
  // Select random recipe from available ones
  const randomIndex = Math.floor(Math.random() * availableRecipes.length);
  const selectedRecipe = availableRecipes[randomIndex];
  
  // Add the selected recipe name to used names
  usedNames.add(selectedRecipe.name.toLowerCase());
  
  // Return a new instance with a unique ID
  return {
    ...selectedRecipe,
    id: crypto.randomUUID()
  };
};