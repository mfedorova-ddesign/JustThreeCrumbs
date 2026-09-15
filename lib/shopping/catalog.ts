import { IngredientCategory } from "@/types";

/** Merge shopping lines that are the same product in the store. */
export const INGREDIENT_ALIASES: Record<string, string> = {
  "dijon mustard": "mustard",
  "almond flakes": "almonds",
  romaine: "lettuce"
};

/** Not bought on a normal trip — shown under “You probably have this”. */
export const PANTRY_STAPLES = new Set([
  "water",
  "black pepper",
  "turmeric",
  "cinnamon",
  "cumin",
  "coriander",
  "paprika",
  "smoked paprika",
  "curry powder",
  "garam masala",
  "asafoetida",
  "oregano",
  "thyme",
  "basil",
  "bay leaf",
  "vanilla",
  "nutmeg",
  "cayenne pepper",
  "rosemary",
  "garlic powder",
  "sweetener",
  "erythritol",
  "baking powder",
  "cocoa powder",
  "gelatin",
  "lemon zest"
]);

export type SupermarketAisle =
  | "produce"
  | "meat_fish"
  | "dairy_eggs"
  | "bakery"
  | "dry_goods"
  | "canned_jarred"
  | "oils_condiments"
  | "pantry_home";

export const AISLE_ORDER: SupermarketAisle[] = [
  "produce",
  "meat_fish",
  "dairy_eggs",
  "bakery",
  "dry_goods",
  "canned_jarred",
  "oils_condiments",
  "pantry_home"
];

export const AISLE_LABELS: Record<SupermarketAisle, string> = {
  produce: "Produce",
  meat_fish: "Meat & fish",
  dairy_eggs: "Dairy & eggs",
  bakery: "Bakery",
  dry_goods: "Rice, grains & beans",
  canned_jarred: "Canned & jarred",
  oils_condiments: "Oils & condiments",
  pantry_home: "You probably have this"
};

export type PurchaseSpec =
  | { mode: "pantry" }
  | { mode: "count"; unitGrams: number; singular: string; plural: string }
  | { mode: "pack"; packGrams: number; label?: string }
  | { mode: "jar"; jarGrams: number; label: string }
  | { mode: "bottle"; label: string }
  | { mode: "can"; canGrams: number; label: string }
  | { mode: "carton"; cartonMl: number; label: string }
  | { mode: "tub"; tubGrams: number; label: string }
  | { mode: "loaf"; label: string }
  | { mode: "carton_eggs"; eggsPerCarton: number; gramsPerEgg: number };

const MEAT_FISH = new Set([
  "chicken breast",
  "turkey breast",
  "salmon",
  "cod",
  "tuna",
  "beef",
  "ribeye steak",
  "bacon",
  "duck breast",
  "trout",
  "sea bass",
  "anchovies"
]);

const DAIRY = new Set([
  "eggs",
  "egg whites",
  "greek yogurt",
  "cottage cheese",
  "feta cheese",
  "cream",
  "milk",
  "butter",
  "soft cheese",
  "sour cream",
  "cheddar",
  "mascarpone",
  "goat cheese",
  "ricotta",
  "coconut yogurt"
]);

const PRODUCE_COUNT: Record<string, { unitGrams: number; singular: string; plural: string }> = {
  avocado: { unitGrams: 150, singular: "avocado", plural: "avocados" },
  cucumber: { unitGrams: 300, singular: "cucumber", plural: "cucumbers" },
  tomato: { unitGrams: 120, singular: "tomato", plural: "tomatoes" },
  onion: { unitGrams: 150, singular: "onion", plural: "onions" },
  shallot: { unitGrams: 30, singular: "shallot", plural: "shallots" },
  garlic: { unitGrams: 40, singular: "garlic bulb", plural: "garlic bulbs" },
  ginger: { unitGrams: 50, singular: "ginger root", plural: "ginger roots" },
  carrot: { unitGrams: 80, singular: "carrot", plural: "carrots" },
  celery: { unitGrams: 200, singular: "celery bunch", plural: "celery bunches" },
  "bell pepper": { unitGrams: 150, singular: "bell pepper", plural: "bell peppers" },
  zucchini: { unitGrams: 250, singular: "zucchini", plural: "zucchinis" },
  eggplant: { unitGrams: 300, singular: "eggplant", plural: "eggplants" },
  broccoli: { unitGrams: 350, singular: "broccoli head", plural: "broccoli heads" },
  cauliflower: { unitGrams: 600, singular: "cauliflower head", plural: "cauliflower heads" },
  cabbage: { unitGrams: 800, singular: "cabbage", plural: "cabbages" },
  lettuce: { unitGrams: 300, singular: "lettuce head", plural: "lettuce heads" },
  spinach: { unitGrams: 200, singular: "bag spinach", plural: "bags spinach" },
  potato: { unitGrams: 150, singular: "potato", plural: "potatoes" },
  "sweet potato": { unitGrams: 200, singular: "sweet potato", plural: "sweet potatoes" },
  pumpkin: { unitGrams: 500, singular: "pumpkin", plural: "pumpkins" },
  banana: { unitGrams: 120, singular: "banana", plural: "bananas" },
  apple: { unitGrams: 180, singular: "apple", plural: "apples" },
  pear: { unitGrams: 180, singular: "pear", plural: "pears" },
  orange: { unitGrams: 180, singular: "orange", plural: "oranges" },
  lemon: { unitGrams: 60, singular: "lemon", plural: "lemons" },
  beets: { unitGrams: 150, singular: "beet", plural: "beets" },
  mushrooms: { unitGrams: 250, singular: "mushroom pack", plural: "mushroom packs" },
  asparagus: { unitGrams: 250, singular: "asparagus bunch", plural: "asparagus bunches" },
  arugula: { unitGrams: 100, singular: "bag arugula", plural: "bags arugula" },
  berries: { unitGrams: 150, singular: "berries punnet", plural: "berries punnets" },
  "pomegranate seeds": { unitGrams: 150, singular: "pomegranate", plural: "pomegranates" }
};

