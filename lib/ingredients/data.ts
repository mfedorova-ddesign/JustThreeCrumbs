import { Ingredient } from "@/types";

export const INGREDIENTS: Ingredient[] = [
  {
    name: "broccoli",
    calories: 35,
    protein: 2.4,
    fat: 0.4,
    carbs: 7.2,
    glycemicIndex: 15,
    category: "vegetables",
    vegetarian: true
  },
  {
    name: "lentils",
    calories: 116,
    protein: 9,
    fat: 0.4,
    carbs: 20,
    glycemicIndex: 32,
    category: "protein",
    vegetarian: true
  },
  {
    name: "tofu",
    calories: 76,
    protein: 8,
    fat: 4.8,
    carbs: 1.9,
    glycemicIndex: 15,
    category: "protein",
    vegetarian: true,
    allergens: ["soy"]
  },
  {
    name: "chicken breast",
    calories: 165,
    protein: 31,
    fat: 3.6,
    carbs: 0,
    glycemicIndex: 0,
    category: "protein",
    vegetarian: false
  },
  {
    name: "salmon",
    calories: 208,
    protein: 20,
    fat: 13,
    carbs: 0,
    glycemicIndex: 0,
    category: "protein",
    vegetarian: false,
    allergens: ["fish"]
  },
  {
    name: "quinoa",
    calories: 120,
    protein: 4.4,
    fat: 1.9,
    carbs: 21.3,
    glycemicIndex: 53,
    category: "carbs",
    vegetarian: true
  },
  {
    name: "eggs",
    calories: 155,
    protein: 13,
    fat: 11,
    carbs: 1.1,
    glycemicIndex: 0,
    category: "protein",
    vegetarian: true,
    allergens: ["egg"]
  },
  {
    name: "spinach",
    calories: 23,
    protein: 2.9,
    fat: 0.4,
    carbs: 3.6,
    glycemicIndex: 15,
    category: "vegetables",
    vegetarian: true
  },
  {
    name: "olive oil",
    calories: 119,
    protein: 0,
    fat: 13.5,
    carbs: 0,
    glycemicIndex: 0,
    category: "fats",
    vegetarian: true
  },
  {
    name: "coconut milk",
    calories: 230,
    protein: 2.3,
    fat: 24,
    carbs: 6,
    glycemicIndex: 40,
    category: "liquid",
    vegetarian: true
  },
  {
    name: "vegetable broth",
    calories: 15,
    protein: 0.6,
    fat: 0.3,
    carbs: 2.5,
    glycemicIndex: 5,
    category: "liquid",
    vegetarian: true
  },
  {
    name: "turmeric",
    calories: 9,
    protein: 0.3,
    fat: 0.1,
    carbs: 1.7,
    glycemicIndex: 10,
    category: "spices",
    vegetarian: true
  },
  {
    name: "cinnamon",
    calories: 6,
    protein: 0.1,
    fat: 0,
    carbs: 2.1,
    glycemicIndex: 5,
    category: "spices",
    vegetarian: true
  },
  {
    name: "chia seeds",
    calories: 486,
    protein: 16.5,
    fat: 30.7,
    carbs: 42.1,
    glycemicIndex: 1,
    category: "carbs",
    vegetarian: true
  },
  {
    name: "zucchini",
    calories: 17,
    protein: 1.2,
    fat: 0.3,
    carbs: 3.1,
    glycemicIndex: 15,
    category: "vegetables",
    vegetarian: true
  },
  {
    name: "bell pepper",
    calories: 31,
    protein: 1,
    fat: 0.3,
    carbs: 6,
    glycemicIndex: 15,
    category: "vegetables",
    vegetarian: true
  }
];
