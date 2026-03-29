export type DietType = "regular" | "vegetarian";
export type Condition = "type2_diabetes";
export type MealType = "breakfast" | "lunch" | "dinner" | "snack";
export type TemplateCategory =
  | "curry"
  | "soup"
  | "bowl"
  | "egg"
  | "chia"
  | "baked"
  | "salad";

export type UserProfile = {
  age: number;
  weight: number;
  height: number;
  gender?: string;
  condition: Condition;
  dietType: DietType;
  allergies: string[];
  additionalPreferences?: string;
};

export type IngredientCategory =
  | "protein"
  | "vegetables"
  | "carbs"
  | "fats"
  | "liquid"
  | "spices";

export type Ingredient = {
  name: string;
  // Nutrition values are normalized per 100g.
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  fiber?: number;
  glycemicIndex: number;
  // Portion used in generated meal (grams). Defaults to 100g when omitted.
  portionGrams?: number;
  category: IngredientCategory;
  vegetarian: boolean;
  allergens?: string[];
};

export type Template = {
  id: string;
  name: string;
  category: TemplateCategory;
  mealTypes: MealType[];
  mealNamePattern: string;
  ingredientSlots: {
    protein: string[];
    vegetables: string[];
    carbs: string[];
    fats: string[];
    liquid: string[];
    spices: string[];
  };
  slotRules: {
    protein: { min: number; max: number };
    vegetables: { min: number; max: number };
    carbs: { min: number; max: number };
    fats: { min: number; max: number };
    liquid: { min: number; max: number };
    spices: { min: number; max: number };
  };
  constraints: {
    maxCarbs: number;
    glycemicIndex: "low" | "medium" | "high";
  };
  cookingSteps: string[];
};

export type Macros = {
  protein: number;
  fat: number;
  carbs: number;
};

export type GeneratedMeal = {
  id: string;
  name: string;
  templateId: string;
  mealType: MealType;
  ingredients: Ingredient[];
  /** Hidden from menu and summaries until restored or replaced. */
  skipped?: boolean;
  calories: number;
  macros: Macros;
  fiber: number;
  glycemicIndex: number;
  diabeticScore: number;
  isVegetarian: boolean;
  isVegan: boolean;
  instructions: string[];
};

export type DayPlan = {
  day: number;
  breakfast: GeneratedMeal;
  lunch: GeneratedMeal;
  dinner: GeneratedMeal;
  snack: GeneratedMeal;
  extraSnack?: GeneratedMeal;
};

export type MealPlan = {
  id: string;
  createdAt: string;
  userProfile: UserProfile;
  days: DayPlan[];
};
