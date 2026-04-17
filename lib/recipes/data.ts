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
      ing("protein", "greek yogurt", { alternatives: ["coconut milk", "almond milk", "coconut yogurt"] }),
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
      ing("protein", "eggs", { alternatives: ["tofu"] }),
      ing("protein", "protein powder", { optional: true }),
      ing("carbs", "oats", { alternatives: ["quinoa"] }),
      ing("liquid", "water"),
      ing("fats", "flax seeds"),
      ing("fats", "butter", { optional: true, alternatives: ["coconut oil"] }),
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
      ing("protein", "greek yogurt", { alternatives: ["coconut yogurt"] }),
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
      ing("protein", "feta cheese", { alternatives: ["goat cheese"] }),
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
      ing("vegetables", "potato", { alternatives: ["sweet potato"] }),
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
      ing("liquid", "greek yogurt", { alternatives: ["coconut yogurt"] }),
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
      ing("protein", "almonds", { alternatives: ["walnuts", "hazelnuts"] }),
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
      ing("fats", "ghee", { alternatives: ["butter"] }),
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
      ing("liquid", "cream", { alternatives: ["coconut cream"] }),
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
  },
  {
    id: "recipe-ribeye-herb-butter",
    name: "Ribeye steak with herb butter",
    mealTypes: ["lunch", "dinner"],
    ingredients: [
      ing("protein", "ribeye steak"),
      ing("fats", "butter"),
      ing("fats", "ghee"),
      ing("vegetables", "green beans", { alternatives: ["asparagus"] }),
      ing("spices", "garlic"),
      ing("spices", "rosemary"),
      ing("spices", "thyme"),
      ing("spices", "black pepper"),
      ing("spices", "parsley", { optional: true }),
      ing("spices", "lemon zest", { optional: true }),
      ing("spices", "smoked paprika", { optional: true })
    ],
    constraints: { maxCarbs: 10, glycemicIndex: "low" },
    instructions: [
      "Take ribeye out of the fridge 45–60 minutes before cooking. Pat completely dry with paper towels — crucial for a good crust.",
      "Make herb butter: mix softened butter with 1 crushed garlic clove, chopped parsley, lemon zest, and a pinch of salt. Roll into a log in cling film and refrigerate.",
      "Season steak generously with coarse salt and black pepper on all sides including the edges. Let rest 10 minutes after seasoning.",
      "Heat a cast-iron skillet over maximum heat for 3–4 minutes until almost smoking. Add ghee.",
      "Place steak in pan — it should sizzle loudly. Do not move for 2.5–3 minutes; the crust will release itself when ready. Flip. Add crushed garlic cloves (unpeeled), rosemary, and thyme sprigs alongside.",
      "Add a knob of plain butter. Tilt the pan and baste the steak continuously with the foaming herb-scented butter for 60–90 seconds.",
      "Transfer steak to a board, tent loosely with foil, and rest 7–10 minutes. Do not skip — the juices redistribute and the internal temp rises 2–3°C more.",
      "In the same pan (do not clean — the flavoured fat remains), sauté green beans over medium heat 4–5 minutes until lightly charred but still with a bite. Season with salt and pepper.",
      "Slice steak against the grain into 1.5–2 cm pieces or serve whole. Top with a round of herb butter from the fridge and serve with green beans immediately."
    ]
  },
  {
    id: "recipe-keto-chocolate-truffles",
    name: "Keto chocolate truffles",
    mealTypes: ["snack"],
    ingredients: [
      ing("fats", "dark chocolate"),
      ing("liquid", "coconut cream"),
      ing("fats", "cacao butter", { alternatives: ["coconut oil"] }),
      ing("spices", "erythritol"),
      ing("spices", "vanilla"),
      ing("spices", "cocoa powder"),
      ing("fats", "pecans", { alternatives: ["almonds"], optional: true }),
      ing("fats", "coconut flakes", { optional: true })
    ],
    constraints: { maxCarbs: 12, glycemicIndex: "low" },
    instructions: [
      "Finely chop dark chocolate into pieces no larger than 5 mm. Place in a heatproof bowl.",
      "Heat coconut cream in a small saucepan over medium heat until just beginning to simmer (small bubbles at the edges, ~80°C). Do not boil. Add erythritol and stir until dissolved.",
      "Pour hot cream over chopped chocolate. Wait 1 minute, then add cacao butter (or coconut oil) and vanilla. Stir slowly from the centre outward with a spatula — do not whisk. The ganache should be smooth, glossy, and homogeneous. Add a pinch of sea salt.",
      "Press cling film directly onto the surface of the ganache to prevent a skin forming. Leave at room temperature 20–30 minutes, then refrigerate for at least 2 hours until firm enough to shape.",
      "Spread cocoa powder on a flat plate. Set up separate plates with crushed pecans or almonds and coconut flakes if using.",
      "Scoop about 15–18 g of ganache per truffle using two teaspoons. Working quickly with cold hands, roll into a ball.",
      "Immediately roll each truffle in cocoa powder (or other coating). Place on parchment. Refrigerate 20–30 minutes until set. Store in a sealed container in the fridge for up to 2 weeks."
    ]
  },
  {
    id: "recipe-keto-panna-cotta",
    name: "Keto panna cotta",
    mealTypes: ["snack"],
    ingredients: [
      ing("liquid", "cream", { alternatives: ["coconut cream"] }),
      ing("spices", "erythritol"),
      ing("spices", "vanilla"),
      ing("spices", "gelatin"),
      ing("vegetables", "berries", { optional: true })
    ],
    constraints: { maxCarbs: 8, glycemicIndex: "low" },
    instructions: [
      "Soak gelatin in 60 ml cold water for 10–15 minutes until bloomed.",
      "Gently heat cream in a saucepan over low heat — do not boil. Add bloomed gelatin and stir until completely dissolved.",
      "Add erythritol and vanilla bean seeds (split the pod and scrape). Stir well.",
      "Pour into silicone moulds or glasses. Refrigerate 4–5 hours until set.",
      "Serve chilled, topped with fresh berries if desired."
    ]
  },
  {
    id: "recipe-keto-mascarpone-mousse",
    name: "Keto mascarpone chocolate mousse",
    mealTypes: ["snack"],
    ingredients: [
      ing("protein", "mascarpone"),
      ing("liquid", "cream"),
      ing("spices", "cocoa powder"),
      ing("spices", "erythritol"),
      ing("vegetables", "berries", { optional: true })
    ],
    constraints: { maxCarbs: 8, glycemicIndex: "low" },
    instructions: [
      "Whip cold cream with erythritol until stiff, stable peaks form.",
      "Gently fold in mascarpone and cocoa powder until smooth and uniform — do not overmix.",
      "Divide into glasses or ramekins and refrigerate for at least 2 hours.",
      "Serve chilled, topped with fresh raspberries or other berries if desired."
    ]
  },
  {
    id: "recipe-keto-brownies",
    name: "Keto chocolate brownies",
    mealTypes: ["snack"],
    ingredients: [
      ing("fats", "almond flour"),
      ing("spices", "cocoa powder"),
      ing("protein", "eggs"),
      ing("fats", "butter", { alternatives: ["coconut oil"] }),
      ing("spices", "erythritol"),
      ing("spices", "baking powder")
    ],
    constraints: { maxCarbs: 10, glycemicIndex: "low" },
    instructions: [
      "Preheat oven to 180°C.",
      "Melt butter and mix with cocoa powder until smooth.",
      "Beat eggs into the chocolate-butter mixture, then add erythritol.",
      "Stir in almond flour and baking powder until just combined.",
      "Pour into a silicone mould (one large or several small) and bake 20–25 minutes.",
      "Allow to cool completely before slicing — brownies firm up as they cool."
    ]
  },
  {
    id: "recipe-salmon-caper-sauce",
    name: "Salmon with caper butter sauce",
    mealTypes: ["lunch", "dinner"],
    ingredients: [
      ing("protein", "salmon", { alternatives: ["trout", "sea bass"] }),
      ing("fats", "butter"),
      ing("fats", "ghee"),
      ing("vegetables", "spinach"),
      ing("fats", "olive oil"),
      ing("spices", "capers"),
      ing("spices", "garlic"),
      ing("liquid", "white wine", { alternatives: ["chicken broth"] }),
      ing("liquid", "lemon juice"),
      ing("spices", "lemon zest"),
      ing("spices", "parsley", { optional: true }),
      ing("spices", "black pepper")
    ],
    constraints: { maxCarbs: 8, glycemicIndex: "low" },
    instructions: [
      "Take salmon out of the fridge 15 minutes before cooking. Pat completely dry — especially the skin. Season with salt and black pepper on all sides.",
      "Heat a heavy-bottomed pan over high heat for 2–3 minutes. Add ghee until just smoking.",
      "Place salmon skin-side down. Press gently with a spatula for the first 30 seconds to prevent curling. Cook undisturbed 4–5 minutes until skin is golden and crisp and the cook line has risen 2/3 up the fillet.",
      "Flip and cook 1.5–2 minutes for medium (slightly pink centre) or 3 minutes for fully cooked. Rest on a warm plate, tented with foil.",
      "In the same pan over medium heat, add garlic and cook 30 seconds. Pour in white wine (or chicken broth) and reduce 1–2 minutes, scraping up any caramelised bits.",
      "Add capers, lemon juice, and lemon zest. Stir and warm 1 minute.",
      "Remove pan from heat. Add cold butter cubes 2–3 at a time, swirling or whisking vigorously to emulsify into a glossy sauce. Stir in chopped parsley.",
      "In a separate pan, wilt spinach in olive oil over medium heat for 1–2 minutes until just collapsed and still bright green. Season with salt.",
      "Plate spinach, place salmon skin-side up, spoon sauce generously over the top. Serve with a lemon wedge immediately."
    ]
  },
  {
    id: "recipe-omelet-goat-cheese",
    name: "Omelette with goat cheese and sun-dried tomatoes",
    mealTypes: ["breakfast", "lunch"],
    ingredients: [
      ing("protein", "eggs"),
      ing("fats", "butter"),
      ing("protein", "goat cheese", { alternatives: ["ricotta", "feta"] }),
      ing("vegetables", "sun-dried tomatoes"),
      ing("spices", "basil"),
      ing("liquid", "cream"),
      ing("spices", "black pepper"),
      ing("spices", "garlic powder", { optional: true }),
      ing("vegetables", "arugula", { alternatives: ["spinach"], optional: true })
    ],
    constraints: { maxCarbs: 8, glycemicIndex: "low" },
    instructions: [
      "Prep the filling: slice sun-dried tomatoes into thin strips, break goat cheese into small pieces, roughly tear basil leaves. Have everything ready before you start cooking.",
      "Beat eggs with cream, salt, pepper, and optional garlic powder vigorously for 30–40 seconds until fully homogeneous with no white streaks.",
      "Heat a 20–22 cm pan over medium heat. Add butter. When it melts, foams, and the foam just begins to subside — the pan is ready (~45–60 seconds). Don't wait for it to brown.",
      "Pour in the egg mixture. Immediately shake the pan back and forth while stirring with a silicone spatula in circular motions. The goal is a soft, fine curd across the surface — not a flat pancake. Work fast — the whole process takes about 60 seconds.",
      "When the eggs are set on the bottom but the top is still slightly wet and glossy, remove from heat. Lay goat cheese, sun-dried tomatoes, and half the basil in a line down the centre. Fold the near edge over a third, then the far edge, forming a roll. Turn onto the plate seam-side down.",
      "Serve immediately with arugula (or spinach) and remaining basil alongside. Omelettes lose their texture within 2–3 minutes."
    ]
  },
  {
    id: "recipe-caesar-salad-keto",
    name: "Keto chicken Caesar salad",
    mealTypes: ["lunch", "dinner"],
    ingredients: [
      ing("protein", "chicken breast", { alternatives: ["salmon"] }),
      ing("vegetables", "romaine"),
      ing("protein", "bacon", { alternatives: ["turkey breast"] }),
      ing("protein", "eggs"),
      ing("protein", "parmesan"),
      ing("spices", "anchovies"),
      ing("spices", "garlic"),
      ing("spices", "dijon mustard"),
      ing("liquid", "lemon juice"),
      ing("fats", "olive oil"),
      ing("fats", "ghee"),
      ing("spices", "garlic powder", { optional: true }),
      ing("spices", "smoked paprika", { optional: true }),
      ing("spices", "worcestershire sauce", { optional: true })
    ],
    constraints: { maxCarbs: 10, glycemicIndex: "low" },
    instructions: [
      "Season chicken with salt, pepper, garlic powder, and smoked paprika. Sear in ghee on a hot grill pan or skillet 4–5 minutes per side until golden and internal temp reaches 74°C. Rest 5 minutes under foil, then slice thinly against the grain.",
      "Fry bacon in a dry pan over medium heat 3–4 minutes until crisp. Drain on paper towel. Break into large pieces when cooled.",
      "Make the dressing: mince anchovies and garlic to a paste. Whisk with egg yolks, dijon mustard, lemon juice, and worcestershire sauce. Very slowly drizzle in olive oil while whisking constantly until the sauce emulsifies and thickens. Stir in grated parmesan. Adjust salt and pepper. Thin with a teaspoon of water if too thick.",
      "Poach eggs: simmer water with a splash of white wine vinegar. Slide eggs in one at a time from cups, cook 3 minutes, blot dry. Or use soft-boiled eggs instead.",
      "Wash and dry romaine leaves thoroughly — wet leaves dilute the dressing. Tear large leaves into 2–3 pieces.",
      "Toss romaine with 2/3 of the dressing until every leaf is coated. Plate, then top with chicken slices, bacon, and poached eggs. Spoon remaining dressing over the top and finish with shaved parmesan and fresh black pepper."
    ]
  },
  {
    id: "recipe-duck-orange",
    name: "Duck breast with orange reduction",
    mealTypes: ["lunch", "dinner"],
    ingredients: [
      ing("protein", "duck breast"),
      ing("carbs", "orange"),
      ing("fats", "butter"),
      ing("vegetables", "cauliflower"),
      ing("liquid", "red wine", { alternatives: ["chicken broth"] }),
      ing("spices", "balsamic vinegar"),
      ing("spices", "erythritol"),
      ing("liquid", "cream"),
      ing("spices", "thyme"),
      ing("spices", "nutmeg"),
      ing("spices", "black pepper"),
      ing("spices", "parsley", { optional: true })
    ],
    constraints: { maxCarbs: 12, glycemicIndex: "low" },
    instructions: [
      "Take duck breasts out of the fridge 30 minutes before cooking. Score the skin in a diamond pattern at 1 cm intervals, cutting down to but not through the meat. Pat completely dry. Season all over with salt and black pepper.",
      "Cook cauliflower florets in salted water 12–15 minutes until very tender. Drain thoroughly and steam-dry 2 minutes. Blend with butter, cream, and nutmeg until completely smooth and silky. Season to taste. Keep warm.",
      "Place duck breasts skin-side down in a cold heavy pan — no oil. Turn heat to medium. Cook undisturbed 12–15 minutes as the fat renders out slowly; spoon off excess fat periodically (save it). The skin is ready when thin, deep golden, and releases easily from the pan.",
      "Flip to the flesh side. Add thyme sprigs. Cook 3–4 minutes for medium rare (54–57°C) or 5–6 minutes for medium (60–63°C). Rest skin-side up on a warm plate under loose foil for 8 minutes — essential step.",
      "Discard most fat from the pan, leaving about 1 tsp. Over medium heat, dissolve erythritol stirring for 1–2 minutes until lightly caramelised. Pour in orange juice, red wine (or broth), balsamic vinegar, and orange zest. Reduce on high heat 4–5 minutes until halved and lightly syrupy.",
      "Remove pan from heat. Whisk in cold butter cubes 2–3 at a time until the sauce is glossy and emulsified. Adjust salt.",
      "Spoon cauliflower purée onto each plate. Slice duck at an angle into 1–1.5 cm pieces and fan over the purée, skin-side up. Spoon orange reduction over the top. Garnish with fresh thyme or parsley. Serve immediately — the skin loses its crunch after 3–5 minutes."
    ]
  },
  {
    id: "recipe-cauliflower-steak-harissa",
    name: "Cauliflower steak with harissa and tahini",
    mealTypes: ["lunch", "dinner"],
    ingredients: [
      ing("vegetables", "cauliflower"),
      ing("fats", "coconut oil", { alternatives: ["ghee"] }),
      ing("spices", "harissa"),
      ing("fats", "olive oil"),
      ing("fats", "tahini"),
      ing("liquid", "lemon juice"),
      ing("spices", "garlic"),
      ing("spices", "cumin"),
      ing("spices", "coriander"),
      ing("spices", "smoked paprika"),
      ing("spices", "black pepper"),
      ing("fats", "sesame seeds", { optional: true }),
      ing("spices", "parsley", { alternatives: ["cilantro"], optional: true }),
      ing("carbs", "pomegranate seeds", { optional: true })
    ],
    constraints: { maxCarbs: 15, glycemicIndex: "low" },
    instructions: [
      "Preheat oven to 220°C with convection. Place a baking sheet inside to heat up — a hot tray gives the steaks immediate crust on the bottom.",
      "Remove outer leaves from the cauliflower, keeping the stalk intact — it holds the steak together. Stand the head upright and slice crossways into 2.5–3 cm steaks. A large head yields 3–4 good steaks. Reserve crumbled edges for another use.",
      "Mix harissa, olive oil, cumin, coriander, smoked paprika, black pepper, and half the salt into a thick marinade.",
      "Heat coconut oil in a large cast-iron pan over high heat until just smoking. Sear steaks 3 minutes without moving until deeply golden. Flip and sear 2 more minutes. This Maillard crust is key — don't skip it.",
      "Transfer to the hot baking sheet. Brush generously with harissa marinade. Roast 12–15 minutes until tender in the centre (a knife should slide in with no resistance) and charred at the edges.",
      "While the cauliflower roasts, whisk tahini with lemon juice, garlic, remaining salt, and cold water a tablespoon at a time until smooth, creamy, and pourable.",
      "Spread tahini sauce on each plate. Place hot cauliflower steak on top. Drizzle with remaining harissa marinade. Scatter toasted sesame seeds, chopped parsley or cilantro, and optional pomegranate seeds. Serve immediately."
    ]
  }
];
