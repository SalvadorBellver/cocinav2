import { create } from 'zustand';
import { startOfWeek, addDays, format } from 'date-fns';
import type { WeeklyMenu, DayMenu, Recipe, PlannerPreferences } from '../types';
import { mockRecipes } from './mockData';
import { calculateShoppingList } from '../utils/shoppingList';
import { getRandomRecipe } from '../utils/menuGenerator';

interface MenuState {
  currentMenu: WeeklyMenu | null;
  shoppingList: Map<string, { count: number; servings: number }>;
  initializeWeeklyMenu: () => void;
  generateWeeklyPlan: (preferences: PlannerPreferences) => Promise<void>;
  regenerateRecipe: (date: string, mealType: Recipe['mealType'], currentRecipeId: string) => void;
  markRecipeCompleted: (date: string, mealType: Recipe['mealType'], recipeId: string, completed: boolean) => void;
  removeRecipeFromDay: (date: string, mealType: Recipe['mealType'], recipeId: string) => void;
  addRecipeToDay: (date: string, mealType: Recipe['mealType'], recipe: Recipe) => void;
  updateRecipe: (date: string, mealType: Recipe['mealType'], recipe: Recipe) => void;
  swapRecipes: (fromDate: string, fromMealType: Recipe['mealType'], fromRecipeId: string, toDate: string, toMealType: Recipe['mealType']) => void;
}

const createEmptyDay = (date: Date): DayMenu => ({
  date: format(date, 'yyyy-MM-dd'),
  meals: {
    comida: [],
    cena: []
  },
});

const createInitialMenu = (): WeeklyMenu => {
  const startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => 
    createEmptyDay(addDays(startDate, i))
  );

  return {
    id: crypto.randomUUID(),
    days,
  };
};

