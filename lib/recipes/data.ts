import { Recipe, RecipeIngredientRule } from "@/types";

function ing(
  category: RecipeIngredientRule["category"],
  primary: string,
  options?: Omit<RecipeIngredientRule, "category" | "primary">
): RecipeIngredientRule {
  return {
    category,
    primary,
    alternatives: options?.alternatives ?? [],
    optional: options?.optional ?? false,
    adjustable: options?.adjustable ?? true
  };
}

export const FIXED_RECIPES: Recipe[] = [
  {
    id: "recipe-shakshuka-toast",
    name: "Vegetable shakshuka with toast",
    mealTypes: ["breakfast"],
    ingredients: [
      ing("protein", "eggs", { alternatives: ["tofu", "egg whites"] }),
      ing("vegetables", "tomato", { alternatives: ["bell pepper", "spinach"] }),
      ing("vegetables", "zucchini", { alternatives: ["eggplant"] }),
      ing("carbs", "sourdough bread", { optional: true, alternatives: ["quinoa", "buckwheat"] }),
      ing("fats", "olive oil"),
      ing("liquid", "lemon juice", { optional: true }),
      ing("spices", "cumin"),
      ing("spices", "paprika"),
      ing("spices", "garlic", { optional: true })
    ],
    constraints: { maxCarbs: 45, glycemicIndex: "low" },
    instructions: [
      "Warm olive oil in a pan and bloom cumin, paprika, and garlic.",
      "Add tomato and zucchini, cook until soft.",
      "Add eggs (or tofu), cover and cook until set.",
      "Finish with lemon juice and serve with optional toast."
    ]
  },
  {
    id: "recipe-chia-pudding-berries",
    name: "High-protein chia pudding with berries",
    mealTypes: ["breakfast", "snack"],
    ingredients: [
      ing("protein", "greek yogurt", { alternatives: ["cottage cheese", "tofu"] }),
      ing("vegetables", "berries"),
      ing("carbs", "chia seeds"),
      ing("fats", "almond butter", { optional: true, alternatives: ["tahini"] }),
      ing("liquid", "unsweetened almond milk", { alternatives: ["light coconut milk"] }),
      ing("spices", "cinnamon"),
      ing("spices", "vanilla", { optional: true })
    ],
    constraints: { maxCarbs: 35, glycemicIndex: "low" },
    instructions: [
      "Mix chia seeds with almond milk and spices.",
      "Fold in yogurt and chill until thick.",
      "Top with berries and optional nut butter."
    ]
  },
  {
    id: "recipe-savory-oats-eggs",
    name: "Savory high-protein oats with greens",
    mealTypes: ["breakfast"],
    ingredients: [
      ing("protein", "eggs", { alternatives: ["cottage cheese", "tofu"] }),
      ing("vegetables", "spinach", { alternatives: ["zucchini"] }),
      ing("carbs", "oats", { alternatives: ["quinoa", "buckwheat"] }),
      ing("fats", "olive oil", { optional: true }),
      ing("liquid", "unsweetened almond milk", { alternatives: ["vegetable broth"] }),
      ing("spices", "black pepper"),
      ing("spices", "turmeric", { optional: true })
    ],
    constraints: { maxCarbs: 50, glycemicIndex: "low" },
    instructions: [
      "Cook oats in milk or broth.",
      "Stir in spinach and spices.",
      "Top with cooked eggs or tofu and finish with optional olive oil."
    ]
  },
  {
    id: "recipe-yogurt-berries-nuts",
    name: "Greek yogurt bowl with berries and nuts",
    mealTypes: ["breakfast"],
    ingredients: [
      ing("protein", "greek yogurt", { alternatives: ["cottage cheese"] }),
      ing("vegetables", "berries"),
      ing("carbs", "chia seeds", { optional: true }),
      ing("fats", "almonds", { alternatives: ["almond butter"] }),
      ing("spices", "cinnamon", { optional: true })
    ],
    constraints: { maxCarbs: 30, glycemicIndex: "low" },
    instructions: [
      "Spoon yogurt into a bowl.",
      "Top with berries, nuts, and optional chia.",
      "Finish with cinnamon."
    ]
  },
  {
    id: "recipe-green-curry",
    name: "Balanced green curry",
    mealTypes: ["lunch", "dinner"],
    ingredients: [
      ing("protein", "chicken breast", { alternatives: ["tofu", "tempeh", "chickpeas"] }),
      ing("vegetables", "broccoli", { alternatives: ["cauliflower", "zucchini"] }),
      ing("vegetables", "bell pepper", { alternatives: ["green beans", "carrot"] }),
      ing("carbs", "sweet potato", { optional: true, alternatives: ["pumpkin", "potato"] }),
      ing("fats", "olive oil"),
      ing("liquid", "light coconut milk", { alternatives: ["vegetable broth"] }),
      ing("spices", "turmeric"),
      ing("spices", "cumin"),
      ing("spices", "ginger", { optional: true })
    ],
    constraints: { maxCarbs: 48, glycemicIndex: "low" },
    instructions: [
      "Warm oil and spices until fragrant.",
      "Cook vegetables and protein briefly.",
      "Add coconut milk and simmer until tender.",
      "Serve with optional sweet potato."
    ]
  },
  {
    id: "recipe-legume-soup",
    name: "Balanced legume vegetable soup",
    mealTypes: ["lunch", "dinner"],
    ingredients: [
      ing("protein", "lentils", { alternatives: ["chickpeas", "white beans"] }),
      ing("vegetables", "celery", { alternatives: ["zucchini", "bell pepper"] }),
      ing("vegetables", "onion", { alternatives: ["tomato", "carrot"] }),
      ing("fats", "olive oil"),
      ing("liquid", "vegetable broth"),
      ing("spices", "cumin"),
      ing("spices", "oregano"),
      ing("spices", "garlic", { optional: true })
    ],
    constraints: { maxCarbs: 45, glycemicIndex: "low" },
    instructions: [
      "Saute onion, celery, and spices in olive oil.",
      "Add legumes and broth, simmer until tender.",
      "Adjust seasoning and serve hot."
    ]
  },
  {
    id: "recipe-protein-salad-plate",
    name: "Balanced protein salad plate",
    mealTypes: ["breakfast", "lunch", "snack"],
    ingredients: [
      ing("protein", "chicken breast", { alternatives: ["tuna", "tofu", "lentils", "greek yogurt"] }),
      ing("vegetables", "spinach", { alternatives: ["cucumber", "tomato", "broccoli"] }),
      ing("vegetables", "bell pepper", { alternatives: ["zucchini", "carrot", "cabbage"] }),
      ing("carbs", "quinoa", { optional: true, alternatives: ["buckwheat", "brown rice", "corn"] }),
      ing("fats", "olive oil", { alternatives: ["tahini"] }),
      ing("liquid", "lemon juice", { alternatives: ["greek yogurt"] }),
      ing("spices", "black pepper"),
      ing("spices", "oregano", { optional: true })
    ],
    constraints: { maxCarbs: 45, glycemicIndex: "low" },
    instructions: [
      "Assemble vegetables and protein in a bowl.",
      "Add optional grains or legumes.",
      "Dress with lemon, olive oil, and spices."
    ]
  },
  {
    id: "recipe-buckwheat-skillet",
    name: "Buckwheat skillet with vegetables",
    mealTypes: ["lunch", "dinner"],
    ingredients: [
      ing("protein", "chicken breast", { alternatives: ["tofu", "tempeh", "lentils"] }),
      ing("vegetables", "onion", { alternatives: ["zucchini", "bell pepper"] }),
      ing("vegetables", "carrot", { alternatives: ["spinach"] }),
      ing("carbs", "buckwheat"),
      ing("fats", "olive oil"),
      ing("liquid", "vegetable broth", { optional: true }),
      ing("spices", "black pepper"),
      ing("spices", "paprika", { optional: true })
    ],
    constraints: { maxCarbs: 50, glycemicIndex: "low" },
    instructions: [
      "Cook buckwheat in broth.",
      "Saute vegetables and protein with spices.",
      "Combine everything and simmer briefly."
    ]
  },
  {
    id: "recipe-lemon-herb-bake",
    name: "Lemon herb baked chicken with vegetables",
    mealTypes: ["lunch", "dinner"],
    ingredients: [
      ing("protein", "chicken breast", { alternatives: ["tofu", "tempeh"] }),
      ing("vegetables", "broccoli", { alternatives: ["zucchini", "cauliflower"] }),
      ing("vegetables", "onion", { alternatives: ["carrot", "bell pepper"] }),
      ing("carbs", "quinoa", { optional: true, alternatives: ["buckwheat", "sweet potato"] }),
      ing("fats", "olive oil"),
      ing("liquid", "lemon juice"),
      ing("spices", "oregano"),
      ing("spices", "black pepper"),
      ing("spices", "paprika", { optional: true })
    ],
    constraints: { maxCarbs: 45, glycemicIndex: "low" },
    instructions: [
      "Coat protein and vegetables with oil, lemon, and spices.",
      "Bake until fully cooked.",
      "Serve with optional quinoa or buckwheat."
    ]
  },
  {
    id: "recipe-herb-baked-fish",
    name: "Herb baked fish with vegetables",
    mealTypes: ["lunch", "dinner"],
    ingredients: [
      ing("protein", "cod", { alternatives: ["salmon", "tofu"] }),
      ing("vegetables", "broccoli", { alternatives: ["spinach", "bell pepper"] }),
      ing("vegetables", "tomato", { optional: true }),
      ing("carbs", "quinoa", { optional: true, alternatives: ["buckwheat", "lentils"] }),
      ing("fats", "olive oil"),
      ing("liquid", "lemon juice"),
      ing("spices", "oregano"),
      ing("spices", "garlic"),
      ing("spices", "black pepper")
    ],
    constraints: { maxCarbs: 42, glycemicIndex: "low" },
    instructions: [
      "Season fish with lemon, olive oil, and spices.",
      "Bake with vegetables until done.",
      "Serve with optional quinoa."
    ]
  },
  {
    id: "recipe-tuna-salad",
    name: "Yogurt-dressed tuna salad",
    mealTypes: ["lunch", "dinner"],
    ingredients: [
      ing("protein", "tuna", { alternatives: ["chicken breast", "tofu"] }),
      ing("vegetables", "spinach", { alternatives: ["cucumber", "celery"] }),
      ing("vegetables", "tomato", { alternatives: ["carrot"] }),
      ing("carbs", "corn", { optional: true, alternatives: ["quinoa"] }),
      ing("fats", "olive oil", { optional: true }),
      ing("liquid", "greek yogurt", { alternatives: ["lemon juice"] }),
      ing("spices", "paprika"),
      ing("spices", "black pepper")
    ],
    constraints: { maxCarbs: 40, glycemicIndex: "low" },
    instructions: [
      "Combine vegetables with tuna.",
      "Whisk yogurt, lemon, oil, and spices.",
      "Toss and add optional corn or quinoa."
    ]
  },
  {
    id: "recipe-baked-eggplant",
    name: "Baked eggplant with tomato and yogurt",
    mealTypes: ["lunch", "dinner"],
    ingredients: [
      ing("protein", "greek yogurt", { alternatives: ["tofu", "feta cheese"] }),
      ing("vegetables", "eggplant"),
      ing("vegetables", "tomato", { alternatives: ["onion"] }),
      ing("fats", "olive oil"),
      ing("liquid", "lemon juice", { optional: true }),
      ing("spices", "oregano"),
      ing("spices", "black pepper"),
      ing("spices", "paprika", { optional: true })
    ],
    constraints: { maxCarbs: 35, glycemicIndex: "low" },
    instructions: [
      "Roast eggplant and tomato with olive oil.",
      "Top with yogurt or tofu layer and bake briefly.",
      "Finish with lemon and spices."
    ]
  },
  {
    id: "recipe-borscht-style",
    name: "Low-GI borscht-style bowl",
    mealTypes: ["lunch", "dinner"],
    ingredients: [
      ing("protein", "lentils", { alternatives: ["chickpeas", "tofu", "chicken breast"], optional: true }),
      ing("vegetables", "beets"),
      ing("vegetables", "cabbage"),
      ing("vegetables", "carrot", { alternatives: ["onion", "tomato"] }),
      ing("fats", "olive oil"),
      ing("liquid", "vegetable broth"),
      ing("spices", "paprika"),
      ing("spices", "garlic"),
      ing("spices", "black pepper", { optional: true })
    ],
    constraints: { maxCarbs: 48, glycemicIndex: "medium" },
    instructions: [
      "Cook vegetables in stages with olive oil and spices.",
      "Add broth and simmer until tender.",
      "Add optional protein and simmer briefly."
    ]
  },
  {
    id: "recipe-snack-tuna-cup",
    name: "Mini tuna yogurt cup",
    mealTypes: ["snack"],
    ingredients: [
      ing("protein", "tuna", { alternatives: ["tofu", "chickpeas"] }),
      ing("liquid", "greek yogurt", { alternatives: ["lemon juice"] }),
      ing("spices", "black pepper"),
      ing("spices", "paprika", { optional: true })
    ],
    constraints: { maxCarbs: 15, glycemicIndex: "low" },
    instructions: [
      "Mix tuna with yogurt or lemon dressing.",
      "Season with spices and chill briefly."
    ]
  },
  {
    id: "recipe-snack-egg-cucumber",
    name: "Egg and cucumber snack plate",
    mealTypes: ["snack"],
    ingredients: [
      ing("protein", "eggs"),
      ing("vegetables", "cucumber"),
      ing("fats", "olive oil", { optional: true }),
      ing("spices", "black pepper")
    ],
    constraints: { maxCarbs: 12, glycemicIndex: "low" },
    instructions: [
      "Slice boiled eggs and cucumber.",
      "Add olive oil and black pepper."
    ]
  },
  {
    id: "recipe-snack-hummus-veggies",
    name: "Hummus veggie dip",
    mealTypes: ["snack"],
    ingredients: [
      ing("protein", "hummus"),
      ing("vegetables", "cucumber", { alternatives: ["celery", "bell pepper"] }),
      ing("vegetables", "celery", { alternatives: ["bell pepper"] }),
      ing("fats", "olive oil", { optional: true }),
      ing("liquid", "lemon juice", { optional: true }),
      ing("spices", "cumin"),
      ing("spices", "paprika", { optional: true })
    ],
    constraints: { maxCarbs: 22, glycemicIndex: "low" },
    instructions: [
      "Cut vegetables into sticks.",
      "Serve with hummus, lemon, and spices."
    ]
  },
  {
    id: "recipe-snack-yogurt-berry",
    name: "Greek yogurt berry mini bowl",
    mealTypes: ["snack"],
    ingredients: [
      ing("liquid", "greek yogurt"),
      ing("vegetables", "berries"),
      ing("carbs", "chia seeds", { optional: true }),
      ing("spices", "cinnamon", { optional: true })
    ],
    constraints: { maxCarbs: 22, glycemicIndex: "low" },
    instructions: [
      "Add yogurt to a bowl.",
      "Top with berries and optional chia and cinnamon."
    ]
  },
  {
    id: "recipe-snack-apple-cottage",
    name: "Apple cinnamon cottage cup",
    mealTypes: ["snack"],
    ingredients: [
      ing("protein", "cottage cheese"),
      ing("carbs", "apple"),
      ing("spices", "cinnamon")
    ],
    constraints: { maxCarbs: 24, glycemicIndex: "low" },
    instructions: [
      "Mix diced apple with cottage cheese.",
      "Sprinkle cinnamon and serve."
    ]
  },
  {
    id: "recipe-snack-chocolate-nuts",
    name: "Dark chocolate nut bites",
    mealTypes: ["snack"],
    ingredients: [
      ing("protein", "almonds", { alternatives: ["chia seeds"] }),
      ing("fats", "dark chocolate"),
      ing("fats", "almond butter"),
      ing("spices", "cinnamon", { optional: true })
    ],
    constraints: { maxCarbs: 14, glycemicIndex: "low" },
    instructions: [
      "Warm dark chocolate with almond butter.",
      "Fold in chopped almonds and optional cinnamon.",
      "Portion into bites and chill."
    ]
  }
];
