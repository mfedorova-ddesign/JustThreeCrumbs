import { Ingredient, Recipe, RecipeIngredientRule } from "@/types";

/** UI chip labels → ingredient allergen tags + text scrubbing keys. */
const ALLERGY_ALIASES: Record<string, string[]> = {
  dairy: ["dairy", "milk"],
  milk: ["dairy", "milk"],
  egg: ["egg", "eggs"],
  eggs: ["egg", "eggs"],
  fish: ["fish"],
  shellfish: ["shellfish"],
  "tree nuts": ["tree nuts", "tree nut"],
  "tree nut": ["tree nuts", "tree nut"],
  peanuts: ["peanuts", "peanut"],
  peanut: ["peanuts", "peanut"],
  soy: ["soy"],
  sesame: ["sesame"],
  "wheat/gluten": ["wheat", "gluten", "wheat/gluten"],
  wheat: ["wheat", "gluten", "wheat/gluten"],
  gluten: ["wheat", "gluten", "wheat/gluten"]
};

/**
 * Words that must not appear in meal title/steps when the related allergy is declared.
 * Matched with word boundaries (so "eggplant" does not trip "egg").
 */
const ALLERGEN_TEXT_TERMS: Record<string, string[]> = {
  fish: [
    "fish",
    "salmon",
    "tuna",
    "cod",
    "bacalao",
    "mackerel",
    "sardines",
    "sardine",
    "anchovy",
    "anchovies",
    "seafood",
    "pil-pil"
  ],
  shellfish: ["shellfish", "shrimp", "prawn", "prawns", "crab", "lobster"],
  egg: ["egg", "eggs", "yolk", "yolks", "omelet", "omelette", "hollandaise"],
  eggs: ["egg", "eggs", "yolk", "yolks", "omelet", "omelette", "hollandaise"],
  dairy: [
    "milk",
    "butter",
    "cream",
    "cheese",
    "yogurt",
    "yoghurt",
    "feta",
    "cheddar",
    "cottage",
    "ghee",
    "mascarpone",
    "parmesan",
    "sour cream"
  ],
  milk: [
    "milk",
    "butter",
    "cream",
    "cheese",
    "yogurt",
    "yoghurt",
    "feta",
    "cheddar",
    "cottage",
    "ghee",
    "mascarpone",
    "parmesan",
    "sour cream"
  ]
};

const SLOT_KEYS = ["protein", "vegetables", "veg", "carbs", "grain", "fats", "fat", "liquid"] as const;

export function normalizeAllergySet(allergies: string[]): Set<string> {
  const out = new Set<string>();
  for (const raw of allergies.map((a) => a.toLowerCase().trim()).filter((a) => a && a !== "none")) {
    out.add(raw);
    for (const alias of ALLERGY_ALIASES[raw] ?? []) out.add(alias);
  }
  return out;
}

