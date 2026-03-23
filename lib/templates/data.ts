import { Template } from "@/types";

export const TEMPLATES: Template[] = [
  {
    id: "vegetable-curry",
    name: "Vegetable Curry",
    category: "curry",
    mealTypes: ["lunch", "dinner"],
    ingredientSlots: {
      protein: ["tofu", "lentils", "chicken breast"],
      vegetables: ["broccoli", "spinach", "zucchini", "bell pepper"],
      carbs: ["quinoa"],
      fats: ["olive oil"],
      liquid: ["coconut milk", "vegetable broth"],
      spices: ["turmeric", "cinnamon"]
    },
    constraints: { maxCarbs: 45, glycemicIndex: "low" },
    cookingSteps: [
      "Heat olive oil in a pan.",
      "Saute vegetables and protein for 5 minutes.",
      "Add liquid and spices, simmer 12 minutes.",
      "Serve over quinoa if included."
    ]
  },
  {
    id: "legume-soup",
    name: "Legume Soup",
    category: "soup",
    mealTypes: ["lunch", "dinner"],
    ingredientSlots: {
      protein: ["lentils", "tofu"],
      vegetables: ["spinach", "zucchini", "broccoli"],
      carbs: ["quinoa"],
      fats: ["olive oil"],
      liquid: ["vegetable broth"],
      spices: ["turmeric"]
    },
    constraints: { maxCarbs: 40, glycemicIndex: "low" },
    cookingSteps: [
      "Saute vegetables lightly with olive oil.",
      "Add lentils, broth, and spices.",
      "Simmer until legumes are tender.",
      "Blend partially for texture and serve."
    ]
  },
  {
    id: "egg-dish",
    name: "Egg Dish",
    category: "egg",
    mealTypes: ["breakfast"],
    ingredientSlots: {
      protein: ["eggs", "tofu"],
      vegetables: ["spinach", "bell pepper"],
      carbs: ["quinoa"],
      fats: ["olive oil"],
      liquid: ["vegetable broth"],
      spices: ["turmeric"]
    },
    constraints: { maxCarbs: 30, glycemicIndex: "low" },
    cookingSteps: [
      "Whisk eggs (or tofu scramble base).",
      "Cook vegetables in a non-stick pan.",
      "Add protein and cook until set.",
      "Season and serve warm."
    ]
  },
  {
    id: "baked-chicken",
    name: "Baked Chicken",
    category: "baked",
    mealTypes: ["lunch", "dinner"],
    ingredientSlots: {
      protein: ["chicken breast"],
      vegetables: ["broccoli", "zucchini", "bell pepper"],
      carbs: ["quinoa"],
      fats: ["olive oil"],
      liquid: ["vegetable broth"],
      spices: ["turmeric"]
    },
    constraints: { maxCarbs: 40, glycemicIndex: "low" },
    cookingSteps: [
      "Season chicken and vegetables.",
      "Bake at 200C until cooked through.",
      "Prepare quinoa separately.",
      "Plate with a small broth reduction."
    ]
  },
  {
    id: "fish-dish",
    name: "Fish Dish",
    category: "baked",
    mealTypes: ["lunch", "dinner"],
    ingredientSlots: {
      protein: ["salmon"],
      vegetables: ["spinach", "zucchini", "broccoli"],
      carbs: ["quinoa"],
      fats: ["olive oil"],
      liquid: ["vegetable broth"],
      spices: ["turmeric", "cinnamon"]
    },
    constraints: { maxCarbs: 40, glycemicIndex: "low" },
    cookingSteps: [
      "Season salmon and bake until flaky.",
      "Steam vegetables until tender.",
      "Cook quinoa and combine.",
      "Finish with spices and olive oil."
    ]
  },
  {
    id: "quinoa-salad",
    name: "Quinoa Salad",
    category: "salad",
    mealTypes: ["lunch", "snack"],
    ingredientSlots: {
      protein: ["tofu", "lentils", "eggs"],
      vegetables: ["spinach", "bell pepper", "broccoli"],
      carbs: ["quinoa"],
      fats: ["olive oil"],
      liquid: ["vegetable broth"],
      spices: ["cinnamon"]
    },
    constraints: { maxCarbs: 35, glycemicIndex: "low" },
    cookingSteps: [
      "Cook quinoa and let cool.",
      "Chop vegetables and prepare protein.",
      "Mix all ingredients in a bowl.",
      "Dress with olive oil and seasoning."
    ]
  },
  {
    id: "chia-pudding",
    name: "Chia Pudding",
    category: "chia",
    mealTypes: ["breakfast", "snack"],
    ingredientSlots: {
      protein: ["tofu"],
      vegetables: [],
      carbs: ["chia seeds"],
      fats: ["olive oil"],
      liquid: ["coconut milk"],
      spices: ["cinnamon"]
    },
    constraints: { maxCarbs: 25, glycemicIndex: "low" },
    cookingSteps: [
      "Mix chia seeds with coconut milk.",
      "Add cinnamon and stir thoroughly.",
      "Refrigerate for at least 3 hours.",
      "Serve chilled."
    ]
  },
  {
    id: "warm-bowl",
    name: "Warm Bowl",
    category: "bowl",
    mealTypes: ["lunch", "dinner"],
    ingredientSlots: {
      protein: ["tofu", "chicken breast", "salmon", "lentils"],
      vegetables: ["broccoli", "spinach", "zucchini", "bell pepper"],
      carbs: ["quinoa"],
      fats: ["olive oil"],
      liquid: ["vegetable broth"],
      spices: ["turmeric"]
    },
    constraints: { maxCarbs: 45, glycemicIndex: "low" },
    cookingSteps: [
      "Cook protein and vegetables separately.",
      "Prepare quinoa as base.",
      "Assemble bowl with all components.",
      "Top with warm broth-spice drizzle."
    ]
  }
];
