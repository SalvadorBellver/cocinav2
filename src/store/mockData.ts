import type { Recipe } from '../types';

export const mockRecipes: Recipe[] = [
  {
    id: '1',
    name: 'Pasta con Verduras',
    ingredients: [
      '300g pasta',
      '2 zanahorias',
      '1 pimiento',
      '3 cucharadas aceite de oliva',
      '1 cucharadita sal'
    ],
    instructions: ['Cocer la pasta', 'Saltear las verduras', 'Mezclar todo'],
    servings: 4,
    preparationTime: 30,
    mealType: 'comida',
    calories: 450,
    isThermomix: false
  },
  {
    id: '2',
    name: 'Sopa de Verduras Thermomix',
    ingredients: [
      '500g verduras variadas',
      '1L caldo',
      '1 cucharadita sal',
      '1 pizca pimienta'
    ],
    instructions: ['Añadir ingredientes', 'Programar Thermomix', 'Servir caliente'],
    servings: 4,
    preparationTime: 25,
    mealType: 'cena',
    calories: 200,
    isThermomix: true
  },
  {
    id: '3',
    name: 'Pollo al Horno con Patatas',
    ingredients: [
      '1kg pollo',
      '500g patatas',
      '4 cucharadas aceite',
      '1 sobre hierbas provenzales'
    ],
    instructions: ['Preparar el pollo', 'Hornear', 'Servir'],
    servings: 4,
    preparationTime: 60,
    mealType: 'comida',
    calories: 550,
    isThermomix: false
  }
];