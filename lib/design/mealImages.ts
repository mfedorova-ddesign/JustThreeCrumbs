/** Curated Unsplash food photography — deterministic pick per meal id. */
const MEAL_IMAGES = [
  "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=640&q=80",
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=640&q=80",
  "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=640&q=80",
  "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?auto=format&fit=crop&w=640&q=80",
  "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=640&q=80",
  "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=640&q=80",
  "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=640&q=80",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=640&q=80",
  "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=640&q=80",
  "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=640&q=80"
];

/** Per-recipe image overrides — take precedence over the hash-based fallback. */
const RECIPE_IMAGE_OVERRIDES: Record<string, string> = {
  "recipe-shakshuka-toast": "/images/shakshuka.webp",
  "author-shakshuka-toast": "/images/shakshuka.webp",
  "recipe-chia-pudding-berries": "/images/chia.jpg",
  "recipe-savory-oats-eggs": "/images/savory-oatmeal.jpg",
  "recipe-yogurt-berries-nuts": "/images/yogurt.webp",
  "recipe-green-curry": "/images/curry.jpg",
  "recipe-legume-soup": "/images/MOROCCAN.webp",
  "recipe-buckwheat-skillet": "/images/kasa.jpg",
  "recipe-lemon-herb-bake": "/images/Lemon-Herb-Chicken.jpg",
  "recipe-herb-baked-fish": "/images/Baked-Fish-with-Vegetables.jpg",
  "recipe-baked-eggplant": "/images/Grilled-eggplant.jpg",
  "recipe-borscht-style": "/images/borsh.jpg",
  "recipe-snack-tuna-cup": "/images/Simple-Tuna-Salad.webp",
  "recipe-snack-egg-cucumber": "/images/egg-cucumber.webp",
  "recipe-snack-hummus-veggies": "/images/hummus-with-vegetable-sticks.png",
  "recipe-snack-yogurt-berry": "/images/Granola-Yogurt.jpg",
  "recipe-protein-salad-plate": "/images/salad.jpg",
  "recipe-tuna-salad": "/images/Skinny-Salad.webp",
  "recipe-snack-apple-cottage": "/images/AppleCinnamonCottageCheese.jpg",
  "recipe-snack-chocolate-nuts": "/images/chocolade-puur.png",
  "recipe-broccoli-cheddar-soup": "/images/soup.jpg",
};

export function mealImageUrlForId(mealId: string): string {
  if (RECIPE_IMAGE_OVERRIDES[mealId]) {
    return RECIPE_IMAGE_OVERRIDES[mealId];
  }
  let hash = 0;
  for (let i = 0; i < mealId.length; i++) {
    hash = (hash * 31 + mealId.charCodeAt(i)) >>> 0;
  }
  return MEAL_IMAGES[hash % MEAL_IMAGES.length];
}
