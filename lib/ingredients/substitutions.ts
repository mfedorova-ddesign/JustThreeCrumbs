export const INGREDIENT_SUBSTITUTIONS: Record<string, string[]> = {
  potato: ["sweet potato", "pumpkin", "zucchini"],
  "sweet potato": ["pumpkin", "zucchini"],
  zucchini: ["eggplant", "pumpkin", "broccoli"],
  eggplant: ["zucchini", "broccoli"],
  broccoli: ["cauliflower", "green beans"],
  cauliflower: ["broccoli", "zucchini"],
  "green peas": ["green beans", "broccoli"],
  "green beans": ["green peas", "broccoli"]
};
