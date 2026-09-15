import { IngredientCategory } from "@/types";
import {
  AISLE_LABELS,
  AISLE_ORDER,
  canonicalIngredientName,
  purchaseSpecFor,
  shoppingAisle,
  SupermarketAisle,
  titleCaseName
} from "@/lib/shopping/catalog";

export type ShoppingListInputLine = {
  name: string;
  grams: number;
  category: IngredientCategory;
};

export type ShoppingListItem = {
  id: string;
  label: string;
};

export type ShoppingListSection = {
  id: SupermarketAisle;
  title: string;
  items: ShoppingListItem[];
};

export type BuiltShoppingList = {
  sections: ShoppingListSection[];
};

function formatCountLine(totalGrams: number, unitGrams: number, singular: string, plural: string): string {
  const count = Math.max(1, Math.ceil(totalGrams / unitGrams));
  const word = count === 1 ? singular : plural;
  return count === 1 ? `1 ${word}` : `${count} ${word}`;
}

function formatPackLine(totalGrams: number, packGrams: number, label: string): string {
  const packs = Math.max(1, Math.ceil(totalGrams / packGrams));
  const sizeLabel = packGrams >= 1000 ? `${packGrams / 1000} kg` : `${packGrams} g`;
  if (packs === 1) return `${sizeLabel} pack ${label}`;
  return `${packs} × ${sizeLabel} pack ${label}`;
}

function formatJarOrCan(totalGrams: number, unitGrams: number, unit: "jar" | "can", label: string): string {
  const count = Math.max(1, Math.ceil(totalGrams / unitGrams));
  const titled = titleCaseName(label);
  if (count === 1) return `1 ${unit} ${titled}`;
  return `${count} ${unit}s ${titled}`;
}

export function formatPurchaseLine(
  canonical: string,
  totalGrams: number,
  category: IngredientCategory
): string | null {
  const spec = purchaseSpecFor(canonical, category);
  const label = spec.mode === "pantry" ? titleCaseName(canonical) : titleCaseName((spec as { label?: string }).label ?? canonical);

  switch (spec.mode) {
    case "pantry":
      return null;
    case "count":
      return formatCountLine(totalGrams, spec.unitGrams, spec.singular, spec.plural);
    case "pack":
      return formatPackLine(totalGrams, spec.packGrams, spec.label ?? canonical);
    case "jar":
      return formatJarOrCan(totalGrams, spec.jarGrams, "jar", spec.label);
    case "can":
      return formatJarOrCan(totalGrams, spec.canGrams, "can", spec.label);
    case "bottle":
      return `1 bottle ${label}`;
    case "carton":
      return totalGrams <= spec.cartonMl
        ? `1 carton ${label}`
        : `${Math.ceil(totalGrams / spec.cartonMl)} cartons ${label}`;
    case "tub":
      return totalGrams <= spec.tubGrams
        ? `1 tub ${label} (${spec.tubGrams} g)`
        : `${Math.ceil(totalGrams / spec.tubGrams)} tubs ${label} (${spec.tubGrams} g)`;
    case "loaf":
      return `1 loaf ${label}`;
    case "carton_eggs": {
      const eggs = Math.max(1, Math.ceil(totalGrams / spec.gramsPerEgg));
      const cartons = Math.ceil(eggs / spec.eggsPerCarton);
      return cartons === 1 ? `1 carton eggs (${spec.eggsPerCarton})` : `${cartons} cartons eggs (${spec.eggsPerCarton})`;
    }
    default:
      return formatPackLine(totalGrams, 200, canonical);
  }
}

export function buildShoppingList(lines: ShoppingListInputLine[]): BuiltShoppingList {
  const aggregated = new Map<string, { grams: number; category: IngredientCategory }>();

  for (const line of lines) {
    const canonical = canonicalIngredientName(line.name);
    const existing = aggregated.get(canonical);
    if (existing) {
      existing.grams += line.grams;
    } else {
      aggregated.set(canonical, { grams: line.grams, category: line.category });
    }
  }

  const byAisle = new Map<SupermarketAisle, Map<string, string>>();

  for (const [canonical, { grams, category }] of aggregated) {
    const aisle = shoppingAisle(canonical, category);
    const purchaseLine = formatPurchaseLine(canonical, grams, category);

    if (aisle === "pantry_home" || purchaseLine === null) {
      const pantry = byAisle.get("pantry_home") ?? new Map<string, string>();
      pantry.set(canonical, titleCaseName(canonical));
      byAisle.set("pantry_home", pantry);
      continue;
    }

    const aisleMap = byAisle.get(aisle) ?? new Map<string, string>();
    aisleMap.set(canonical, purchaseLine);
    byAisle.set(aisle, aisleMap);
  }

  const sections: ShoppingListSection[] = [];

  for (const aisleId of AISLE_ORDER) {
    const itemsMap = byAisle.get(aisleId);
    if (!itemsMap || itemsMap.size === 0) continue;

    const items = [...itemsMap.entries()]
      .sort((a, b) => a[1].localeCompare(b[1]))
      .map(([canonical, label]) => ({
        id: `${aisleId}:${canonical}`,
        label
      }));

    sections.push({
      id: aisleId,
      title: AISLE_LABELS[aisleId],
      items
    });
  }

  return { sections };
}

export function shoppingListAsPlainText(list: BuiltShoppingList, checkedIds?: Set<string>): string {
  const lines: string[] = ["SHOPPING LIST", ""];
  for (const section of list.sections) {
    lines.push(section.title.toUpperCase());
    for (const item of section.items) {
      const box = checkedIds?.has(item.id) ? "[x]" : "[ ]";
      lines.push(`${box} ${item.label}`);
    }
    lines.push("");
  }
  return lines.join("\n").trim();
}
