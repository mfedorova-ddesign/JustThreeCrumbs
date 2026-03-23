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
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  glycemicIndex: number;
  category: IngredientCategory;
  vegetarian: boolean;
  allergens?: string[];
};

export type Template = {
  id: string;
  name: string;
  category: TemplateCategory;
  mealTypes: MealType[];
  ingredientSlots: {
    protein: string[];
    vegetables: string[];
    carbs: string[];
    fats: string[];
    liquid: string[];
    spices: string[];
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
  calories: number;
  macros: Macros;
  glycemicIndex: number;
  instructions: string[];
};

export type DayPlan = {
  day: number;
  breakfast: GeneratedMeal;
  lunch: GeneratedMeal;
  dinner: GeneratedMeal;
  snack: GeneratedMeal;
};

export type MealPlan = {
  id: string;
  createdAt: string;
  userProfile: UserProfile;
  days: DayPlan[];
};
