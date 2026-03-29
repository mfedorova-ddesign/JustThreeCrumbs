import { Template } from "@/types";

/**
 * Author Type 2 Diabetes templates (from Diabet sheet / PDF).
 * Slots use names from `lib/ingredients/data.ts` for structured meals, substitutions, and health facts.
 */
export const TEMPLATES: Template[] = [
  {
    id: "author-shakshuka-toast",
    name: "Vegetable omelet / shakshuka with toast",
    category: "egg",
    mealTypes: ["breakfast"],
    mealNamePattern: "Shakshuka-style {protein} with {vegetables} and {carbs}",
    ingredientSlots: {
      protein: ["eggs", "egg whites", "tofu"],
      vegetables: ["tomato", "bell pepper", "zucchini", "eggplant", "spinach"],
      carbs: ["sourdough bread", "buckwheat", "quinoa"],
      fats: ["olive oil"],
      liquid: ["lemon juice"],
      spices: ["cumin", "paprika", "garlic", "black pepper"]
    },
    slotRules: {
      protein: { min: 1, max: 1 },
      vegetables: { min: 2, max: 3 },
      carbs: { min: 0, max: 1 },
      fats: { min: 1, max: 1 },
      liquid: { min: 0, max: 1 },
      spices: { min: 2, max: 3 }
    },
    constraints: { maxCarbs: 45, glycemicIndex: "low" },
    cookingSteps: [
      "Heat {fats} in a pan; soften aromatics from {spices} briefly.",
      "Add {vegetables} and simmer until slightly softened.",
      "Add {protein} in the style you prefer (cracked in or crumbled tofu); cover until set.",
      "Season with remaining {spices} and a splash of {liquid} if using.",
      "Serve with a modest slice or side of {carbs} when included."
    ]
  },
  {
    id: "author-chia-pudding-berries",
    name: "High-protein chia pudding with berries",
    category: "chia",
    mealTypes: ["breakfast", "snack"],
    mealNamePattern: "Chia pudding with {vegetables} and {protein}",
    ingredientSlots: {
      protein: ["greek yogurt", "cottage cheese", "tofu"],
      vegetables: ["berries"],
      carbs: ["chia seeds"],
      fats: ["almond butter", "tahini"],
      liquid: ["light coconut milk", "unsweetened almond milk", "greek yogurt"],
      spices: ["cinnamon", "vanilla"]
    },
    slotRules: {
      protein: { min: 1, max: 1 },
      vegetables: { min: 1, max: 1 },
      carbs: { min: 1, max: 1 },
      fats: { min: 0, max: 1 },
      liquid: { min: 1, max: 1 },
      spices: { min: 1, max: 2 }
    },
    constraints: { maxCarbs: 35, glycemicIndex: "low" },
    cookingSteps: [
      "Mix {carbs}, {liquid}, and {spices} until smooth.",
      "Fold in {protein} if not already the main liquid; chill several hours until thick.",
      "Top with {vegetables} and {fats} if selected.",
      "Serve chilled."
    ]
  },
  {
    id: "author-savory-oatmeal-eggs",
    name: "Savory high-protein oatmeal with eggs",
    category: "bowl",
    mealTypes: ["breakfast"],
    mealNamePattern: "Savory oats with {protein} and {vegetables}",
    ingredientSlots: {
      protein: ["eggs", "cottage cheese", "tofu"],
      vegetables: ["spinach", "zucchini"],
      carbs: ["oats", "quinoa", "buckwheat"],
      fats: ["olive oil"],
      liquid: ["unsweetened almond milk", "vegetable broth"],
      spices: ["black pepper", "garlic", "turmeric"]
    },
    slotRules: {
      protein: { min: 1, max: 1 },
      vegetables: { min: 1, max: 2 },
      carbs: { min: 1, max: 1 },
      fats: { min: 0, max: 1 },
      liquid: { min: 1, max: 1 },
      spices: { min: 1, max: 2 }
    },
    constraints: { maxCarbs: 50, glycemicIndex: "low" },
    cookingSteps: [
      "Cook {carbs} in {liquid} until almost tender.",
      "Stir in {vegetables} and {spices}; finish cooking.",
      "Prepare {protein} on the side or folded in.",
      "Finish with a drizzle of {fats} if using."
    ]
  },
  {
    id: "author-yogurt-berries-nuts",
    name: "Greek yogurt with berries and nuts",
    category: "bowl",
    mealTypes: ["breakfast"],
    mealNamePattern: "Yogurt bowl with {vegetables} and {fats}",
    ingredientSlots: {
      protein: ["greek yogurt", "cottage cheese"],
      vegetables: ["berries"],
      carbs: ["chia seeds"],
      fats: ["almonds", "almond butter"],
      liquid: [],
      spices: ["cinnamon", "vanilla"]
    },
    slotRules: {
      protein: { min: 1, max: 1 },
      vegetables: { min: 1, max: 1 },
      carbs: { min: 0, max: 1 },
      fats: { min: 1, max: 1 },
      liquid: { min: 0, max: 0 },
      spices: { min: 1, max: 1 }
    },
    constraints: { maxCarbs: 30, glycemicIndex: "low" },
    cookingSteps: [
      "Layer {protein} in a bowl.",
      "Add {vegetables} and optional {carbs}.",
      "Top with {fats} and {spices}."
    ]
  },
  {
    id: "author-green-curry",
    name: "Balanced green curry with vegetables & protein",
    category: "curry",
    mealTypes: ["lunch", "dinner"],
    mealNamePattern: "Green curry with {protein} and {vegetables}",
    ingredientSlots: {
      protein: ["chicken breast", "chickpeas", "lentils", "tofu", "tempeh"],
      vegetables: ["zucchini", "broccoli", "cauliflower", "eggplant", "bell pepper", "green beans", "carrot"],
      carbs: ["sweet potato", "pumpkin", "potato"],
      fats: ["olive oil", "light coconut milk"],
      liquid: ["vegetable broth", "light coconut milk"],
      spices: ["turmeric", "cumin", "paprika", "garlic", "ginger"]
    },
    slotRules: {
      protein: { min: 1, max: 1 },
      vegetables: { min: 2, max: 3 },
      carbs: { min: 0, max: 1 },
      fats: { min: 1, max: 1 },
      liquid: { min: 1, max: 1 },
      spices: { min: 2, max: 3 }
    },
    constraints: { maxCarbs: 48, glycemicIndex: "low" },
    cookingSteps: [
      "Warm {fats}; toast {spices} until fragrant.",
      "Add {vegetables}; stir-fry briefly.",
      "Add {protein} and {liquid}; simmer until tender.",
      "Serve with {carbs} if selected, keeping portions moderate."
    ]
  },
  {
    id: "author-legume-soup",
    name: "Balanced legume vegetable soup",
    category: "soup",
    mealTypes: ["lunch", "dinner"],
    mealNamePattern: "Legume soup with {protein} and {vegetables}",
    ingredientSlots: {
      protein: ["lentils", "chickpeas", "white beans"],
      vegetables: ["celery", "zucchini", "bell pepper", "tomato", "pumpkin", "carrot", "onion"],
      carbs: [],
      fats: ["olive oil"],
      liquid: ["vegetable broth"],
      spices: ["cumin", "turmeric", "oregano", "paprika", "garlic"]
    },
    slotRules: {
      protein: { min: 1, max: 1 },
      vegetables: { min: 2, max: 3 },
      carbs: { min: 0, max: 0 },
      fats: { min: 1, max: 1 },
      liquid: { min: 1, max: 1 },
      spices: { min: 2, max: 3 }
    },
    constraints: { maxCarbs: 45, glycemicIndex: "low" },
    cookingSteps: [
      "Sauté onion (from {vegetables}) in {fats} with part of {spices}.",
      "Add remaining {vegetables} and {protein}.",
      "Pour {liquid}; simmer until legumes are tender.",
      "Finish with remaining {spices} and lemon if desired."
    ]
  },
  {
    id: "author-protein-salad-plate",
    name: "Balanced low-GI protein salad",
    category: "salad",
    mealTypes: ["breakfast", "lunch", "snack"],
    mealNamePattern: "Protein salad with {protein} and {vegetables}",
    ingredientSlots: {
      protein: [
        "chicken breast",
        "salmon",
        "cod",
        "eggs",
        "tuna",
        "lentils",
        "chickpeas",
        "tofu",
        "tempeh",
        "cottage cheese",
        "greek yogurt"
      ],
      vegetables: ["spinach", "cucumber", "tomato", "broccoli", "zucchini", "bell pepper", "cauliflower", "carrot", "cabbage"],
      carbs: ["quinoa", "buckwheat", "brown rice", "sweet potato", "corn"],
      fats: ["olive oil", "tahini", "almond butter"],
      liquid: ["lemon juice", "greek yogurt"],
      spices: ["cumin", "oregano", "black pepper", "garlic"]
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
      "Build the bowl: half plate {vegetables}.",
      "Add {protein} and a modest portion of {carbs} if included.",
      "Whisk {fats}, {liquid}, and {spices} as dressing; toss.",
      "Adjust seasoning and serve."
    ]
  },
  {
    id: "author-buckwheat-skillet",
    name: "Buckwheat with vegetables and chicken or tofu",
    category: "bowl",
    mealTypes: ["lunch", "dinner"],
    mealNamePattern: "Buckwheat skillet with {protein} and {vegetables}",
    ingredientSlots: {
      protein: ["chicken breast", "tofu", "tempeh", "lentils"],
      vegetables: ["onion", "carrot", "garlic", "zucchini", "bell pepper", "spinach"],
      carbs: ["buckwheat"],
      fats: ["olive oil"],
      liquid: ["vegetable broth"],
      spices: ["black pepper", "oregano", "paprika"]
    },
    slotRules: {
      protein: { min: 1, max: 1 },
      vegetables: { min: 2, max: 3 },
      carbs: { min: 1, max: 1 },
      fats: { min: 1, max: 1 },
      liquid: { min: 0, max: 1 },
      spices: { min: 1, max: 2 }
    },
    constraints: { maxCarbs: 50, glycemicIndex: "low" },
    cookingSteps: [
      "Start {carbs} cooking; sear {protein} separately with {spices}.",
      "Sauté {vegetables} in {fats}.",
      "Combine with {carbs} and a splash of {liquid}; simmer until tender.",
      "Serve hot."
    ]
  },
  {
    id: "author-lemon-herb-chicken",
    name: "Lemon herb baked chicken with vegetables & grain",
    category: "baked",
    mealTypes: ["lunch", "dinner"],
    mealNamePattern: "Baked {protein} with {vegetables} and {carbs}",
    ingredientSlots: {
      protein: ["chicken breast", "tofu", "tempeh"],
      vegetables: ["zucchini", "broccoli", "cauliflower", "bell pepper", "carrot", "onion", "garlic"],
      carbs: ["buckwheat", "quinoa", "sweet potato"],
      fats: ["olive oil"],
      liquid: ["lemon juice", "greek yogurt"],
      spices: ["oregano", "paprika", "garlic", "black pepper"]
    },
    slotRules: {
      protein: { min: 1, max: 1 },
      vegetables: { min: 2, max: 3 },
      carbs: { min: 0, max: 1 },
      fats: { min: 1, max: 1 },
      liquid: { min: 1, max: 1 },
      spices: { min: 2, max: 3 }
    },
    constraints: { maxCarbs: 45, glycemicIndex: "low" },
    cookingSteps: [
      "Marinate or coat {protein} with {liquid}, {fats}, and part of {spices}.",
      "Roast {protein} with {vegetables} until cooked through.",
      "Prepare {carbs} on the side if included.",
      "Finish with fresh herbs or extra {spices}."
    ]
  },
  {
    id: "author-herb-baked-fish",
    name: "Herb baked fish with vegetables & quinoa",
    category: "baked",
    mealTypes: ["lunch", "dinner"],
    mealNamePattern: "Baked fish with {vegetables} and {carbs}",
    ingredientSlots: {
      protein: ["salmon", "cod", "tofu"],
      vegetables: ["zucchini", "asparagus", "broccoli", "spinach", "bell pepper", "tomato"],
      carbs: ["quinoa", "buckwheat", "lentils"],
      fats: ["olive oil"],
      liquid: ["lemon juice"],
      spices: ["oregano", "garlic", "black pepper", "turmeric"]
    },
    slotRules: {
      protein: { min: 1, max: 1 },
      vegetables: { min: 2, max: 3 },
      carbs: { min: 0, max: 1 },
      fats: { min: 1, max: 1 },
      liquid: { min: 1, max: 1 },
      spices: { min: 2, max: 2 }
    },
    constraints: { maxCarbs: 42, glycemicIndex: "low" },
    cookingSteps: [
      "Season {protein} with {spices} and {liquid}.",
      "Bake {protein} with {vegetables} and {fats} until flaky.",
      "Cook {carbs} separately; plate together."
    ]
  },
  {
    id: "author-tuna-salad-corn",
    name: "Yogurt-dressed tuna salad with vegetables",
    category: "salad",
    mealTypes: ["lunch", "dinner"],
    mealNamePattern: "Tuna salad with {vegetables} and {carbs}",
    ingredientSlots: {
      protein: ["tuna", "chicken breast", "tofu"],
      vegetables: ["spinach", "cucumber", "celery", "carrot", "tomato"],
      carbs: ["corn", "quinoa"],
      fats: ["olive oil"],
      liquid: ["greek yogurt", "lemon juice"],
      spices: ["paprika", "black pepper", "garlic"]
    },
    slotRules: {
      protein: { min: 1, max: 1 },
      vegetables: { min: 2, max: 3 },
      carbs: { min: 0, max: 1 },
      fats: { min: 0, max: 1 },
      liquid: { min: 1, max: 1 },
      spices: { min: 1, max: 2 }
    },
    constraints: { maxCarbs: 40, glycemicIndex: "low" },
    cookingSteps: [
      "Chop {vegetables} into a large bowl.",
      "Add {protein} and {carbs} if using.",
      "Whisk {liquid}, {fats}, and {spices} as dressing; toss to coat."
    ]
  },
  {
    id: "author-baked-eggplant-tomato",
    name: "Baked eggplant with tomato & yogurt-feta layer",
    category: "baked",
    mealTypes: ["lunch", "dinner"],
    mealNamePattern: "Baked {vegetables} with {protein} and {fats}",
    ingredientSlots: {
      protein: ["greek yogurt", "feta cheese", "tofu"],
      vegetables: ["eggplant", "tomato", "onion", "garlic"],
      carbs: [],
      fats: ["olive oil"],
      liquid: ["lemon juice"],
      spices: ["oregano", "paprika", "black pepper"]
    },
    slotRules: {
      protein: { min: 1, max: 2 },
      vegetables: { min: 2, max: 3 },
      carbs: { min: 0, max: 0 },
      fats: { min: 1, max: 1 },
      liquid: { min: 0, max: 1 },
      spices: { min: 2, max: 2 }
    },
    constraints: { maxCarbs: 35, glycemicIndex: "low" },
    cookingSteps: [
      "Roast sliced {vegetables} with {fats} and {spices} until tender.",
      "Simmer tomato sauce from {vegetables} with garlic and herbs.",
      "Layer with {protein} and a little {liquid}; bake briefly or serve warm."
    ]
  },
  {
    id: "author-borscht-style",
    name: "Low-GI borscht-style vegetable bowl",
    category: "soup",
    mealTypes: ["lunch", "dinner"],
    mealNamePattern: "Borscht-style bowl with {vegetables} and {protein}",
    ingredientSlots: {
      protein: ["lentils", "chickpeas", "chicken breast", "tofu"],
      vegetables: ["beets", "cabbage", "carrot", "onion", "tomato", "potato"],
      carbs: [],
      fats: ["olive oil"],
      liquid: ["vegetable broth"],
      spices: ["paprika", "cumin", "garlic", "black pepper"]
    },
    slotRules: {
      protein: { min: 0, max: 1 },
      vegetables: { min: 3, max: 4 },
      carbs: { min: 0, max: 0 },
      fats: { min: 1, max: 1 },
      liquid: { min: 1, max: 1 },
      spices: { min: 2, max: 3 }
    },
    constraints: { maxCarbs: 48, glycemicIndex: "medium" },
    cookingSteps: [
      "Sauté onion in {fats}; add {vegetables} in stages.",
      "Add {liquid} and {spices}; simmer until vegetables are tender.",
      "Stir in {protein} if using; finish with lemon or herbs."
    ]
  },
  {
    id: "author-snack-tuna-yogurt",
    name: "Mini tuna yogurt cup",
    category: "salad",
    mealTypes: ["snack"],
    mealNamePattern: "{protein} with {liquid}",
    ingredientSlots: {
      protein: ["tuna", "tofu", "chickpeas"],
      vegetables: [],
      carbs: [],
      fats: [],
      liquid: ["greek yogurt", "lemon juice"],
      spices: ["black pepper", "paprika"]
    },
    slotRules: {
      protein: { min: 1, max: 1 },
      vegetables: { min: 0, max: 0 },
      carbs: { min: 0, max: 0 },
      fats: { min: 0, max: 0 },
      liquid: { min: 1, max: 1 },
      spices: { min: 1, max: 1 }
    },
    constraints: { maxCarbs: 15, glycemicIndex: "low" },
    cookingSteps: [
      "Flake {protein} and fold into {liquid}.",
      "Season with {spices}; chill briefly if desired."
    ]
  },
  {
    id: "author-snack-egg-cucumber",
    name: "Egg & cucumber snack plate",
    category: "egg",
    mealTypes: ["snack"],
    mealNamePattern: "{protein} with {vegetables}",
    ingredientSlots: {
      protein: ["eggs"],
      vegetables: ["cucumber"],
      carbs: [],
      fats: ["olive oil"],
      liquid: [],
      spices: ["black pepper"]
    },
    slotRules: {
      protein: { min: 1, max: 1 },
      vegetables: { min: 1, max: 1 },
      carbs: { min: 0, max: 0 },
      fats: { min: 0, max: 1 },
      liquid: { min: 0, max: 0 },
      spices: { min: 1, max: 1 }
    },
    constraints: { maxCarbs: 12, glycemicIndex: "low" },
    cookingSteps: [
      "Slice {protein} and {vegetables}.",
      "Drizzle {fats} if using; season with {spices}."
    ]
  },
  {
    id: "author-snack-hummus-veggies",
    name: "Hummus veggie mini dip",
    category: "salad",
    mealTypes: ["snack"],
    mealNamePattern: "{protein} with {vegetables}",
    ingredientSlots: {
      protein: ["hummus"],
      vegetables: ["cucumber", "celery", "bell pepper"],
      carbs: [],
      fats: ["olive oil"],
      liquid: ["lemon juice"],
      spices: ["cumin", "paprika"]
    },
    slotRules: {
      protein: { min: 1, max: 1 },
      vegetables: { min: 2, max: 2 },
      carbs: { min: 0, max: 0 },
      fats: { min: 0, max: 1 },
      liquid: { min: 0, max: 1 },
      spices: { min: 1, max: 1 }
    },
    constraints: { maxCarbs: 22, glycemicIndex: "low" },
    cookingSteps: [
      "Cut sticks from {vegetables}.",
      "Thin {protein} with {liquid} and {spices} if desired.",
      "Serve with a drizzle of {fats}."
    ]
  },
  {
    id: "author-snack-yogurt-berry-chia",
    name: "Greek yogurt berry mini bowl",
    category: "chia",
    mealTypes: ["snack"],
    mealNamePattern: "{liquid} bowl with {vegetables} and {carbs}",
    ingredientSlots: {
      protein: [],
      vegetables: ["berries"],
      carbs: ["chia seeds"],
      fats: [],
      liquid: ["greek yogurt"],
      spices: ["cinnamon"]
    },
    slotRules: {
      protein: { min: 0, max: 0 },
      vegetables: { min: 1, max: 1 },
      carbs: { min: 0, max: 1 },
      fats: { min: 0, max: 0 },
      liquid: { min: 1, max: 1 },
      spices: { min: 1, max: 1 }
    },
    constraints: { maxCarbs: 22, glycemicIndex: "low" },
    cookingSteps: [
      "Spoon {liquid} into a small bowl.",
      "Top with {vegetables} and {carbs} if using.",
      "Finish with {spices}."
    ]
  },
  {
    id: "author-snack-apple-cottage",
    name: "Apple cinnamon cottage cup",
    category: "bowl",
    mealTypes: ["snack"],
    mealNamePattern: "{protein} with {carbs} and {spices}",
    ingredientSlots: {
      protein: ["cottage cheese"],
      vegetables: [],
      carbs: ["apple"],
      fats: [],
      liquid: [],
      spices: ["cinnamon"]
    },
    slotRules: {
      protein: { min: 1, max: 1 },
      vegetables: { min: 0, max: 0 },
      carbs: { min: 1, max: 1 },
      fats: { min: 0, max: 0 },
      liquid: { min: 0, max: 0 },
      spices: { min: 1, max: 1 }
    },
    constraints: { maxCarbs: 24, glycemicIndex: "low" },
    cookingSteps: [
      "Dice {carbs} and fold into {protein}.",
      "Sprinkle {spices} and serve."
    ]
  },
  {
    id: "author-snack-chocolate-nuts",
    name: "Dark chocolate nut bites",
    category: "salad",
    mealTypes: ["snack"],
    mealNamePattern: "{fats} bites with {protein}",
    ingredientSlots: {
      protein: ["almonds", "chia seeds"],
      vegetables: [],
      carbs: [],
      fats: ["dark chocolate", "almond butter"],
      liquid: [],
      spices: ["cinnamon"]
    },
    slotRules: {
      protein: { min: 1, max: 1 },
      vegetables: { min: 0, max: 0 },
      carbs: { min: 0, max: 0 },
      fats: { min: 2, max: 2 },
      liquid: { min: 0, max: 0 },
      spices: { min: 0, max: 1 }
    },
    constraints: { maxCarbs: 14, glycemicIndex: "low" },
    cookingSteps: [
      "Melt {fats} gently; stir in chopped {protein} and {spices} if using.",
      "Portion into small bites; chill until set.",
      "Keep portions small for glycemic control."
    ]
  }
];
