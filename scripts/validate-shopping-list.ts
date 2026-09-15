import { buildShoppingList } from "../lib/shopping/list";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const sample = buildShoppingList([
  { name: "mustard", grams: 3, category: "spices" },
  { name: "dijon mustard", grams: 3, category: "spices" },
  { name: "avocado", grams: 10, category: "fats" },
  { name: "ghee", grams: 10, category: "fats" },
  { name: "water", grams: 96, category: "liquid" },
  { name: "greek yogurt", grams: 100, category: "liquid" },
  { name: "tomato paste", grams: 15, category: "vegetables" },
  { name: "tuna", grams: 120, category: "protein" },
  { name: "crackers", grams: 40, category: "carbs" },
  { name: "lettuce", grams: 80, category: "vegetables" },
  { name: "cucumber", grams: 100, category: "vegetables" }
]);

const buyLines = sample.sections
  .filter((section) => section.id !== "pantry_home")
  .flatMap((section) => section.items.map((item) => item.label));

assert(buyLines.some((line) => /1 jar Mustard/i.test(line)), "mustard types should merge to one jar line");
assert(!buyLines.some((line) => /Water/i.test(line)), "water should not appear as a buy line");
assert(buyLines.some((line) => /avocado/i.test(line)), "avocado should be a count line");
assert(
  !buyLines.some((line) => / — \d+ g$/.test(line)),
  "buy lines should not use old gram-only format"
);

const pantry = sample.sections.find((section) => section.id === "pantry_home");
assert(
  Boolean(pantry?.items.some((item) => item.label === "Water")),
  "water should be in pantry section"
);

console.log("validate-shopping-list: OK");
console.log(buyLines.join("\n"));