function capitalizeName(name: string): string {
  if (!name) return name;
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function firstByCategory(ingredients: Ingredient[], category: Ingredient["category"]): Ingredient | undefined {
  return ingredients.find((item) => item.category === category);
}

function listByCategory(ingredients: Ingredient[], category: Ingredient["category"]): Ingredient[] {
  return ingredients.filter((item) => item.category === category);
}

export function buildSlotFills(ingredients: Ingredient[]): Record<string, string> {
  const protein = firstByCategory(ingredients, "protein");
  const veggies = listByCategory(ingredients, "vegetables").map((v) => v.name);
  const vegLabel = veggies.slice(0, 2).join(" and ") || "vegetables";
  const grain = firstByCategory(ingredients, "carbs");
  const fat = firstByCategory(ingredients, "fats");
  const liquid = firstByCategory(ingredients, "liquid");

  return {
    protein: protein?.name ?? "protein",
    vegetables: vegLabel,
    veg: vegLabel,
    carbs: grain?.name ?? "grains",
    grain: grain?.name ?? "grains",
    fats: fat?.name ?? "oil",
    fat: fat?.name ?? "oil",
    liquid: liquid?.name ?? "liquid"
  };
}

export function buildHighlightIngredients(ingredients: Ingredient[], title: string): string[] {
  const titleLower = title.toLowerCase();
  const candidates: Ingredient[] = [];

  const protein =
    firstByCategory(ingredients, "protein") ??
    listByCategory(ingredients, "liquid").find((item) =>
      /yogurt|cream|milk|cottage|hummus|tofu/i.test(item.name)
    );
  if (protein) candidates.push(protein);

  const liquid = listByCategory(ingredients, "liquid").find(
    (item) => item !== protein && /cream|yogurt|milk|broth/i.test(item.name)
  );
  if (liquid) candidates.push(liquid);

  const veg =
    listByCategory(ingredients, "vegetables").find((v) => !titleLower.includes(v.name.toLowerCase())) ??
    firstByCategory(ingredients, "vegetables");
  if (veg) candidates.push(veg);

  const grain = firstByCategory(ingredients, "carbs");
  if (grain) candidates.push(grain);

  const unique: string[] = [];
  for (const item of candidates) {
    const label = item.name;
    if (titleLower.includes(label.toLowerCase())) continue;
    if (unique.some((u) => u.toLowerCase() === label.toLowerCase())) continue;
    unique.push(label);
    if (unique.length >= 3) break;
  }
  return unique;
}

/** Keep the recipe title; only swap allergen/primary terms, then optionally append highlights. */
export function adaptRecipeTitle(
  recipeName: string,
  ingredients: Ingredient[],
  renameMap: Map<string, string>,
  allergySet: Set<string>,
  slots: Record<string, string>
): string {
  let name = recipeName.trim();
  name = applyRenameMap(name, renameMap, ingredients);
  if (allergySet.size > 0) {
    name = scrubAllergenTerms(name, allergySet, slots, ingredients);
  }

  // Clean leftover joiners after removals ("with with", trailing "with")
  name = name
    .replace(/\bwith\s+with\b/gi, "with")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+,/g, ",")
    .replace(/,\s*$/g, "")
    .replace(/\s+with\s*$/i, "")
    .trim();

  const highlights = buildHighlightIngredients(ingredients, name);
  if (highlights.length > 0) {
    const alreadyHasWith = /\bwith\b/i.test(name);
    if (alreadyHasWith) {
      if (highlights.length === 1) name = `${name} and ${highlights[0]}`;
      else {
        name = `${name}, ${highlights.slice(0, -1).join(", ")} and ${highlights[highlights.length - 1]}`;
      }
    } else if (highlights.length === 1) {
      name = `${name} with ${highlights[0]}`;
    } else if (highlights.length === 2) {
      name = `${name} with ${highlights[0]} and ${highlights[1]}`;
    } else {
      name = `${name} with ${highlights[0]}, ${highlights[1]} and ${highlights[2]}`;
    }
  }

  return capitalizeName(name);
}