const AISLE_OVERRIDES: Record<string, SupermarketAisle> = {
  mustard: "oils_condiments",
  "tomato paste": "canned_jarred",
  "soy sauce": "oils_condiments",
  vinegar: "oils_condiments",
  "balsamic vinegar": "oils_condiments",
  honey: "oils_condiments",
  tahini: "oils_condiments",
  hummus: "dairy_eggs",
  "olive oil": "oils_condiments",
  ghee: "oils_condiments",
  "coconut oil": "oils_condiments",
  butter: "dairy_eggs",
  "almond butter": "oils_condiments",
  "greek yogurt": "dairy_eggs",
  "cottage cheese": "dairy_eggs",
  "sour cream": "dairy_eggs",
  milk: "dairy_eggs",
  "unsweetened almond milk": "dairy_eggs",
  "light coconut milk": "canned_jarred",
  "coconut cream": "canned_jarred",
  "vegetable broth": "canned_jarred",
  "chicken broth": "canned_jarred",
  tuna: "canned_jarred",
  olives: "canned_jarred",
  capers: "canned_jarred",
  lentils: "dry_goods",
  chickpeas: "canned_jarred",
  "white beans": "canned_jarred",
  "red beans": "canned_jarred",
  "black beans": "canned_jarred",
  quinoa: "dry_goods",
  buckwheat: "dry_goods",
  "brown rice": "dry_goods",
  oats: "dry_goods",
  tofu: "dry_goods",
  tempeh: "dry_goods",
  crackers: "bakery",
  croutons: "bakery",
  "whole grain bread": "bakery",
  "sourdough bread": "bakery",
  "lemon juice": "oils_condiments",
  harissa: "oils_condiments",
  "worcestershire sauce": "oils_condiments",
  "sun-dried tomatoes": "canned_jarred",
  cilantro: "produce",
  parsley: "produce",
  dill: "produce",
  mint: "produce",
  "fresh herbs": "produce",
  corn: "produce",
  radish: "produce",
  "green peas": "produce",
  "green beans": "produce"
};

