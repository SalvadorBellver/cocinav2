export interface Recipe {
  id: string;
  name: string;
  ingredients: string[];
  instructions: string[];
  servings: number;
  preparationTime: number;
  mealType: 'comida' | 'cena';
  calories: number;
  isThermomix?: boolean;
  completed?: boolean;
}

export interface DayMenu {
  date: string;
  meals: {
    comida: Recipe[];
    cena: Recipe[];
  };
}

export interface WeeklyMenu {
  id: string;
  days: DayMenu[];
}

export interface PlannerPreferences {
  servings: number;
  includeThermomix: boolean;
  thermomixPercentage: number;
  dietaryPreferences?: string;
}