import { Template } from "@/types";

export const TEMPLATES: Template[] = [
  {
    id: "curry-template",
    name: "Curry Template",
    category: "curry",
    mealTypes: ["lunch", "dinner"],
    mealNamePattern: "Curry with {protein} and {vegetables}",
    ingredientSlots: {
      protein: ["tofu", "lentils", "chickpeas", "chicken breast"],
      vegetables: ["broccoli", "spinach", "zucchini", "bell pepper", "cauliflower"],
      carbs: ["quinoa", "buckwheat"],
      fats: ["olive oil"],
      liquid: ["light coconut milk", "vegetable broth"],
      spices: ["turmeric", "cinnamon", "cumin"]
    },
    slotRules: {
      protein: { min: 1, max: 1 },
      vegetables: { min: 2, max: 3 },
      carbs: { min: 0, max: 1 },
      fats: { min: 1, max: 1 },
      liquid: { min: 1, max: 1 },
      spices: { min: 1, max: 2 }
    },
    constraints: { maxCarbs: 45, glycemicIndex: "low" },
    cookingSteps: [
      "Warm {fats} in a pan and toast {spices}.",
      "Add {protein} and cook until lightly golden.",
      "Add {vegetables} and stir for 4-6 minutes.",
      "Pour in {liquid}, simmer until vegetables are tender.",
      "Serve with {carbs} if selected."
    ]
  },
  {
    id: "legume-soup-template",
    name: "Legume Soup Template",
    category: "soup",
    mealTypes: ["lunch", "dinner"],
    mealNamePattern: "Legume Soup with {vegetables}",
    ingredientSlots: {
      protein: ["lentils", "chickpeas", "white beans"],
      vegetables: ["spinach", "zucchini", "broccoli", "cauliflower", "bell pepper"],
      carbs: ["quinoa", "buckwheat"],
      fats: ["olive oil"],
      liquid: ["vegetable broth"],
      spices: ["turmeric", "cumin", "paprika"]
    },
    slotRules: {
      protein: { min: 1, max: 1 },
      vegetables: { min: 2, max: 3 },
      carbs: { min: 0, max: 1 },
      fats: { min: 1, max: 1 },
      liquid: { min: 1, max: 1 },
      spices: { min: 1, max: 2 }
    },
    constraints: { maxCarbs: 40, glycemicIndex: "low" },
    cookingSteps: [
      "Saute {vegetables} in {fats}.",
      "Add {protein}, {liquid}, and {spices}.",
      "Simmer until legumes are soft and flavors combine.",
      "Serve as is or partially blend for thicker texture.",
      "Add {carbs} only if needed for extra energy."
    ]
  },
  {
    id: "egg-dish-template",
    name: "Egg Dish Template",
    category: "egg",
    mealTypes: ["breakfast"],
    mealNamePattern: "Egg and Veggie Pan with {vegetables}",
    ingredientSlots: {
      protein: ["eggs", "egg whites", "tofu"],
      vegetables: ["spinach", "bell pepper", "zucchini", "tomato"],
      carbs: ["quinoa", "buckwheat"],
      fats: ["olive oil"],
      liquid: [],
      spices: ["turmeric", "black pepper", "oregano"]
    },
    slotRules: {
      protein: { min: 1, max: 1 },
      vegetables: { min: 1, max: 2 },
      carbs: { min: 0, max: 1 },
      fats: { min: 1, max: 1 },
      liquid: { min: 0, max: 0 },
      spices: { min: 1, max: 2 }
    },
    constraints: { maxCarbs: 30, glycemicIndex: "low" },
    cookingSteps: [
      "Heat {fats} and cook {vegetables} until soft.",
      "Add {protein} and cook until set.",
      "Season with {spices}.",
      "Serve with a small side of {carbs} when included."
    ]
  },
  {
    id: "baked-chicken-template",
    name: "Baked Chicken Template",
    category: "baked",
    mealTypes: ["lunch", "dinner"],
    mealNamePattern: "Baked Chicken with {vegetables}",
    ingredientSlots: {
      protein: ["chicken breast"],
      vegetables: ["broccoli", "zucchini", "bell pepper", "cauliflower", "green beans"],
      carbs: ["quinoa", "buckwheat"],
      fats: ["olive oil"],
      liquid: ["lemon juice"],
      spices: ["paprika", "garlic", "oregano"]
    },
    slotRules: {
      protein: { min: 1, max: 1 },
      vegetables: { min: 2, max: 3 },
      carbs: { min: 0, max: 1 },
      fats: { min: 1, max: 1 },
      liquid: { min: 0, max: 1 },
      spices: { min: 1, max: 2 }
    },
    constraints: { maxCarbs: 40, glycemicIndex: "low" },
    cookingSteps: [
      "Coat {protein} and {vegetables} with {fats} and {spices}.",
      "Bake until chicken is fully cooked.",
      "Finish with {liquid} and serve.",
      "Pair with {carbs} only when selected."
    ]
  },
  {
    id: "fish-sauce-template",
    name: "Fish + Sauce Template",
    category: "baked",
    mealTypes: ["lunch", "dinner"],
    mealNamePattern: "Fish with Light Sauce and {vegetables}",
    ingredientSlots: {
      protein: ["salmon", "cod"],
      vegetables: ["spinach", "zucchini", "broccoli", "asparagus"],
      carbs: ["quinoa", "buckwheat"],
      fats: ["olive oil"],
      liquid: ["greek yogurt", "lemon juice", "vegetable broth"],
      spices: ["turmeric", "black pepper", "garlic"]
    },
    slotRules: {
      protein: { min: 1, max: 1 },
      vegetables: { min: 2, max: 2 },
      carbs: { min: 0, max: 1 },
      fats: { min: 1, max: 1 },
      liquid: { min: 1, max: 1 },
      spices: { min: 1, max: 2 }
    },
    constraints: { maxCarbs: 40, glycemicIndex: "low" },
    cookingSteps: [
      "Season {protein} with {spices} and bake until flaky.",
      "Cook {vegetables} until just tender.",
      "Whisk {liquid} into a light sauce and warm gently.",
      "Serve fish and vegetables with sauce and optional {carbs}."
    ]
  },
  {
    id: "grain-bowl-template",
    name: "Grain Bowl Template",
    category: "bowl",
    mealTypes: ["lunch", "dinner"],
    mealNamePattern: "Grain Bowl with {protein} and {vegetables}",
    ingredientSlots: {
      protein: ["tofu", "lentils", "chickpeas", "chicken breast", "salmon"],
      vegetables: ["spinach", "bell pepper", "broccoli", "cucumber", "tomato"],
      carbs: ["quinoa", "buckwheat"],
      fats: ["olive oil", "tahini"],
      liquid: ["lemon juice", "greek yogurt"],
      spices: ["cumin", "oregano", "black pepper"]
    },
    slotRules: {
      protein: { min: 1, max: 1 },
      vegetables: { min: 2, max: 3 },
      carbs: { min: 1, max: 1 },
      fats: { min: 1, max: 1 },
      liquid: { min: 1, max: 1 },
      spices: { min: 1, max: 2 }
    },
    constraints: { maxCarbs: 35, glycemicIndex: "low" },
    cookingSteps: [
      "Cook {carbs} as the base.",
      "Prepare {protein} and {vegetables}.",
      "Mix {fats}, {liquid}, and {spices} into dressing.",
      "Assemble bowl and finish with dressing."
    ]
  },
  {
    id: "chia-pudding-template",
    name: "Chia Pudding Template",
    category: "chia",
    mealTypes: ["breakfast", "snack"],
    mealNamePattern: "Chia Pudding with {vegetables}",
    ingredientSlots: {
      protein: ["greek yogurt", "tofu"],
      vegetables: ["berries"],
      carbs: ["chia seeds"],
      fats: ["almond butter"],
      liquid: ["unsweetened almond milk", "light coconut milk"],
      spices: ["cinnamon", "vanilla"]
    },
    slotRules: {
      protein: { min: 1, max: 1 },
      vegetables: { min: 0, max: 1 },
      carbs: { min: 1, max: 1 },
      fats: { min: 0, max: 1 },
      liquid: { min: 1, max: 1 },
      spices: { min: 1, max: 1 }
    },
    constraints: { maxCarbs: 25, glycemicIndex: "low" },
    cookingSteps: [
      "Mix {carbs}, {liquid}, and {spices}.",
      "Fold in {protein} and rest for 3+ hours in the fridge.",
      "Top with {vegetables} and {fats} if selected.",
      "Serve chilled."
    ]
  },
  {
    id: "warm-bowl-template",
    name: "Warm Bowl Template",
    category: "bowl",
    mealTypes: ["lunch", "dinner"],
    mealNamePattern: "Warm Bowl with {protein}",
    ingredientSlots: {
      protein: ["tofu", "chicken breast", "salmon", "lentils", "chickpeas"],
      vegetables: ["broccoli", "spinach", "zucchini", "bell pepper", "cauliflower"],
      carbs: ["quinoa", "buckwheat"],
      fats: ["olive oil", "tahini"],
      liquid: ["vegetable broth", "lemon juice"],
      spices: ["turmeric", "cumin", "black pepper"]
    },
    slotRules: {
      protein: { min: 1, max: 1 },
      vegetables: { min: 2, max: 3 },
      carbs: { min: 0, max: 1 },
      fats: { min: 1, max: 1 },
      liquid: { min: 1, max: 1 },
      spices: { min: 1, max: 2 }
    },
    constraints: { maxCarbs: 45, glycemicIndex: "low" },
    cookingSteps: [
      "Cook {protein} with {spices}.",
      "Saute {vegetables} in {fats}.",
      "Warm {liquid} and pour over the bowl.",
      "Serve over {carbs} if included."
    ]
  },
  {
    id: "protein-yogurt-snack-template",
    name: "Protein Yogurt Snack Template",
    category: "chia",
    mealTypes: ["snack"],
    mealNamePattern: "Protein Yogurt Snack with {vegetables}",
    ingredientSlots: {
      protein: ["greek yogurt", "tofu"],
      vegetables: ["berries"],
      carbs: ["chia seeds"],
      fats: ["almond butter"],
      liquid: ["unsweetened almond milk"],
      spices: ["cinnamon", "vanilla"]
    },
    slotRules: {
      protein: { min: 1, max: 1 },
      vegetables: { min: 0, max: 1 },
      carbs: { min: 0, max: 1 },
      fats: { min: 0, max: 1 },
      liquid: { min: 0, max: 1 },
      spices: { min: 1, max: 1 }
    },
    constraints: { maxCarbs: 22, glycemicIndex: "low" },
    cookingSteps: [
      "Place {protein} into a bowl.",
      "Add {vegetables} and optional {carbs}.",
      "Mix in {fats}, {liquid}, and {spices}.",
      "Serve chilled."
    ]
  },
  {
    id: "savory-chickpea-snack-template",
    name: "Savory Chickpea Snack Template",
    category: "salad",
    mealTypes: ["snack"],
    mealNamePattern: "Savory Snack Cup with {protein}",
    ingredientSlots: {
      protein: ["chickpeas", "white beans", "tofu"],
      vegetables: ["cucumber", "tomato", "bell pepper"],
      carbs: [],
      fats: ["olive oil", "tahini"],
      liquid: ["lemon juice"],
      spices: ["cumin", "black pepper", "oregano"]
    },
    slotRules: {
      protein: { min: 1, max: 1 },
      vegetables: { min: 1, max: 2 },
      carbs: { min: 0, max: 0 },
      fats: { min: 1, max: 1 },
      liquid: { min: 1, max: 1 },
      spices: { min: 1, max: 2 }
    },
    constraints: { maxCarbs: 24, glycemicIndex: "low" },
    cookingSteps: [
      "Combine {protein} and chopped {vegetables}.",
      "Whisk {fats}, {liquid}, and {spices}.",
      "Toss everything together and serve."
    ]
  },
  {
    id: "veggie-dip-snack-template",
    name: "Veggie Dip Snack Template",
    category: "salad",
    mealTypes: ["snack"],
    mealNamePattern: "Crunchy Veggie Snack with {fats}",
    ingredientSlots: {
      protein: ["greek yogurt", "tofu"],
      vegetables: ["cucumber", "bell pepper", "broccoli", "cauliflower"],
      carbs: [],
      fats: ["tahini", "olive oil", "almond butter"],
      liquid: ["lemon juice", "unsweetened almond milk"],
      spices: ["cumin", "black pepper", "garlic"]
    },
    slotRules: {
      protein: { min: 1, max: 1 },
      vegetables: { min: 2, max: 2 },
      carbs: { min: 0, max: 0 },
      fats: { min: 1, max: 1 },
      liquid: { min: 0, max: 1 },
      spices: { min: 1, max: 1 }
    },
    constraints: { maxCarbs: 18, glycemicIndex: "low" },
    cookingSteps: [
      "Prepare veggie sticks from {vegetables}.",
      "Blend {protein}, {fats}, {liquid}, and {spices} into a dip.",
      "Serve veggies with dip."
    ]
  }
];