function fillPlaceholders(text: string, slots: Record<string, string>): string {
  return text.replace(/\{([a-zA-Z]+)\}/g, (match, key: string) => {
    const normalized = key.toLowerCase();
    if ((SLOT_KEYS as readonly string[]).includes(normalized) && slots[normalized]) {
      return slots[normalized];
    }
    return match;
  });
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function replaceWholePhrase(text: string, from: string, to: string): string {
  if (!from || from.toLowerCase() === to.toLowerCase()) return text;
  const pattern = new RegExp(`\\b${escapeRegExp(from)}\\b`, "gi");
  return text.replace(pattern, to);
}

function findChosenForRule(rule: RecipeIngredientRule, ingredients: Ingredient[]): Ingredient | undefined {
  const names = new Set([rule.primary, ...(rule.alternatives ?? [])].map((n) => n.toLowerCase()));
  return ingredients.find((ing) => names.has(ing.name.toLowerCase()));
}

/** Map every unused option in a rule (and common generics) onto the ingredient actually chosen. */
function buildIngredientRenameMap(recipe: Recipe | undefined, ingredients: Ingredient[]): Map<string, string> {
  const map = new Map<string, string>();
  if (!recipe) return map;

  for (const rule of recipe.ingredients) {
    const chosen = findChosenForRule(rule, ingredients);
    if (!chosen) continue;
    const options = [rule.primary, ...(rule.alternatives ?? [])];
    for (const option of options) {
      if (option.toLowerCase() !== chosen.name.toLowerCase()) {
        map.set(option.toLowerCase(), chosen.name);
        if (rule.category === "protein") {
          const optionHead = option.split(/\s+/)[0]?.toLowerCase();
          const chosenHead = chosen.name.split(/\s+/)[0];
          if (optionHead && chosenHead && optionHead.length > 3 && optionHead !== chosenHead.toLowerCase()) {
            map.set(optionHead, chosenHead);
          }
        }
      }
    }
    if (rule.label) {
      const shortLabel = rule.label.split(",")[0]?.trim();
      if (shortLabel && shortLabel.toLowerCase() !== chosen.name.toLowerCase()) {
        map.set(shortLabel.toLowerCase(), chosen.name);
      }
    }

    if (rule.category === "protein") {
      const chosenAllergens = new Set((chosen.allergens ?? []).map((a) => a.toLowerCase()));
      if (!chosenAllergens.has("fish")) {
        for (const term of ALLERGEN_TEXT_TERMS.fish) map.set(term, chosen.name);
      }
      if (!chosenAllergens.has("egg")) {
        for (const term of ["egg", "eggs", "yolk", "yolks"]) map.set(term, chosen.name);
      }
      if (chosen.vegetarian) {
        const broth =
          ingredients.find((ing) => /broth|water/i.test(ing.name))?.name ?? "vegetable broth";
        map.set("meat", chosen.name);
        map.set("meat broth", broth);
        map.set("sliced meat", chosen.name);
        map.set("pre-cooked sliced meat", chosen.name);
      }
    }
    if (rule.category === "fats" || rule.category === "liquid" || rule.category === "protein") {
      const chosenAllergens = new Set((chosen.allergens ?? []).map((a) => a.toLowerCase()));
      if (!chosenAllergens.has("dairy")) {
        const primaryAllergenHint = /yogurt|milk|cream|cheese|butter|ghee|feta|cheddar|cottage/i.test(
          rule.primary
        );
        for (const term of [
          "butter",
          "milk",
          "cream",
          "yogurt",
          "yoghurt",
          "cheese",
          "ghee",
          "sour cream"
        ]) {
          if (primaryAllergenHint || options.some((o) => o.toLowerCase() === term)) {
            map.set(term, chosen.name);
          }
        }
      }
    }
  }
  return map;
}

function applyRenameMap(
  text: string,
  renameMap: Map<string, string>,
  safeIngredients: Ingredient[] = []
): string {
  const protections: { token: string; original: string }[] = [];
  let result = text;
  const protectPhrases = safeIngredients
    .map((ing) => ing.name)
    .sort((a, b) => b.length - a.length);
  protectPhrases.forEach((phrase, index) => {
    const token = `__REN_SAFE_${index}__`;
    const pattern = new RegExp(escapeRegExp(phrase), "gi");
    if (!pattern.test(result)) return;
    result = result.replace(pattern, token);
    protections.push({ token, original: phrase });
  });

  const keys = [...renameMap.keys()].sort((a, b) => b.length - a.length);
  for (const key of keys) {
    const target = renameMap.get(key);
    if (!target) continue;
    result = replaceWholePhrase(result, key, target);
  }

  for (const { token, original } of protections) {
    result = result.split(token).join(original);
  }
  return result;
}

export function mealCopyContainsForbiddenAllergenText(
  text: string,
  allergySet: Set<string>,
  safeIngredients: Ingredient[] = []
): string | null {
  let masked = text;
  const phrases = safeIngredients.map((ing) => ing.name).sort((a, b) => b.length - a.length);
  phrases.forEach((phrase, index) => {
    masked = masked.replace(new RegExp(escapeRegExp(phrase), "gi"), `__OK_${index}__`);
  });

  for (const allergy of allergySet) {
    const terms = ALLERGEN_TEXT_TERMS[allergy];
    if (!terms) continue;
    for (const term of terms) {
      const pattern = new RegExp(`\\b${escapeRegExp(term)}\\b`, "i");
      if (pattern.test(masked)) return term;
    }
  }
  return null;
}

function scrubAllergenTerms(
  text: string,
  allergySet: Set<string>,
  slots: Record<string, string>,
  safeIngredients: Ingredient[] = []
): string {
  const protections: { token: string; original: string }[] = [];
  let result = text;

  // Protect names of ingredients already on the plate (e.g. "coconut yogurt" must keep "yogurt")
  const protectPhrases = [
    ...safeIngredients.map((ing) => ing.name),
    ...Object.values(slots)
  ]
    .filter(Boolean)
    .sort((a, b) => b.length - a.length);

  protectPhrases.forEach((phrase, index) => {
    const token = `__SAFE_${index}__`;
    const pattern = new RegExp(escapeRegExp(phrase), "gi");
    if (!pattern.test(result)) return;
    result = result.replace(pattern, token);
    protections.push({ token, original: phrase });
  });

  for (const allergy of allergySet) {
    const terms = ALLERGEN_TEXT_TERMS[allergy];
    if (!terms) continue;
    const replacement =
      allergy === "fish" || allergy === "egg" || allergy === "eggs" || allergy === "shellfish"
        ? slots.protein
        : allergy === "dairy" || allergy === "milk"
          ? slots.liquid !== "liquid"
            ? slots.liquid
            : slots.fat
          : slots.protein;
    for (const term of [...terms].sort((a, b) => b.length - a.length)) {
      result = replaceWholePhrase(result, term, replacement);
    }
  }

  for (const { token, original } of protections) {
    result = result.split(token).join(original);
  }
  return result;
}

export type ComposeMealCopyInput = {
  ingredients: Ingredient[];
  recipe?: Recipe;
  sourceInstructions?: string[];
  allergySet: Set<string>;
};

export type ComposedMealCopy = {
  name: string;
  instructions: string[];
};

/**
 * Keep the original recipe title (swap only allergen / unused option words),
 * rewrite steps to match ingredients on the plate, and guard allergen text.
 */
export function composeMealCopy(input: ComposeMealCopyInput): ComposedMealCopy {
  const { ingredients, recipe, sourceInstructions, allergySet } = input;
  const slots = buildSlotFills(ingredients);
  const renameMap = buildIngredientRenameMap(recipe, ingredients);
  const templates = sourceInstructions?.length
    ? sourceInstructions
    : recipe?.instructions?.length
      ? recipe.instructions
      : ["Combine {protein} with {veg}.", "Cook until done.", "Finish with {fat} and serve."];

  let instructions = templates.map((step) => {
    let next = fillPlaceholders(step, slots);
    next = applyRenameMap(next, renameMap, ingredients);
    if (allergySet.size > 0) next = scrubAllergenTerms(next, allergySet, slots, ingredients);
    return next.replace(/\s{2,}/g, " ").trim();
  });

  const baseTitle = recipe?.name?.trim() || "Balanced meal";
  let name = adaptRecipeTitle(baseTitle, ingredients, renameMap, allergySet, slots);

  const hit = mealCopyContainsForbiddenAllergenText(
    `${name}\n${instructions.join("\n")}`,
    allergySet,
    ingredients
  );
  if (hit) {
    name = scrubAllergenTerms(name, allergySet, slots, ingredients);
    instructions = instructions.map((step) => scrubAllergenTerms(step, allergySet, slots, ingredients));
    const still = mealCopyContainsForbiddenAllergenText(
      `${name}\n${instructions.join("\n")}`,
      allergySet,
      ingredients
    );
    if (still) {
      instructions = instructions
        .map((step) => scrubAllergenTerms(step, allergySet, slots, ingredients))
        .filter((step) => !mealCopyContainsForbiddenAllergenText(step, allergySet, ingredients));
      if (instructions.length === 0) {
        instructions = [
          `Cook the ${slots.protein} with ${slots.veg}.`,
          `Serve with ${slots.grain} and ${slots.fat}.`
        ];
      }
      name = adaptRecipeTitle(baseTitle, ingredients, renameMap, allergySet, slots);
      name = scrubAllergenTerms(name, allergySet, slots, ingredients);
    }
  }

  return { name, instructions };
}

export function assertMealCopySafeForAllergies(
  name: string,
  instructions: string[],
  allergies: string[],
  ingredients: Ingredient[] = []
): void {
  const allergySet = normalizeAllergySet(allergies);
  if (allergySet.size === 0) return;
  const hit = mealCopyContainsForbiddenAllergenText(
    `${name}\n${instructions.join("\n")}`,
    allergySet,
    ingredients
  );
  if (hit) {
    throw new Error(`Allergen term "${hit}" still present in meal copy: ${name}`);
  }
}
