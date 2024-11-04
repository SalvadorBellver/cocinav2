import React, { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, Plus, UtensilsCrossed, Download } from 'lucide-react';
import { useMenuStore } from '../store/menuStore';
import { Recipe } from '../types';
import { Modal } from './Modal';
import { AddRecipeForm } from './AddRecipeForm';
import { DraggableRecipe } from './DraggableRecipe';
import { generatePDF } from '../utils/pdfGenerator';

export const WeeklyCalendar = () => {
  const { currentMenu, addRecipeToDay } = useMenuStore();

  const [recipeModal, setRecipeModal] = useState<{
    isOpen: boolean;
    date: string;
    mealType: Recipe['mealType'];
    recipe?: Recipe;
    mode: 'add' | 'edit';
  }>({
    isOpen: false,
    date: '',
    mealType: 'comida',
    mode: 'add',
  });

  const handleSaveRecipe = (recipe: Omit<Recipe, 'id'>) => {
    const newRecipe: Recipe = {
      ...recipe,
      id: crypto.randomUUID(),
    };
    addRecipeToDay(recipeModal.date, recipeModal.mealType, newRecipe);
    setRecipeModal({ isOpen: false, date: '', mealType: 'comida', mode: 'add' });
  };

  const handleDownloadPDF = () => {
    if (currentMenu) {
      generatePDF(currentMenu);
    }
  };

  const renderMealSection = (date: string, mealType: Recipe['mealType'], meals: Recipe[]) => (
    <div className="mb-8 last:mb-0">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-pastel-pink-50 to-pastel-blue-50 rounded-xl">
            <UtensilsCrossed className="w-4 h-4 text-pastel-pink-500" />
          </div>
          <h4 className="text-sm font-semibold text-gray-900 capitalize">
            {mealType}
          </h4>
        </div>
        <button 
          onClick={() => setRecipeModal({ isOpen: true, date, mealType, mode: 'add' })}
          className="btn py-2 px-3 text-sm text-pastel-pink-500 hover:text-pastel-pink-600 hover:bg-pastel-pink-50 rounded-xl transition-all duration-300 group glass-effect"
        >
          <Plus className="w-4 h-4 mr-1.5 transition-transform group-hover:scale-110 group-hover:rotate-90" />
          <span className="hidden sm:inline">Agregar</span>
        </button>
      </div>
      <div className="space-y-3">
        {meals.map((recipe) => (
          <DraggableRecipe
            key={recipe.id}
            recipe={recipe}
            date={date}
            mealType={mealType}
          />
        ))}
        {meals.length === 0 && (
          <div className="card p-6 text-center bg-gradient-to-br from-pastel-pink-50/50 to-pastel-blue-50/50">
            <p className="text-sm text-gray-500">No hay recetas planificadas</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderDay = (date: string) => {
    const dayMenu = currentMenu?.days.find((day) => day.date === date);
    if (!dayMenu) return null;

    return (
      <div key={date} className="card p-4 sm:p-6 mb-6 last:mb-0 bg-white/90">
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100/50">
          <div className="p-3 glass-effect rounded-xl bg-gradient-to-br from-pastel-pink-50 to-pastel-blue-50">
            <Calendar className="w-5 h-5 text-pastel-pink-500" />
          </div>
          <h3 className="font-semibold text-lg text-gray-900 capitalize">
            {format(new Date(date), 'EEEE d', { locale: es })}
          </h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {renderMealSection(date, 'comida', dayMenu.meals.comida)}
          {renderMealSection(date, 'cena', dayMenu.meals.cena)}
        </div>
      </div>
    );
  };

  if (!currentMenu) return null;

  return (
    <div className="max-w-6xl mx-auto pb-24 lg:pb-0">
      <div className="flex justify-end mb-6 px-4 sm:px-0">
        <button
          onClick={handleDownloadPDF}
          className="btn btn-primary py-2 px-4 flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Descargar PDF</span>
        </button>
      </div>

      <div className="px-4 sm:px-0">
        {currentMenu.days.map((day) => renderDay(day.date))}
      </div>

      <Modal
        isOpen={recipeModal.isOpen}
        onClose={() => setRecipeModal({ isOpen: false, date: '', mealType: 'comida', mode: 'add' })}
        title={recipeModal.mode === 'add' ? "Agregar Nueva Receta" : "Editar Receta"}
      >
        <AddRecipeForm
          onAddRecipe={handleSaveRecipe}
          onCancel={() => setRecipeModal({ isOpen: false, date: '', mealType: 'comida', mode: 'add' })}
        />
      </Modal>
    </div>
  );
};