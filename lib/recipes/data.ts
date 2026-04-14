import { Recipe, RecipeIngredientRule } from "@/types";

function ing(
  category: RecipeIngredientRule["category"],
  primary: string,
  options?: Omit<RecipeIngredientRule, "category" | "primary">
): RecipeIngredientRule {
  return {
    category,
    primary,
    ...(options?.label ? { label: options.label } : {}),
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
      ing("protein", "eggs", { alternatives: ["tofu", "chickpeas"] }),
      ing("vegetables", "tomato", { alternatives: ["canned tomatoes"] }),
      ing("vegetables", "bell pepper", { alternatives: ["zucchini"] }),
      ing("vegetables", "onion"),
      ing("fats", "olive oil"),
      ing("liquid", "tomato paste", { optional: true }),
      ing("carbs", "whole grain bread", { optional: true, alternatives: ["sourdough bread"] }),
      ing("spices", "paprika", { alternatives: ["smoked paprika"] }),
      ing("spices", "cumin", { alternatives: ["coriander"] }),
      ing("spices", "chili", { optional: true }),
      ing("spices", "garlic"),
      ing("spices", "parsley", { optional: true, alternatives: ["cilantro"] })
    ],
    constraints: { maxCarbs: 20, glycemicIndex: "low" },
    instructions: [
      "Sauté onion and bell pepper in olive oil over medium heat until soft, 5–8 minutes.",
      "Add garlic, paprika, cumin, and chili — cook for 30 seconds until fragrant.",
      "Add tomatoes and tomato paste, simmer for 10–15 minutes until thickened.",
      "Make wells in the sauce and crack in the eggs. Cover and cook to desired doneness.",
      "Garnish with fresh parsley or cilantro and serve with optional bread."
    ]
  },
  {
    id: "recipe-chia-pudding-berries",
    name: "High-protein chia pudding with berries",
    mealTypes: ["breakfast", "snack"],
    ingredients: [
      ing("protein", "greek yogurt", { alternatives: ["coconut milk", "almond milk"] }),
      ing("vegetables", "berries"),
      ing("carbs", "chia seeds"),
      ing("carbs", "banana", { optional: true, alternatives: ["dried fruit"] }),
      ing("fats", "almond butter", { alternatives: ["mixed nuts", "pumpkin seeds"] }),
      ing("spices", "cinnamon"),
      ing("spices", "vanilla", { optional: true })
    ],
    constraints: { maxCarbs: 55, glycemicIndex: "low" },
    instructions: [
      "Mix chia seeds with almond milk and spices.",
      "Fold in yogurt and chill until thick.",
      "Top with berries and optional nut butter."
    ]
  },
  {
    id: "recipe-savory-oats-eggs",
    name: "Savory oatmeal with flax seeds and eggs",
    mealTypes: ["breakfast"],
    ingredients: [
      ing("protein", "eggs", { alternatives: ["fried eggs", "tofu"] }),
      ing("protein", "protein powder", { optional: true }),
      ing("carbs", "oats", { alternatives: ["quinoa"] }),
      ing("liquid", "water"),
      ing("fats", "flax seeds"),
      ing("fats", "butter", { optional: true, alternatives: ["milk"] }),
      ing("vegetables", "fresh herbs", { optional: true }),
      ing("spices", "black pepper")
    ],
    constraints: { maxCarbs: 55, glycemicIndex: "low" },
    instructions: [
      "Cook oats in water over medium heat, stirring occasionally.",
      "In the last minute, stir in flax seeds — add a splash more water if needed.",
      "Season with black pepper; optionally stir in protein powder, a knob of butter, or a splash of milk.",
      "Boil eggs (2 per serving), fry them, or use pan-fried / baked tofu instead.",
      "Top oatmeal with halved eggs and any vegetables or fresh herbs you like."
    ]
  },
  {
    id: "recipe-yogurt-berries-nuts",
    name: "Greek yogurt bowl with berries and nuts",
    mealTypes: ["breakfast"],
    ingredients: [
      ing("protein", "greek yogurt"),
      ing("vegetables", "berries"),
      ing("vegetables", "banana", { optional: true, alternatives: ["fresh fruit"] }),
      ing("fats", "almonds", { alternatives: ["coconut flakes", "mixed nuts"] }),
      ing("spices", "sugar-free jam", { optional: true })
    ],
    constraints: { maxCarbs: 25, glycemicIndex: "low" },
    instructions: [
      "Slice berries and any optional fruit into a bowl.",
      "Spoon greek yogurt on top.",
      "Sprinkle with almonds, coconut flakes, or mixed nuts.",
      "Add a couple teaspoons of sugar-free jam if desired."
    ]
  },
  {
    id: "recipe-green-curry",
    name: "Balanced vegetable curry",
    mealTypes: ["lunch", "dinner"],
    ingredients: [
      ing("protein", "chickpeas", { alternatives: ["chicken breast", "lentils", "tofu", "tempeh"] }),
      ing("vegetables", "cauliflower", { alternatives: ["broccoli", "potato", "sweet potato", "pumpkin"] }),
      ing("vegetables", "carrot", { alternatives: ["zucchini", "eggplant", "bell pepper"] }),
      ing("vegetables", "green peas", { optional: true, alternatives: ["green beans"] }),
      ing("vegetables", "onion", { alternatives: ["asafoetida"] }),
      ing("fats", "olive oil"),
      ing("liquid", "tomato paste"),
      ing("liquid", "light coconut milk", { alternatives: ["vegetable broth", "cream", "plant-based cream"] }),
      ing("spices", "curry powder"),
      ing("spices", "cumin"),
      ing("spices", "coriander"),
      ing("spices", "turmeric"),
      ing("spices", "paprika"),
      ing("spices", "ginger"),
      ing("spices", "chili", { optional: true }),
      ing("spices", "garlic"),
      ing("spices", "garam masala"),
      ing("spices", "cilantro", { optional: true })
    ],
    constraints: { maxCarbs: 65, glycemicIndex: "low" },
    instructions: [
      "Heat olive oil in a pan and fry cumin, coriander, turmeric, paprika, ginger, and chili for 30 seconds until fragrant.",
      "Add onion and garlic (or a pinch of asafoetida instead) and cook until soft.",
      "Add chopped vegetables and a spoonful of tomato paste, stir to coat.",
      "Add the pre-cooked protein (boiled chickpeas or lentils, pan-fried or baked chicken, tofu, or tempeh) and pour in coconut milk, broth, or cream.",
      "Season with salt, pepper, and curry powder. Stir well, cover, and simmer 3–4 minutes until tender.",
      "Stir in garam masala at the very end. Garnish with fresh cilantro if desired."
    ]
  },
  {
    id: "recipe-legume-soup",
    name: "Balanced legume vegetable soup",
    mealTypes: ["lunch", "dinner"],
    ingredients: [
      ing("protein", "red beans", { alternatives: ["lentils", "chickpeas", "white beans", "black beans"] }),
      ing("vegetables", "onion", { alternatives: ["shallot", "asafoetida"] }),
      ing("vegetables", "bell pepper", { alternatives: ["carrot", "zucchini"] }),
      ing("vegetables", "tomato", { alternatives: ["carrot"] }),
      ing("fats", "olive oil"),
      ing("liquid", "tomato paste", { optional: true }),
      ing("liquid", "water", { alternatives: ["vegetable broth"] }),
      ing("spices", "garlic", { optional: true }),
      ing("spices", "cumin", {
        label: "Eastern spice mix (cumin, coriander, turmeric, black pepper, paprika)",
        alternatives: [
          "Mediterranean spice mix (oregano, thyme, paprika, bay leaf, basil)",
          "Mexican spice mix (cumin, chili, smoked paprika, oregano)"
        ]
      }),
      ing("spices", "black pepper"),
      ing("spices", "parsley", { optional: true, alternatives: ["cilantro"] }),
      ing("spices", "lemon juice", { optional: true })
    ],
    constraints: { maxCarbs: 45, glycemicIndex: "low" },
    instructions: [
      "Soak legumes for 2+ hours (up to overnight), rinse well. Pre-boil if needed, or use canned (rinsed).",
      "Heat olive oil and fry onion, garlic (or asafoetida) until soft. For Eastern/Mexican variants, add cumin, coriander, and turmeric here.",
      "Add chopped vegetables and optional tomato paste. Sauté for 2 minutes.",
      "Add the legumes, season with salt, and cover with water or broth.",
      "Cover and simmer on low heat until legumes are tender.",
      "In the last few minutes add remaining spices — Mediterranean: oregano, thyme, basil, bay leaf / Mexican: smoked paprika, chili, oregano.",
      "Finish with fresh parsley or cilantro and a squeeze of lemon juice if desired."
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
    name: "Buckwheat with vegetables and chicken or mushrooms",
    mealTypes: ["lunch", "dinner"],
    ingredients: [
      ing("protein", "chicken breast", { alternatives: ["turkey breast", "tofu", "lentils"] }),
      ing("protein", "mushrooms", { optional: true }),
      ing("vegetables", "onion"),
      ing("vegetables", "carrot"),
      ing("vegetables", "zucchini", { optional: true, alternatives: ["bell pepper", "spinach"] }),
      ing("carbs", "buckwheat", { alternatives: ["quinoa", "brown rice"] }),
      ing("fats", "olive oil"),
      ing("spices", "garlic"),
      ing("spices", "black pepper"),
      ing("spices", "dill", { optional: true, alternatives: ["parsley"] })
    ],
    constraints: { maxCarbs: 45, glycemicIndex: "low" },
    instructions: [
      "Rinse buckwheat, add water in a 1:2 ratio and cook until half-done.",
      "In a separate pan, cook chicken pieces with salt and pepper until lightly browned — or sauté mushrooms until golden.",
      "In a pot, heat olive oil and sauté onion, carrot, and garlic until soft. Add optional zucchini or bell pepper.",
      "Add the partially cooked buckwheat to the vegetables and stir.",
      "Add the protein component (chicken, mushrooms, or both) and mix well.",
      "Add a small splash of water, cover, and simmer until buckwheat is fully cooked.",
      "Season with salt, pepper, and spices to taste. Finish with fresh dill or parsley."
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
    name: "Yogurt and corn salad",
    mealTypes: ["lunch", "dinner"],
    ingredients: [
      ing("protein", "tuna", { alternatives: ["chicken breast", "chickpeas"] }),
      ing("vegetables", "lettuce"),
      ing("vegetables", "cucumber"),
      ing("vegetables", "radish"),
      ing("vegetables", "carrot", { optional: true }),
      ing("carbs", "corn"),
      ing("carbs", "croutons", { optional: true }),
      ing("fats", "olives", { optional: true }),
      ing("liquid", "greek yogurt"),
      ing("liquid", "soy sauce"),
      ing("spices", "mustard"),
      ing("spices", "lemon juice"),
      ing("spices", "paprika"),
      ing("spices", "black pepper")
    ],
    constraints: { maxCarbs: 40, glycemicIndex: "low" },
    instructions: [
      "Combine lettuce, cucumber, radish, corn, and optional carrot in a bowl.",
      "Add drained canned tuna, cooked chicken breast, or chickpeas.",
      "Optionally add olives and a few croutons.",
      "Whisk together greek yogurt, mustard, soy sauce, lemon juice, paprika, salt and pepper.",
      "Pour dressing over the salad and toss well."
    ]
  },
  {
    id: "recipe-baked-eggplant",
    name: "Baked eggplant with feta and yogurt-tahini sauce",
    mealTypes: ["lunch", "dinner"],
    ingredients: [
      ing("protein", "feta cheese"),
      ing("vegetables", "eggplant"),
      ing("vegetables", "pomegranate seeds", { optional: true }),
      ing("fats", "olive oil"),
      ing("fats", "tahini"),
      ing("liquid", "greek yogurt"),
      ing("liquid", "lemon juice"),
      ing("spices", "garlic"),
      ing("spices", "honey"),
      ing("spices", "black pepper"),
      ing("spices", "mint", { optional: true, alternatives: ["parsley"] })
    ],
    constraints: { maxCarbs: 25, glycemicIndex: "low" },
    instructions: [
      "Halve eggplants lengthwise, score the flesh in a crosshatch pattern.",
      "Brush with olive oil, season with salt and pepper. Roast at 200°C for 30–40 minutes until soft and golden.",
      "Make the sauce: whisk together greek yogurt, tahini, lemon juice, minced garlic, and honey until smooth and creamy.",
      "Crumble feta over the roasted eggplant halves.",
      "Drizzle the yogurt-tahini sauce on top.",
      "Finish with pomegranate seeds and fresh mint or parsley."
    ]
  },
  {
    id: "recipe-borscht-style",
    name: "Borscht",
    mealTypes: ["lunch", "dinner"],
    ingredients: [
      ing("protein", "beef", { alternatives: ["chicken breast", "white beans", "red beans"] }),
      ing("vegetables", "beets"),
      ing("vegetables", "potato"),
      ing("vegetables", "cabbage"),
      ing("vegetables", "carrot"),
      ing("vegetables", "onion"),
      ing("fats", "olive oil"),
      ing("liquid", "vegetable broth", { alternatives: ["water"] }),
      ing("liquid", "tomato paste", { optional: true }),
      ing("spices", "garlic"),
      ing("spices", "black pepper"),
      ing("spices", "bay leaf", { optional: true }),
      ing("spices", "vinegar", { optional: true, alternatives: ["lemon juice"] }),
      ing("fats", "sour cream", { optional: true, alternatives: ["greek yogurt"] }),
      ing("spices", "dill", { optional: true }),
      ing("spices", "parsley", { optional: true })
    ],
    constraints: { maxCarbs: 60, glycemicIndex: "medium" },
    instructions: [
      "Bring vegetable or meat broth to a boil. Add diced potato and cook until almost tender.",
      "Add julienned or grated beets and continue cooking until they lighten slightly in colour.",
      "Meanwhile, sauté diced onion, garlic, and julienned carrot in olive oil until golden. Stir in tomato paste and cook 2–3 minutes.",
      "Add the sauté to the pot along with shredded cabbage, a splash of vinegar or lemon juice, bay leaf, and black pepper.",
      "Add pre-cooked sliced meat or rinsed canned beans.",
      "Simmer for 3 minutes, then turn off the heat and let rest for a few minutes.",
      "Serve with a dollop of sour cream or greek yogurt and freshly chopped dill and parsley."
    ]
  },
  {
    id: "recipe-snack-tuna-cup",
    name: "Simple Tuna Salad on toast",
    mealTypes: ["lunch", "snack"],
    ingredients: [
      ing("protein", "tuna", { alternatives: ["chickpeas"] }),
      ing("carbs", "whole grain bread", { alternatives: ["crackers"] }),
      ing("vegetables", "lettuce"),
      ing("vegetables", "cucumber"),
      ing("liquid", "greek yogurt"),
      ing("spices", "mustard", { optional: true }),
      ing("spices", "lemon juice"),
      ing("spices", "black pepper"),
      ing("spices", "paprika", { optional: true })
    ],
    constraints: { maxCarbs: 30, glycemicIndex: "low" },
    instructions: [
      "Mix drained tuna with greek yogurt, lemon juice, black pepper, and optional mustard and paprika.",
      "Toast whole grain bread or lay out crackers.",
      "Place a lettuce leaf and cucumber slices on top of the toast.",
      "Spoon the tuna salad over the top and serve."
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
      ing("spices", "cinnamon", { optional: true }),
      ing("spices", "sugar-free jam", { optional: true })
    ],
    constraints: { maxCarbs: 22, glycemicIndex: "low" },
    instructions: [
      "Add yogurt to a bowl.",
      "Top with berries and optional chia, cinnamon, and sugar-free jam."
    ]
  },
  {
    id: "recipe-snack-apple-cottage",
    name: "Apple cinnamon cottage cup",
    mealTypes: ["snack"],
    ingredients: [
      ing("protein", "cottage cheese", { alternatives: ["greek yogurt"] }),
      ing("carbs", "apple", { alternatives: ["pear"] }),
      ing("liquid", "water", { optional: true }),
      ing("spices", "sweetener", { optional: true }),
      ing("spices", "cinnamon"),
      ing("carbs", "raisins"),
      ing("fats", "almond flakes", { optional: true })
    ],
    constraints: { maxCarbs: 28, glycemicIndex: "low" },
    instructions: [
      "Slice apple (or pear) into thin wedges.",
      "Place slices in a pan with a splash of water and cook over medium heat for 3–4 minutes until softened and lightly caramelized. Add sweetener if desired.",
      "Sprinkle with cinnamon and arrange on a plate.",
      "Spoon cottage cheese (or greek yogurt) on top.",
      "Finish with a light sprinkle of raisins and optional almond flakes."
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
  },
  {
    id: "recipe-eggs-benedict-avocado",
    name: "Eggs benedict on avocado",
    mealTypes: ["breakfast", "lunch"],
    ingredients: [
      ing("protein", "eggs"),
      ing("fats", "avocado"),
      ing("fats", "ghee"),
      ing("liquid", "lemon juice"),
      ing("spices", "dijon mustard"),
      ing("spices", "cayenne pepper"),
      ing("liquid", "vinegar"),
      ing("spices", "garlic", { optional: true }),
      ing("spices", "smoked paprika", { optional: true }),
      ing("spices", "dill", { optional: true })
    ],
    constraints: { maxCarbs: 10, glycemicIndex: "low" },
    instructions: [
      "Melt ghee in a small saucepan over low heat until liquid and hot (around 60–65°C). Remove from heat and let cool slightly.",
      "Make hollandaise: whisk egg yolks with cold water and dijon mustard in a heatproof bowl until foamy. Set over a pot of barely simmering water (bowl must not touch water). Whisk 2–3 minutes until thickened and increased in volume. Remove from heat and, still whisking, slowly drizzle in hot ghee. Add lemon juice, salt, and cayenne. Sauce should coat a spoon. Keep warm, covered.",
      "Halve avocados and remove pits. Slightly enlarge the pit cavity with a spoon so the egg sits securely. Drizzle with lemon juice to prevent browning. Place cut-side up on plates.",
      "Fill a wide pan with 6–7 cm of water. Add vinegar. Bring to a gentle simmer (small bubbles, ~90°C — do not boil hard).",
      "Crack eggs one at a time into small cups. Create a gentle swirl in the water. Slide each egg into the centre of the vortex. Poach 3 minutes for a runny yolk. Lift out with a slotted spoon and blot dry.",
      "Place a poached egg on each avocado half. Spoon hollandaise generously over the top. Finish with smoked paprika, fresh dill or chives, and optional garlic. Serve immediately."
    ]
  },
  {
    id: "recipe-broccoli-cheddar-soup",
    name: "Broccoli cheddar cream soup",
    mealTypes: ["lunch", "dinner"],
    ingredients: [
      ing("vegetables", "broccoli"),
      ing("protein", "cheddar"),
      ing("liquid", "cream"),
      ing("liquid", "chicken broth", { alternatives: ["vegetable broth"] }),
      ing("fats", "butter"),
      ing("vegetables", "onion"),
      ing("spices", "garlic"),
      ing("spices", "black pepper"),
      ing("spices", "nutmeg"),
      ing("spices", "dijon mustard"),
      ing("fats", "pumpkin seeds", { alternatives: ["sunflower seeds"], optional: true }),
      ing("spices", "smoked paprika", { optional: true }),
      ing("protein", "parmesan", { optional: true })
    ],
    constraints: { maxCarbs: 15, glycemicIndex: "low" },
    instructions: [
      "Toast pumpkin (or sunflower) seeds in a dry pan over medium heat for 2–3 minutes until golden. Set aside.",
      "Melt butter in a heavy-bottomed pot over medium heat. Add finely diced onion and cook 5–6 minutes until soft and translucent. Add minced garlic and cook 1 minute more.",
      "Reserve a few small florets from the broccoli for garnish. Chop the rest and add to the pot. Pour in broth, bring to a boil, then reduce heat and simmer 12–15 minutes until very tender.",
      "Meanwhile, blanch reserved florets in salted boiling water for 3 minutes — they should stay bright green and slightly crisp. Drain, rinse with cold water, and set aside.",
      "Remove pot from heat. Blend with an immersion blender until completely smooth and silky. Return to low heat.",
      "Stir in cream, dijon mustard, and nutmeg. Add cheddar in handfuls, stirring until fully melted before adding the next. Do not boil after adding cheese. Season with salt and black pepper.",
      "Ladle into bowls. Top with reserved florets, toasted seeds, a pinch of smoked paprika, and optional parmesan. Serve immediately."
    ]
  }
];
