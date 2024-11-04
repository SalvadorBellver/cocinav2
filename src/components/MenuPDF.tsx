import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { WeeklyMenu, Recipe } from '../types';

// Register a custom font
Font.register({
  family: 'Inter',
  src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2'
});

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Inter',
  },
  header: {
    marginBottom: 30,
    borderBottom: '1 solid #E5E7EB',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    color: '#111827',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  dayContainer: {
    marginBottom: 20,
    borderBottom: '1 solid #F3F4F6',
    paddingBottom: 15,
  },
  dayHeader: {
    fontSize: 16,
    color: '#111827',
    marginBottom: 10,
    textTransform: 'capitalize',
  },
  mealTypeContainer: {
    marginBottom: 10,
  },
  mealTypeHeader: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 5,
    textTransform: 'capitalize',
  },
  recipeContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 10,
    marginBottom: 5,
  },
  recipeName: {
    fontSize: 12,
    color: '#111827',
    marginBottom: 3,
  },
  recipeDetails: {
    flexDirection: 'row',
    gap: 10,
  },
  recipeDetail: {
    fontSize: 10,
    color: '#6B7280',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 10,
    borderTop: '1 solid #E5E7EB',
    paddingTop: 10,
  },
});

interface Props {
  menu: WeeklyMenu;
}

const RecipeItem = ({ recipe }: { recipe: Recipe }) => (
  <View style={styles.recipeContainer}>
    <Text style={styles.recipeName}>{recipe.name}</Text>
    <View style={styles.recipeDetails}>
      <Text style={styles.recipeDetail}>
        {recipe.preparationTime} minutos
      </Text>
      <Text style={styles.recipeDetail}>
        {recipe.servings} personas
      </Text>
      {recipe.calories && (
        <Text style={styles.recipeDetail}>
          {recipe.calories} kcal/ración
        </Text>
      )}
    </View>
  </View>
);

export const MenuPDF = ({ menu }: Props) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Menú Semanal</Text>
        <Text style={styles.subtitle}>
          Generado el {format(new Date(), "d 'de' MMMM 'de' yyyy", { locale: es })}
        </Text>
      </View>

      {menu.days.map((day) => (
        <View key={day.date} style={styles.dayContainer}>
          <Text style={styles.dayHeader}>
            {format(new Date(day.date), "EEEE d 'de' MMMM", { locale: es })}
          </Text>

          <View style={styles.mealTypeContainer}>
            <Text style={styles.mealTypeHeader}>Comida</Text>
            {day.meals.comida.map((recipe) => (
              <RecipeItem key={recipe.id} recipe={recipe} />
            ))}
          </View>

          <View style={styles.mealTypeContainer}>
            <Text style={styles.mealTypeHeader}>Cena</Text>
            {day.meals.cena.map((recipe) => (
              <RecipeItem key={recipe.id} recipe={recipe} />
            ))}
          </View>
        </View>
      ))}

      <Text style={styles.footer}>
        Planificador de Menú Semanal - {format(new Date(), 'yyyy')}
      </Text>
    </Page>
  </Document>
);