export const useMenuStore = create<MenuState>((set, get) => ({
  currentMenu: createInitialMenu(),
  shoppingList: new Map(),

  initializeWeeklyMenu: () => {
    set({
      currentMenu: createInitialMenu(),
      shoppingList: new Map()
    });
  },

  generateWeeklyPlan: async (preferences: PlannerPreferences) => {
    const { currentMenu } = get();
    if (!currentMenu) return;

    const usedRecipes = new Set<string>();
    const newDays = currentMenu.days.map(day => {
      // Get a random recipe for lunch (comida)
      const comida = getRandomRecipe(mockRecipes, usedRecipes, 'comida');
      
      // Get a random recipe for dinner (cena)
      const cena = getRandomRecipe(mockRecipes, usedRecipes, 'cena');

      return {
        ...day,
        meals: {
          comida: comida ? [{ ...comida, servings: preferences.servings }] : [],
          cena: cena ? [{ ...cena, servings: preferences.servings }] : []
        }
      };
    });

    const newMenu = { ...currentMenu, days: newDays };
    const newShoppingList = calculateShoppingList(newMenu);

    set({
      currentMenu: newMenu,
      shoppingList: newShoppingList
    });
  },

  regenerateRecipe: (date, mealType, currentRecipeId) => {
    const { currentMenu } = get();
    if (!currentMenu) return;

    const currentDay = currentMenu.days.find(day => day.date === date);
    const currentRecipe = currentDay?.meals[mealType].find(recipe => recipe.id === currentRecipeId);
    if (!currentRecipe) return;

    const usedRecipes = new Set<string>();
    currentMenu.days.forEach(day => {
      Object.values(day.meals).forEach(meals => {
        meals.forEach(recipe => {
          if (recipe.id !== currentRecipeId) {
            usedRecipes.add(recipe.name.toLowerCase());
          }
        });
      });
    });

    const newRecipe = getRandomRecipe(
      mockRecipes,
      usedRecipes,
      mealType,
      currentRecipe.name
    );

    if (!newRecipe) return;

    const newDays = currentMenu.days.map(day => {
      if (day.date !== date) return day;

      return {
        ...day,
        meals: {
          ...day.meals,
          [mealType]: day.meals[mealType].map(recipe =>
            recipe.id === currentRecipeId 
              ? { ...newRecipe, servings: currentRecipe.servings }
              : recipe
          )
        }
      };
    });

    const newMenu = { ...currentMenu, days: newDays };
    const newShoppingList = calculateShoppingList(newMenu);

    set({
      currentMenu: newMenu,
      shoppingList: newShoppingList
    });
  },

  markRecipeCompleted: (date, mealType, recipeId, completed) => {
    set((state) => {
      if (!state.currentMenu) return state;

      const newDays = state.currentMenu.days.map((day) => {
        if (day.date !== date) return day;

        const newMeals = {
          ...day.meals,
          [mealType]: day.meals[mealType].map((recipe) =>
            recipe.id === recipeId ? { ...recipe, completed } : recipe
          ),
        };

        return { ...day, meals: newMeals };
      });

      return {
        ...state,
        currentMenu: { ...state.currentMenu, days: newDays },
      };
    });
  },

  removeRecipeFromDay: (date, mealType, recipeId) => {
    set((state) => {
      if (!state.currentMenu) return state;

      const newDays = state.currentMenu.days.map((day) => {
        if (day.date !== date) return day;

        const newMeals = {
          ...day.meals,
          [mealType]: day.meals[mealType].filter((recipe) => recipe.id !== recipeId),
        };

        return { ...day, meals: newMeals };
      });

      const newMenu = { ...state.currentMenu, days: newDays };
      const newShoppingList = calculateShoppingList(newMenu);

      return {
        ...state,
        currentMenu: newMenu,
        shoppingList: newShoppingList
      };
    });
  },

  addRecipeToDay: (date, mealType, recipe) => {
    set((state) => {
      if (!state.currentMenu) return state;

      const newDays = state.currentMenu.days.map((day) => {
        if (day.date !== date) return day;

        const newMeals = {
          ...day.meals,
          [mealType]: [...day.meals[mealType], recipe],
        };

        return { ...day, meals: newMeals };
      });

      const newMenu = { ...state.currentMenu, days: newDays };
      const newShoppingList = calculateShoppingList(newMenu);

      return {
        ...state,
        currentMenu: newMenu,
        shoppingList: newShoppingList
      };
    });
  },

  updateRecipe: (date, mealType, recipe) => {
    set((state) => {
      if (!state.currentMenu) return state;

      const newDays = state.currentMenu.days.map((day) => {
        if (day.date !== date) return day;

        const newMeals = {
          ...day.meals,
          [mealType]: day.meals[mealType].map((r) =>
            r.id === recipe.id ? recipe : r
          ),
        };

        return { ...day, meals: newMeals };
      });

      const newMenu = { ...state.currentMenu, days: newDays };
      const newShoppingList = calculateShoppingList(newMenu);

      return {
        ...state,
        currentMenu: newMenu,
        shoppingList: newShoppingList
      };
    });
  },

  swapRecipes: (fromDate, fromMealType, fromRecipeId, toDate, toMealType) => {
    set((state) => {
      if (!state.currentMenu) return state;

      let fromRecipe: Recipe | undefined;
      let toRecipe: Recipe | undefined;

      const newDays = state.currentMenu.days.map((day) => {
        const newMeals = { ...day.meals };

        if (day.date === fromDate) {
          fromRecipe = newMeals[fromMealType].find((r) => r.id === fromRecipeId);
          newMeals[fromMealType] = newMeals[fromMealType].filter(
            (r) => r.id !== fromRecipeId
          );
        }

        if (day.date === toDate) {
          toRecipe = newMeals[toMealType][0];
          if (fromRecipe) {
            newMeals[toMealType] = [fromRecipe];
          }
        }

        if (day.date === fromDate && toRecipe) {
          newMeals[fromMealType] = [toRecipe];
        }

        return { ...day, meals: newMeals };
      });

      const newMenu = { ...state.currentMenu, days: newDays };
      const newShoppingList = calculateShoppingList(newMenu);

      return {
        ...state,
        currentMenu: newMenu,
        shoppingList: newShoppingList
      };
    });
  },
}));