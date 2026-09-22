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
    id: "recipe-dal-delight",
    name: "Dal Delight",
    mealTypes: ["lunch", "dinner"],
    ingredients: [
      ing("protein", "lentils", { label: "brown lentils", alternatives: ["red beans", "black beans"] }),
      ing("carbs", "sweet potato", { optional: true }),
      ing("vegetables", "carrot"),
      ing("vegetables", "spinach"),
      ing("vegetables", "tomato"),
      ing("liquid", "light coconut milk", { label: "coconut milk" }),
      ing("liquid", "vegetable broth"),
      ing("vegetables", "onion"),
      ing("spices", "garlic"),
      ing("spices", "ginger"),
      ing("fats", "olive oil"),
      ing("spices", "turmeric"),
      ing("spices", "coriander"),
      ing("spices", "cumin"),
      ing("spices", "black pepper"),
      ing("spices", "salt"),
      ing("liquid", "lemon juice"),
      ing("spices", "cilantro")
    ],
    constraints: { maxCarbs: 45, glycemicIndex: "low" },
    instructions: [
      "Heat olive oil in a deep pot over medium heat. Cook diced onion for about 5 minutes until translucent, then add garlic and freshly grated ginger and cook 2 minutes more.",
      "Add turmeric, coriander, cumin, and black pepper. Toast the spices for about 1 minute, stirring constantly so they bloom without burning.",
      "Add tomatoes, coconut milk, and vegetable broth. Stir in rinsed lentils, carrot, and optional diced sweet potato. Bring to a boil, then simmer uncovered for about 25 minutes until the lentils are soft.",
      "Mash a small portion of the lentils against the pot wall for a thicker, creamier texture.",
      "Remove from heat and fold in fresh spinach so it wilts from residual heat. Stir in lemon juice and salt, then adjust seasoning to taste.",
      "Serve hot and finish with chopped cilantro."
    ]
  },
  {
    id: "recipe-fasolia-greek",
    name: "Fasolia — Greek white beans in tomatoes",
    mealTypes: ["lunch", "dinner"],
    ingredients: [
      ing("protein", "white beans", { label: "cannellini beans (canned, drained)" }),
      ing("vegetables", "tomato", { label: "canned diced tomatoes" }),
      ing("vegetables", "onion"),
      ing("vegetables", "carrot"),
      ing("vegetables", "celery"),
      ing("spices", "garlic"),
      ing("fats", "olive oil"),
      ing("spices", "rosemary"),
      ing("liquid", "tomato paste"),
      ing("liquid", "lemon juice"),
      ing("spices", "black pepper"),
      ing("spices", "salt"),
      ing("spices", "parsley"),
      ing("fats", "olives", { optional: true }),
      ing("carbs", "whole grain bread", { optional: true, alternatives: ["crackers"] })
    ],
    constraints: { maxCarbs: 50, glycemicIndex: "low" },
    instructions: [
      "Soffritto: finely dice onion, carrot, and celery. Sauté in olive oil over medium heat for about 10 minutes until soft — do not rush; this is the flavour base.",
      "Garlic and rosemary: add crushed garlic and rosemary sprigs; cook 1 minute. Stir in tomato paste and cook 2 minutes more until the paste darkens slightly.",
      "Simmer: add diced tomatoes and about 200 ml water. Add the beans. Simmer gently, covered, on low heat for about 25 minutes. Mash some of the beans with a fork so the sauce turns creamy.",
      "Finish: remove the rosemary sprigs. Stir in lemon juice, salt, and black pepper to taste. Drizzle generously with extra virgin olive oil at the table.",
      "Serve with crusty whole-grain bread or pita. Top with plenty of fresh parsley and optional olives.",
      "Freezes well for up to 4 months. Reheat with a few tablespoons of water, covered, for about 6 minutes; add a fresh drizzle of olive oil after reheating."
    ]
  },
  {
    id: "recipe-caponata-chickpeas",
    name: "Caponata with chickpeas — Sicilian agrodolce",
    mealTypes: ["lunch", "dinner"],
    ingredients: [
      ing("vegetables", "eggplant"),
      ing("protein", "chickpeas", { label: "chickpeas (canned, drained)" }),
      ing("vegetables", "tomato", { label: "canned diced tomatoes" }),
      ing("vegetables", "celery"),
      ing("vegetables", "onion", { label: "red onion" }),
      ing("fats", "olives", { label: "pitted green olives" }),
      ing("spices", "capers"),
      ing("fats", "olive oil"),
      ing("liquid", "vinegar", { label: "red wine vinegar" }),
      ing("spices", "sweetener", { alternatives: ["honey"], label: "agave syrup or honey" }),
      ing("fats", "almonds", { label: "toasted pine nuts (or almonds)" }),
      ing("spices", "basil"),
      ing("spices", "black pepper", { optional: true }),
      ing("spices", "salt", { optional: true }),
      ing("carbs", "whole grain bread", { optional: true, alternatives: ["brown rice"] })
    ],
    constraints: { maxCarbs: 42, glycemicIndex: "low" },
    instructions: [
      "Eggplant: dice into 2 cm cubes, salt lightly, and rest 15 minutes to draw out bitterness. Pat dry with paper towels. Pan-fry in olive oil over high heat until golden on all sides. Set aside.",
      "Base: in the same pan, sauté red onion and celery for about 5 minutes. Add tomatoes and simmer for about 8 minutes.",
      "Agrodolce: stir in red wine vinegar and honey (or agave); this is the soul of the dish. After 2 minutes, add chickpeas, olives, capers, and the fried eggplant.",
      "Braise: simmer everything together on low heat for about 10 minutes. Taste and balance sweet and sour — add a touch more vinegar or sweetener as needed.",
      "Serve sprinkled with toasted pine nuts and fresh basil. Excellent with whole-grain couscous or crusty bread.",
      "Freezes very well for up to 3 months; flavour often deepens after a day. Add pine nuts and basil only when serving."
    ]
  },
  {
    id: "recipe-bacalao-pil-pil",
    name: "Bacalao al Pil-Pil",
    mealTypes: ["lunch", "dinner"],
    ingredients: [
      ing("protein", "cod", { label: "salt cod (bacalao), soaked 48 h, water changed every 12 h" }),
      ing("fats", "olive oil"),
      ing("spices", "garlic"),
      ing("spices", "paprika", { label: "dried choricero pepper flesh (soaked, flesh scraped)" }),
      ing("spices", "salt", { optional: true })
    ],
    constraints: { maxCarbs: 8, glycemicIndex: "low" },
    instructions: [
      "Prepare the cod: rinse the soaked salt cod and pat completely dry. Let it sit at room temperature for 15 minutes.",
      "Garlic in oil: pour olive oil into a wide shallow pan. Gently fry sliced garlic over low heat for about 10 minutes until pale gold — not brown. Remove the garlic and set aside.",
      "Cod in oil: place the cod skin-side down in the oil. Cook over very low heat (about 70–75°C) for 8 minutes — the oil must not boil, only shimmer. Lift out the fish and leave the oil in the pan to cool slightly.",
      "The pil-pil emulsion: slowly rotate the pan in steady circles for about 15 minutes. Gelatin from the cod skin and the olive oil will form a creamy emulsion on their own — no cream, no whisk.",
      "Return the cod to the sauce. Add the soaked choricero flesh and a pinch of salt to taste. Serve with the confit garlic on the side. Patience and constant circular movement are the secret — never whisk."
    ]
  },
  {
    id: "recipe-croatian-bruschetta",
    name: "Croatian-style bruschetta",
    mealTypes: ["breakfast"],
    ingredients: [
      ing("carbs", "whole grain bread"),
      ing("fats", "avocado"),
      ing("vegetables", "sun-dried tomatoes"),
      ing("protein", "tuna", { label: "smoked mackerel or sardines", alternatives: ["salmon", "tofu", "chickpeas"] }),
      ing("liquid", "lemon juice"),
      ing("fats", "olive oil"),
      ing("spices", "salt", { label: "flaky sea salt" }),
      ing("spices", "basil"),
      ing("spices", "black pepper")
    ],
    constraints: { maxCarbs: 35, glycemicIndex: "low" },
    instructions: [
      "Toast the bread: place whole-grain slices in a toaster or dry grill pan until golden and crisp — no oil on the bread so it stays crunchy, not greasy.",
      "Avocado spread: halve the avocado, remove the pit, and scoop the flesh into a bowl. Add lemon juice, sea salt, and black pepper. Mash with a fork until chunky, not completely smooth.",
      "Toppings: halve or leave sun-dried tomatoes whole. Break {protein} into small pieces by hand for a rustic look.",
      "Assemble: spread the avocado generously on the hot toast. Top with sun-dried tomatoes and {protein}. Garnish with basil leaves and drizzle with olive oil. Serve immediately while the bread is still crisp."
    ]
  },
  {
    id: "recipe-pasta-pesto-piselli",
    name: "Pasta al Pesto di Piselli",
    mealTypes: ["lunch", "dinner"],
    ingredients: [
      ing("carbs", "brown rice", { label: "conchiglie pasta (durum wheat)" }),
      ing("vegetables", "green peas"),
      ing("spices", "basil"),
      ing("vegetables", "broccoli", { alternatives: ["cauliflower"] }),
      ing("vegetables", "cabbage", { label: "savoy cabbage, shredded" }),
      ing("vegetables", "sun-dried tomatoes"),
      ing("fats", "pumpkin seeds"),
      ing("fats", "olive oil"),
      ing("spices", "garlic"),
      ing("liquid", "lemon juice"),
      ing("spices", "black pepper")
    ],
    constraints: { maxCarbs: 60, glycemicIndex: "low" },
    instructions: [
      "Blanch green peas for 2 minutes in boiling water, then transfer to ice water to keep the bright color. Reserve a few spoonfuls for garnish.",
      "Cook broccoli florets in salted water for 4–5 minutes until tender-crisp. Add shredded savoy cabbage for the final minute. Drain and reserve some cooking water.",
      "Cook conchiglie in salted water until al dente, about 1–2 minutes less than package instructions. Drain, reserving some pasta water.",
      "Blend peas, basil, garlic, olive oil, lemon juice, salt, and black pepper into a creamy pesto. Add a little cooking water if needed for texture.",
      "Combine pasta, cooked vegetables, and most of the pesto in a deep pan. Toss over medium heat for 1–2 minutes, loosening with cooking water until the sauce coats evenly.",
      "Serve topped with reserved whole peas, sun-dried tomatoes, pumpkin seeds, and extra basil leaves."
    ]
  },
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
      ing("spices", "cayenne pepper", { optional: true }),
      ing("spices", "garlic"),
      ing("spices", "parsley", { optional: true, alternatives: ["cilantro"] })
    ],
    constraints: { maxCarbs: 20, glycemicIndex: "low" },
    instructions: [
      "Sauté onion and bell pepper in {fat} over medium heat until soft, 5–8 minutes.",
      "Add garlic, paprika, cumin, and chili — cook for 30 seconds until fragrant.",
      "Add tomatoes and tomato paste, simmer for 10–15 minutes until thickened.",
      "Add {protein} to the sauce (make wells and nestle, or crumble/stir in). Cover and cook to desired doneness.",
      "Garnish with fresh parsley or cilantro and serve with optional {grain}."
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
      "Mix chia seeds with {protein} (or a splash of plant milk) and spices.",
      "Fold until thick, then chill.",
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
      "Cook {grain} in water over medium heat, stirring occasionally.",
      "In the last minute, stir in flax seeds — add a splash more water if needed.",
      "Season with black pepper; optionally stir in a little {fat} or a splash of {liquid}.",
      "Prepare {protein} (pan-fried, baked, or boiled as suits the ingredient).",
      "Top the {grain} with {protein} and any {veg} or fresh herbs you like."
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
      "Spoon {protein} on top.",
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
      ing("spices", "cayenne pepper", { optional: true }),
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
      "Season {protein} with lemon, {fat}, and spices.",
      "Bake with {veg} until done.",
      "Serve with optional {grain}."
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
      ing("liquid", "greek yogurt", { alternatives: ["hummus", "lemon juice"] }),
      ing("liquid", "soy sauce"),
      ing("spices", "mustard"),
      ing("spices", "lemon juice"),
      ing("spices", "paprika"),
      ing("spices", "black pepper")
    ],
    constraints: { maxCarbs: 40, glycemicIndex: "low" },
    instructions: [
      "Combine lettuce, cucumber, radish, corn, and optional carrot in a bowl.",
      "Add drained {protein}.",
      "Optionally add olives and a few croutons.",
      "Whisk together {liquid}, mustard, soy sauce, paprika, salt and pepper.",
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
      ing("carbs", "potato", { optional: true, alternatives: ["sweet potato"] }),
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
    constraints: { maxCarbs: 45, glycemicIndex: "low" },
    instructions: [
      "Bring {liquid} to a boil. Add shredded cabbage and cook until starting to soften.",
      "Add julienned or grated beets and continue cooking until they lighten slightly in colour. If using potato, add diced potato with the beets.",
      "Meanwhile, sauté diced onion, garlic, and julienned carrot in olive oil until golden. Stir in tomato paste and cook 2–3 minutes.",
      "Add the sauté to the pot along with a splash of vinegar or lemon juice, bay leaf, and black pepper.",
      "Add {protein}.",
      "Simmer for 3 minutes, then turn off the heat and let rest for a few minutes.",
      "Serve hot with freshly chopped dill and parsley."
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
      ing("liquid", "greek yogurt", { alternatives: ["hummus", "tahini"] }),
      ing("spices", "mustard", { optional: true }),
      ing("spices", "lemon juice"),
      ing("spices", "black pepper"),
      ing("spices", "paprika", { optional: true })
    ],
    constraints: { maxCarbs: 30, glycemicIndex: "low" },
    instructions: [
      "Mix drained {protein} with {liquid}, black pepper, and optional mustard and paprika.",
      "Toast {grain} or lay out crackers.",
      "Place a lettuce leaf and cucumber slices on top of the toast.",
      "Spoon the {protein} salad over the top and serve."
    ]
  },
  {
    id: "recipe-snack-egg-cucumber",
    name: "Egg and cucumber snack plate",
    mealTypes: ["snack"],
    ingredients: [
      ing("protein", "eggs", { alternatives: ["tofu", "chickpeas"] }),
      ing("vegetables", "cucumber"),
      ing("fats", "olive oil", { optional: true }),
      ing("spices", "black pepper")
    ],
    constraints: { maxCarbs: 12, glycemicIndex: "low" },
    instructions: [
      "Slice {protein} and cucumber.",
      "Add {fat} and black pepper."
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
      "Add {liquid} to a bowl.",
      "Top with berries and optional chia, cinnamon, and sugar-free jam."
    ]
  },
  {
    id: "recipe-snack-apple-cottage",
    name: "Apple cinnamon cottage cup",
    mealTypes: ["snack"],
    ingredients: [
      ing("protein", "cottage cheese", { alternatives: ["greek yogurt", "tofu", "hummus"] }),
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
      "Spoon {protein} on top.",
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
      "Gently heat {liquid} in a saucepan over low heat — do not boil. Add bloomed gelatin and stir until completely dissolved.",
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
      ing("fats", "butter", { alternatives: ["olive oil"] }),
      ing("fats", "ghee", { alternatives: ["olive oil"], optional: true }),
      ing("vegetables", "spinach"),
      ing("fats", "olive oil"),
      ing("spices", "capers"),
      ing("spices", "garlic"),
      ing("liquid", "white wine", { alternatives: ["vegetable broth", "chicken broth"] }),
      ing("liquid", "lemon juice"),
      ing("spices", "lemon zest"),
      ing("spices", "parsley", { optional: true }),
      ing("spices", "black pepper")
    ],
    constraints: { maxCarbs: 8, glycemicIndex: "low" },
    instructions: [
      "Take salmon out of the fridge 15 minutes before cooking. Pat completely dry — especially the skin. Season with salt and black pepper on all sides.",
      "Heat a heavy-bottomed pan over high heat for 2–3 minutes. Add fat until just smoking.",
      "Place salmon skin-side down. Press gently with a spatula for the first 30 seconds to prevent curling. Cook undisturbed 4–5 minutes until skin is golden and crisp and the cook line has risen 2/3 up the fillet.",
      "Flip and cook 1.5–2 minutes for medium (slightly pink centre) or 3 minutes for fully cooked. Rest on a warm plate, tented with foil.",
      "In the same pan over medium heat, add garlic and cook 30 seconds. Pour in white wine or broth and reduce 1–2 minutes, scraping up any caramelised bits.",
      "Add capers, lemon juice, and lemon zest. Stir and warm 1 minute.",
      "Remove pan from heat. Finish the sauce with fat, swirling to emulsify into a glossy sauce. Stir in chopped parsley.",
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
  },
  {
    id: "recipe-vegan-savory-oats-edamame",
    name: "Savory oatmeal with mushrooms and edamame",
    mealTypes: ["breakfast"],
    ingredients: [
      ing("carbs", "oats"),
      ing("liquid", "unsweetened soy milk", { alternatives: ["unsweetened almond milk", "water"] }),
      ing("liquid", "vegetable broth", { optional: true, alternatives: ["water"] }),
      ing("fats", "flax seeds"),
      ing("protein", "mushrooms"),
      ing("vegetables", "onion"),
      ing("protein", "edamame", { alternatives: ["tofu", "chickpeas"] }),
      ing("fats", "olive oil"),
      ing("spices", "nutritional yeast", { optional: true }),
      ing("spices", "thyme"),
      ing("spices", "garlic"),
      ing("spices", "black pepper"),
      ing("spices", "parsley", { optional: true })
    ],
    constraints: { maxCarbs: 40, glycemicIndex: "low" },
    instructions: [
      "Dry-fry mushrooms in a hot pan without oil or salt until water cooks off and edges brown, 6–7 minutes.",
      "Add olive oil and onion; cook 3 minutes. Season with thyme, garlic, and black pepper at the end.",
      "Meanwhile cook oats in soy milk (and optional broth) about 5 minutes. Stir in flax seeds and nutritional yeast.",
      "Warm edamame with the mushrooms for the last minute.",
      "Serve the oatmeal topped with mushrooms and edamame; finish with parsley."
    ]
  },
  {
    id: "recipe-vegan-hummus-mushroom-toast",
    name: "Hummus toast with mushrooms and white beans",
    mealTypes: ["breakfast", "snack"],
    ingredients: [
      ing("carbs", "whole grain bread", { alternatives: ["sourdough bread"] }),
      ing("protein", "hummus"),
      ing("protein", "mushrooms"),
      ing("protein", "white beans"),
      ing("vegetables", "onion", { optional: true }),
      ing("fats", "olive oil"),
      ing("spices", "nutritional yeast", { optional: true }),
      ing("spices", "thyme"),
      ing("spices", "garlic"),
      ing("spices", "parsley", { optional: true }),
      ing("fats", "sesame seeds", { optional: true })
    ],
    constraints: { maxCarbs: 35, glycemicIndex: "low" },
    instructions: [
      "Dry-fry mushrooms with onion until deeply browned; finish with thyme and garlic.",
      "Warm white beans briefly with a little olive oil and salt.",
      "Toast the bread until dry and crisp.",
      "Spread hummus as a moisture barrier, then top with beans, mushrooms, nutritional yeast, sesame seeds, and herbs."
    ]
  },
  {
    id: "recipe-vegan-hummus-avocado-toast",
    name: "Hummus toast with avocado and edamame",
    mealTypes: ["breakfast", "snack"],
    ingredients: [
      ing("carbs", "whole grain bread", { alternatives: ["sourdough bread"] }),
      ing("protein", "hummus"),
      ing("fats", "avocado"),
      ing("vegetables", "tomato"),
      ing("protein", "edamame", { alternatives: ["chickpeas", "tofu"] }),
      ing("liquid", "lemon juice"),
      ing("spices", "black pepper"),
      ing("spices", "cayenne pepper", { optional: true })
    ],
    constraints: { maxCarbs: 35, glycemicIndex: "low" },
    instructions: [
      "Boil edamame for about 3 minutes and salt lightly.",
      "Toast the bread and spread hummus.",
      "Mash avocado with lemon juice and salt; spread over hummus.",
      "Top with tomato, edamame, pepper, and optional chili flakes."
    ]
  },
  {
    id: "recipe-vegan-shakshuka-tofu",
    name: "Vegan shakshuka with tofu and white beans",
    mealTypes: ["breakfast", "lunch"],
    ingredients: [
      ing("protein", "tofu", { alternatives: ["tempeh", "chickpeas"] }),
      ing("protein", "white beans"),
      ing("vegetables", "onion"),
      ing("spices", "garlic"),
      ing("vegetables", "bell pepper"),
      ing("vegetables", "tomato"),
      ing("liquid", "tomato paste"),
      ing("fats", "olive oil"),
      ing("fats", "avocado", { optional: true }),
      ing("carbs", "whole grain bread", { optional: true }),
      ing("spices", "cumin"),
      ing("spices", "smoked paprika"),
      ing("spices", "coriander"),
      ing("spices", "cinnamon", { optional: true }),
      ing("spices", "cayenne pepper", { optional: true }),
      ing("spices", "cilantro", { alternatives: ["parsley"], optional: true })
    ],
    constraints: { maxCarbs: 45, glycemicIndex: "low" },
    instructions: [
      "Bake or pan-sear tofu until firm and golden before it goes into the sauce.",
      "Sauté onion and bell pepper in olive oil until soft, 8 minutes.",
      "Bloom cumin, smoked paprika, coriander, garlic, and optional chili/cinnamon in the oil for 30 seconds.",
      "Cook tomato paste 1–2 minutes, add tomatoes, and simmer until thick, about 10 minutes.",
      "Stir in white beans, nestle the tofu, warm 2 minutes, and finish with herbs. Serve with optional toast and avocado."
    ]
  },
  {
    id: "recipe-vegan-mushroom-bean-salad",
    name: "Mushroom salad with white beans and edamame",
    mealTypes: ["lunch", "dinner"],
    ingredients: [
      ing("protein", "white beans"),
      ing("protein", "edamame", { alternatives: ["green peas", "chickpeas"] }),
      ing("protein", "mushrooms"),
      ing("vegetables", "onion"),
      ing("vegetables", "cucumber", { label: "pickled cucumber / cornichons" }),
      ing("vegetables", "green peas", { optional: true }),
      ing("fats", "olive oil"),
      ing("liquid", "soy yogurt", { alternatives: ["coconut yogurt"] }),
      ing("spices", "mustard"),
      ing("spices", "smoked paprika"),
      ing("spices", "dill", { optional: true }),
      ing("spices", "black pepper")
    ],
    constraints: { maxCarbs: 40, glycemicIndex: "low" },
    instructions: [
      "Brown mushrooms with onion until golden; cool completely so they do not wilt the dressing.",
      "Briefly blanch peas if using.",
      "Whisk soy yogurt with mustard, smoked paprika, pepper, and a spoon of pickle brine.",
      "Toss beans, edamame, mushrooms, cucumber, and dressing; rest 15 minutes before serving."
    ]
  },
  {
    id: "recipe-vegan-bean-tvp-stew",
    name: "White bean stew with soy textured protein",
    mealTypes: ["lunch", "dinner"],
    ingredients: [
      ing("protein", "white beans"),
      ing("protein", "red beans", { optional: true }),
      ing("protein", "soy textured protein", { alternatives: ["tempeh", "lentils"] }),
      ing("vegetables", "onion"),
      ing("spices", "garlic"),
      ing("vegetables", "bell pepper"),
      ing("vegetables", "carrot"),
      ing("vegetables", "celery"),
      ing("vegetables", "tomato"),
      ing("liquid", "tomato paste"),
      ing("fats", "olive oil"),
      ing("fats", "pumpkin seeds", { optional: true }),
      ing("liquid", "vegetable broth", { alternatives: ["water"] }),
      ing("spices", "smoked paprika"),
      ing("spices", "cumin"),
      ing("spices", "coriander"),
      ing("spices", "oregano"),
      ing("spices", "bay leaf", { optional: true }),
      ing("liquid", "lemon juice"),
      ing("spices", "parsley", { optional: true })
    ],
    constraints: { maxCarbs: 50, glycemicIndex: "low" },
    instructions: [
      "Soak textured soy protein in hot water 10 minutes, squeeze dry, and dry-fry until golden at the edges.",
      "Sauté onion, carrot, celery, and pepper in olive oil about 8 minutes.",
      "Bloom spices and garlic 30 seconds; cook tomato paste 1–2 minutes.",
      "Add tomatoes, broth, bay leaf, and the browned protein; simmer 15 minutes.",
      "Add beans for the last 5 minutes. Finish off-heat with lemon juice, parsley, and pumpkin seeds."
    ]
  },
  {
    id: "recipe-vegan-lentil-tvp-soup",
    name: "Green lentil soup with soy textured protein",
    mealTypes: ["lunch", "dinner"],
    ingredients: [
      ing("protein", "lentils"),
      ing("protein", "soy textured protein", { alternatives: ["tempeh", "chickpeas"] }),
      ing("vegetables", "onion"),
      ing("vegetables", "carrot"),
      ing("vegetables", "celery"),
      ing("spices", "garlic"),
      ing("liquid", "tomato paste"),
      ing("fats", "olive oil"),
      ing("liquid", "vegetable broth", { alternatives: ["water"] }),
      ing("spices", "cumin"),
      ing("spices", "smoked paprika"),
      ing("spices", "bay leaf", { optional: true }),
      ing("liquid", "lemon juice"),
      ing("spices", "parsley", { optional: true }),
      ing("spices", "black pepper")
    ],
    constraints: { maxCarbs: 50, glycemicIndex: "low" },
    instructions: [
      "Soak and squeeze textured soy protein, then brown it separately until smoky and crisp at the edges.",
      "Sauté onion, carrot, and celery in olive oil; bloom garlic and spices 30 seconds.",
      "Cook tomato paste briefly, add lentils and broth, and simmer until lentils are tender.",
      "Stir in the browned protein near the end. Finish with lemon juice, pepper, and parsley."
    ]
  },
  {
    id: "recipe-vegan-chickpea-lentil-curry",
    name: "Vegetable curry with chickpeas and lentils",
    mealTypes: ["lunch", "dinner"],
    ingredients: [
      ing("protein", "chickpeas"),
      ing("protein", "lentils", { optional: true }),
      ing("vegetables", "cauliflower", { alternatives: ["broccoli", "zucchini"] }),
      ing("vegetables", "carrot"),
      ing("vegetables", "onion"),
      ing("spices", "garlic"),
      ing("spices", "ginger"),
      ing("fats", "olive oil"),
      ing("liquid", "tomato paste"),
      ing("liquid", "light coconut milk", { alternatives: ["vegetable broth"] }),
      ing("spices", "curry powder"),
      ing("spices", "cumin"),
      ing("spices", "coriander"),
      ing("spices", "turmeric"),
      ing("spices", "garam masala"),
      ing("spices", "cilantro", { optional: true })
    ],
    constraints: { maxCarbs: 45, glycemicIndex: "low" },
    instructions: [
      "Bloom cumin, coriander, turmeric, and curry powder in hot oil for 30 seconds.",
      "Add onion, garlic, and ginger; cook until soft.",
      "Stir in vegetables and tomato paste, then chickpeas, optional lentils, and coconut milk.",
      "Simmer until tender, finish with garam masala and cilantro."
    ]
  },
  {
    id: "recipe-vegan-larb-lettuce",
    name: "Soy textured protein larb in lettuce leaves",
    mealTypes: ["lunch", "dinner", "snack"],
    ingredients: [
      ing("protein", "soy textured protein", { alternatives: ["tempeh", "tofu"] }),
      ing("protein", "edamame", { alternatives: ["green peas"] }),
      ing("vegetables", "shallot", { alternatives: ["onion"] }),
      ing("spices", "mint"),
      ing("spices", "cilantro"),
      ing("liquid", "lemon juice", { label: "lime juice" }),
      ing("spices", "soy sauce"),
      ing("fats", "olive oil"),
      ing("vegetables", "romaine", { alternatives: ["lettuce"] }),
      ing("spices", "cayenne pepper", { optional: true }),
      ing("fats", "sesame seeds", { optional: true, label: "toasted rice crumbs or sesame" })
    ],
    constraints: { maxCarbs: 35, glycemicIndex: "low" },
    instructions: [
      "Soak textured soy protein, squeeze dry, and fry in oil until the edges are crisp.",
      "Whisk lime juice with soy sauce, chili, and a tiny pinch of sweetener — the dressing should taste boldly sour.",
      "Toss warm protein with edamame, raw sliced shallot, and the dressing.",
      "Fold in mint and cilantro at the end; serve spooned into romaine leaves."
    ]
  },
  {
    id: "recipe-vegan-tofu-spinach-pasta",
    name: "Lentil pasta with tofu ricotta and spinach",
    mealTypes: ["lunch", "dinner"],
    ingredients: [
      ing("carbs", "quinoa", { label: "lentil pasta (cooked portion)" }),
      ing("protein", "tofu", { label: "silken tofu" }),
      ing("vegetables", "spinach"),
      ing("spices", "nutritional yeast"),
      ing("spices", "garlic"),
      ing("fats", "olive oil"),
      ing("liquid", "lemon juice"),
      ing("spices", "lemon zest", { optional: true }),
      ing("spices", "cayenne pepper", { optional: true }),
      ing("spices", "nutmeg", { optional: true }),
      ing("spices", "black pepper")
    ],
    constraints: { maxCarbs: 45, glycemicIndex: "low" },
    instructions: [
      "Mash or blend silken tofu with nutritional yeast, lemon zest, salt, and nutmeg — do not heat this ricotta.",
      "Cook pasta just shy of package time; reserve a ladle of cooking water.",
      "Warm garlic and chili in olive oil 30 seconds, wilt spinach 2 minutes.",
      "Off the heat, toss pasta with spinach, a splash of cooking water, and tofu ricotta.",
      "Finish with lemon juice and plenty of black pepper."
    ]
  },
  {
    id: "recipe-vegan-black-bean-tacos",
    name: "Black bean tacos with soy textured protein",
    mealTypes: ["lunch", "dinner"],
    ingredients: [
      ing("carbs", "whole grain tortilla", { alternatives: ["whole grain bread"] }),
      ing("protein", "black beans"),
      ing("protein", "soy textured protein", { alternatives: ["tempeh", "lentils"] }),
      ing("liquid", "soy yogurt", { label: "tzatziki / soy yogurt sauce", alternatives: ["hummus"] }),
      ing("vegetables", "tomato"),
      ing("vegetables", "onion"),
      ing("vegetables", "lettuce"),
      ing("liquid", "lemon juice", { label: "lime juice" }),
      ing("fats", "olive oil"),
      ing("spices", "cumin"),
      ing("spices", "smoked paprika"),
      ing("spices", "oregano"),
      ing("spices", "cayenne pepper", { optional: true }),
      ing("spices", "cilantro", { optional: true })
    ],
    constraints: { maxCarbs: 50, glycemicIndex: "low" },
    instructions: [
      "Soak and brown textured soy protein with cumin, smoked paprika, oregano, and chili.",
      "Warm black beans; mash half of them so the filling holds together.",
      "Warm tortillas. Assemble with yogurt sauce, lettuce, beans, protein, tomato, onion, lime, and cilantro."
    ]
  },
  {
    id: "recipe-vegan-tzatziki-crudites",
    name: "Soy yogurt tzatziki with vegetable sticks",
    mealTypes: ["snack"],
    ingredients: [
      ing("liquid", "soy yogurt", { alternatives: ["coconut yogurt"] }),
      ing("vegetables", "cucumber"),
      ing("spices", "garlic"),
      ing("liquid", "lemon juice"),
      ing("fats", "olive oil"),
      ing("spices", "dill"),
      ing("spices", "black pepper"),
      ing("vegetables", "carrot", { optional: true }),
      ing("vegetables", "bell pepper", { optional: true }),
      ing("vegetables", "celery", { optional: true })
    ],
    constraints: { maxCarbs: 20, glycemicIndex: "low" },
    instructions: [
      "Grate cucumber and squeeze out excess liquid.",
      "Stir into soy yogurt with garlic, lemon juice, olive oil, dill, and pepper.",
      "Serve with carrot, pepper, and celery sticks."
    ]
  },
  {
    id: "recipe-vegan-chia-soy",
    name: "Chia pudding with soy yogurt and berries",
    mealTypes: ["breakfast", "snack"],
    ingredients: [
      ing("liquid", "soy yogurt", { alternatives: ["coconut yogurt", "unsweetened soy milk"] }),
      ing("carbs", "chia seeds"),
      ing("vegetables", "berries"),
      ing("fats", "almond butter", { optional: true, alternatives: ["almonds"] }),
      ing("spices", "cinnamon"),
      ing("spices", "vanilla", { optional: true })
    ],
    constraints: { maxCarbs: 35, glycemicIndex: "low" },
    instructions: [
      "Mix chia seeds with soy yogurt (or a splash of soy milk) and spices until thick.",
      "Chill until set.",
      "Top with berries and optional nut butter."
    ]
  },
  {
    id: "recipe-vegan-soy-yogurt-bowl",
    name: "Soy yogurt bowl with berries and almonds",
    mealTypes: ["breakfast", "snack"],
    ingredients: [
      ing("liquid", "soy yogurt"),
      ing("vegetables", "berries"),
      ing("fats", "almonds"),
      ing("spices", "sugar-free jam", { optional: true }),
      ing("spices", "cinnamon", { optional: true }),
      ing("spices", "lemon zest", { optional: true })
    ],
    constraints: { maxCarbs: 25, glycemicIndex: "low" },
    instructions: [
      "Stir a pinch of salt and optional lemon zest into the soy yogurt.",
      "Top with berries, almonds, cinnamon, and optional sugar-free jam just before eating."
    ]
  },
  {
    id: "recipe-vegan-pea-soup",
    name: "Vegan green pea soup",
    mealTypes: ["lunch", "dinner"],
    ingredients: [
      ing("protein", "green peas"),
      ing("vegetables", "carrot"),
      ing("vegetables", "onion"),
      ing("vegetables", "celery", { optional: true }),
      ing("vegetables", "potato", { optional: true }),
      ing("spices", "garlic"),
      ing("fats", "olive oil"),
      ing("liquid", "vegetable broth", { alternatives: ["water"] }),
      ing("spices", "thyme"),
      ing("spices", "bay leaf", { optional: true }),
      ing("spices", "black pepper"),
      ing("liquid", "lemon juice", { optional: true }),
      ing("spices", "parsley", { optional: true })
    ],
    constraints: { maxCarbs: 40, glycemicIndex: "low" },
    instructions: [
      "Sauté onion, carrot, and optional celery in olive oil until soft.",
      "Add garlic, thyme, and bay leaf for 30 seconds.",
      "Add peas, optional potato, and broth; simmer until everything is tender.",
      "Blend part of the soup for body, leaving some chunks. Finish with lemon, pepper, and parsley."
    ]
  },
  {
    id: "recipe-vegan-tofu-wrap",
    name: "Tofu wrap with vegetables and soy yogurt sauce",
    mealTypes: ["lunch", "dinner"],
    ingredients: [
      ing("carbs", "whole grain tortilla", { alternatives: ["whole grain bread"] }),
      ing("protein", "tofu", { alternatives: ["tempeh", "chickpeas"] }),
      ing("vegetables", "bell pepper"),
      ing("vegetables", "cucumber"),
      ing("vegetables", "onion"),
      ing("vegetables", "lettuce", { optional: true }),
      ing("liquid", "soy yogurt", { alternatives: ["hummus"] }),
      ing("fats", "olive oil"),
      ing("spices", "smoked paprika"),
      ing("spices", "cumin"),
      ing("spices", "garlic"),
      ing("liquid", "lemon juice"),
      ing("spices", "dill", { alternatives: ["parsley"], optional: true })
    ],
    constraints: { maxCarbs: 45, glycemicIndex: "low" },
    instructions: [
      "Cube and pan-sear tofu with smoked paprika, cumin, and garlic until golden.",
      "Stir soy yogurt with lemon, dill, and salt for a quick sauce.",
      "Warm the tortilla; fill with tofu, pepper, cucumber, onion, lettuce, and sauce."
    ]
  },
  {
    id: "recipe-vegan-tofu-chickpea-bowl",
    name: "Tofu chickpea bowl with roasted vegetables",
    mealTypes: ["lunch", "dinner"],
    ingredients: [
      ing("protein", "tofu"),
      ing("protein", "chickpeas"),
      ing("carbs", "quinoa", { alternatives: ["buckwheat", "brown rice"] }),
      ing("vegetables", "broccoli"),
      ing("vegetables", "carrot"),
      ing("vegetables", "sweet potato", { optional: true }),
      ing("vegetables", "bell pepper"),
      ing("fats", "olive oil"),
      ing("liquid", "lemon juice"),
      ing("fats", "tahini", { optional: true }),
      ing("spices", "cumin"),
      ing("spices", "smoked paprika"),
      ing("spices", "parsley", { optional: true }),
      ing("spices", "black pepper")
    ],
    constraints: { maxCarbs: 50, glycemicIndex: "low" },
    instructions: [
      "Cook quinoa. Roast or steam broccoli, carrot, optional sweet potato, and pepper with olive oil and spices.",
      "Pan-sear tofu until crisp; warm chickpeas with cumin and smoked paprika.",
      "Assemble the bowl and dress with lemon juice and optional tahini; finish with parsley."
    ]
  }
];