/** Per-ingredient purchase packaging (store-shelf units). */
export const PURCHASE_BY_NAME: Record<string, PurchaseSpec> = {
  mustard: { mode: "jar", jarGrams: 200, label: "mustard" },
  "tomato paste": { mode: "jar", jarGrams: 200, label: "tomato paste" },
  "soy sauce": { mode: "bottle", label: "soy sauce" },
  vinegar: { mode: "bottle", label: "vinegar" },
  "balsamic vinegar": { mode: "bottle", label: "balsamic vinegar" },
  honey: { mode: "jar", jarGrams: 250, label: "honey" },
  tahini: { mode: "jar", jarGrams: 300, label: "tahini" },
  hummus: { mode: "tub", tubGrams: 200, label: "hummus" },
  "olive oil": { mode: "bottle", label: "olive oil" },
  ghee: { mode: "jar", jarGrams: 250, label: "ghee" },
  "coconut oil": { mode: "jar", jarGrams: 250, label: "coconut oil" },
  butter: { mode: "pack", packGrams: 200, label: "butter" },
  "almond butter": { mode: "jar", jarGrams: 250, label: "almond butter" },
  "greek yogurt": { mode: "tub", tubGrams: 500, label: "Greek yogurt" },
  "cottage cheese": { mode: "tub", tubGrams: 300, label: "cottage cheese" },
  "sour cream": { mode: "tub", tubGrams: 200, label: "sour cream" },
  milk: { mode: "carton", cartonMl: 1000, label: "milk" },
  "unsweetened almond milk": { mode: "carton", cartonMl: 1000, label: "almond milk" },
  "light coconut milk": { mode: "can", canGrams: 400, label: "coconut milk" },
  "coconut cream": { mode: "can", canGrams: 400, label: "coconut cream" },
  "vegetable broth": { mode: "carton", cartonMl: 1000, label: "vegetable broth" },
  "chicken broth": { mode: "carton", cartonMl: 1000, label: "chicken broth" },
  tuna: { mode: "can", canGrams: 145, label: "tinned tuna" },
  olives: { mode: "jar", jarGrams: 200, label: "olives" },
  capers: { mode: "jar", jarGrams: 100, label: "capers" },
  lentils: { mode: "pack", packGrams: 500, label: "lentils" },
  chickpeas: { mode: "can", canGrams: 400, label: "chickpeas" },
  "white beans": { mode: "can", canGrams: 400, label: "white beans" },
  "red beans": { mode: "can", canGrams: 400, label: "red beans" },
  "black beans": { mode: "can", canGrams: 400, label: "black beans" },
  quinoa: { mode: "pack", packGrams: 500, label: "quinoa" },
  buckwheat: { mode: "pack", packGrams: 500, label: "buckwheat" },
  "brown rice": { mode: "pack", packGrams: 1000, label: "brown rice" },
  oats: { mode: "pack", packGrams: 500, label: "oats" },
  tofu: { mode: "pack", packGrams: 400, label: "tofu" },
  tempeh: { mode: "pack", packGrams: 300, label: "tempeh" },
  "chicken breast": { mode: "pack", packGrams: 500, label: "chicken breast" },
  "turkey breast": { mode: "pack", packGrams: 500, label: "turkey breast" },
  salmon: { mode: "pack", packGrams: 400, label: "salmon fillet" },
  cod: { mode: "pack", packGrams: 400, label: "cod fillet" },
  beef: { mode: "pack", packGrams: 500, label: "beef" },
  trout: { mode: "pack", packGrams: 400, label: "trout fillet" },
  "sea bass": { mode: "pack", packGrams: 400, label: "sea bass fillet" },
  eggs: { mode: "carton_eggs", eggsPerCarton: 6, gramsPerEgg: 60 },
  crackers: { mode: "pack", packGrams: 200, label: "crackers" },
  croutons: { mode: "pack", packGrams: 150, label: "croutons" },
  "whole grain bread": { mode: "loaf", label: "whole grain bread" },
  "sourdough bread": { mode: "loaf", label: "sourdough loaf" },
  "dark chocolate": { mode: "pack", packGrams: 100, label: "dark chocolate" },
  "protein powder": { mode: "pack", packGrams: 500, label: "protein powder" },
  "chia seeds": { mode: "pack", packGrams: 200, label: "chia seeds" },
  "flax seeds": { mode: "pack", packGrams: 200, label: "flax seeds" },
  almonds: { mode: "pack", packGrams: 200, label: "almonds" },
  walnuts: { mode: "pack", packGrams: 200, label: "walnuts" },
  "lemon juice": { mode: "bottle", label: "lemon juice" },
  harissa: { mode: "jar", jarGrams: 100, label: "harissa" },
  "worcestershire sauce": { mode: "bottle", label: "Worcestershire sauce" },
  water: { mode: "pantry" }
};

// lemon as produce (not in data as whole lemon - only juice; leave)

export function canonicalIngredientName(rawName: string): string {
  const key = rawName.trim().toLowerCase();
  return INGREDIENT_ALIASES[key] ?? key;
}

export function titleCaseName(name: string): string {
  return name.replace(/\b\w/g, (char) => char.toUpperCase());
}

export function shoppingAisle(canonical: string, category: IngredientCategory): SupermarketAisle {
  if (PANTRY_STAPLES.has(canonical) || PURCHASE_BY_NAME[canonical]?.mode === "pantry") {
    return "pantry_home";
  }

  const override = AISLE_OVERRIDES[canonical];
  if (override) return override;

  if (PRODUCE_COUNT[canonical] || category === "vegetables") return "produce";
  if (MEAT_FISH.has(canonical)) return "meat_fish";
  if (DAIRY.has(canonical)) return "dairy_eggs";
  if (category === "carbs") return "dry_goods";
  if (category === "fats") return "oils_condiments";
  if (category === "spices") return "oils_condiments";
  if (category === "liquid") return "dairy_eggs";
  if (category === "protein") return MEAT_FISH.has(canonical) ? "meat_fish" : "dry_goods";

  return "dry_goods";
}

export function purchaseSpecFor(canonical: string, category: IngredientCategory): PurchaseSpec {
  if (PANTRY_STAPLES.has(canonical)) return { mode: "pantry" };
  const explicit = PURCHASE_BY_NAME[canonical];
  if (explicit) return explicit;

  const produce = PRODUCE_COUNT[canonical];
  if (produce) {
    return { mode: "count", ...produce };
  }

  if (category === "vegetables") {
    return {
      mode: "count",
      unitGrams: 100,
      singular: canonical,
      plural: `${canonical}s`
    };
  }

  if (MEAT_FISH.has(canonical)) {
    return { mode: "pack", packGrams: 400, label: canonical };
  }

  if (category === "carbs" || category === "protein") {
    return { mode: "pack", packGrams: 500, label: canonical };
  }

  if (category === "fats") {
    return { mode: "jar", jarGrams: 250, label: canonical };
  }

  if (category === "spices") {
    return { mode: "jar", jarGrams: 50, label: canonical };
  }

  return { mode: "pack", packGrams: 200, label: canonical };
}
