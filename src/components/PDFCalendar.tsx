import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { WeeklyMenu, Recipe } from '../types';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#ffffff'
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#1a1a1a'
  },
  daySection: {
    marginBottom: 20
  },
  dayTitle: {
    fontSize: 16,
    marginBottom: 10,
    backgroundColor: '#f3f4f6',
    padding: 8,
    borderRadius: 4
  },
  mealType: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#4b5563'
  },
  recipe: {
    marginBottom: 5,
    paddingLeft: 10
  },
  recipeTitle: {
    fontSize: 12,
    color: '#1f2937'
  },
  recipeDetails: {
    fontSize: 10,
    color: '#6b7280'
  }
});

interface Props {
  menu: WeeklyMenu;
}

const PDFCalendar: React.FC<Props> = ({ menu }) => {
  const renderRecipe = (recipe: Recipe) => (
    <View key={recipe.id} style={styles.recipe}>
      <Text style={styles.recipeTitle}>{recipe.name}</Text>
      <Text style={styles.recipeDetails}>
        {recipe.preparationTime} min | {recipe.servings} personas
        {recipe.isThermomix ? ' | Thermomix' : ''}
      </Text>
    </View>
  );

  return (
    <PDFViewer style={{ width: '100%', height: '80vh' }}>
      <Document>
        <Page size="A4" style={styles.page}>
          <Text style={styles.title}>Menú Semanal</Text>
          {menu.days.map((day) => (
            <View key={day.date} style={styles.daySection}>
              <Text style={styles.dayTitle}>
                {format(new Date(day.date), 'EEEE d MMMM', { locale: es })}
              </Text>
              
              <View style={{ marginBottom: 10 }}>
                <Text style={styles.mealType}>Comida</Text>
                {day.meals.comida.map(renderRecipe)}
              </View>

              <View>
                <Text style={styles.mealType}>Cena</Text>
                {day.meals.cena.map(renderRecipe)}
              </View>
            </View>
          ))}
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default PDFCalendar;