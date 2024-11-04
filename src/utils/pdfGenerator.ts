import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import jsPDF from 'jspdf';
import type { WeeklyMenu, Recipe } from '../types';

const formatRecipe = (recipe: Recipe): string => {
  return `${recipe.name}
  Tiempo: ${recipe.preparationTime} min | ${recipe.servings} personas
  ${recipe.calories ? `${recipe.calories} kcal/ración` : ''}
  ${recipe.isThermomix ? '(Thermomix)' : ''}`;
};

export const generatePDF = (menu: WeeklyMenu) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPosition = margin;

  // Title
  doc.setFontSize(24);
  doc.text('Menú Semanal', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 10;

  // Subtitle
  doc.setFontSize(12);
  doc.text(
    `Generado el ${format(new Date(), "d 'de' MMMM 'de' yyyy", { locale: es })}`,
    pageWidth / 2,
    yPosition + 10,
    { align: 'center' }
  );
  yPosition += 30;

  // Days
  menu.days.forEach((day) => {
    // Check if we need a new page
    if (yPosition > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage();
      yPosition = margin;
    }

    // Day header
    doc.setFontSize(16);
    doc.text(
      format(new Date(day.date), "EEEE d 'de' MMMM", { locale: es }),
      margin,
      yPosition
    );
    yPosition += 10;

    // Meals
    doc.setFontSize(14);
    ['comida', 'cena'].forEach((mealType) => {
      // Check if we need a new page
      if (yPosition > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        yPosition = margin;
      }

      doc.text(
        mealType.charAt(0).toUpperCase() + mealType.slice(1),
        margin,
        yPosition
      );
      yPosition += 7;

      const meals = day.meals[mealType as 'comida' | 'cena'];
      doc.setFontSize(12);
      meals.forEach((recipe) => {
        const recipeText = formatRecipe(recipe);
        const lines = doc.splitTextToSize(recipeText, pageWidth - 2 * margin);
        
        // Check if we need a new page
        if (yPosition + lines.length * 7 > doc.internal.pageSize.getHeight() - margin) {
          doc.addPage();
          yPosition = margin;
        }

        doc.text(lines, margin, yPosition);
        yPosition += lines.length * 7;
      });

      if (meals.length === 0) {
        doc.text('No hay recetas planificadas', margin, yPosition);
        yPosition += 7;
      }

      yPosition += 10;
    });

    yPosition += 10;
  });

  // Save the PDF
  doc.save(`menu-semanal-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};