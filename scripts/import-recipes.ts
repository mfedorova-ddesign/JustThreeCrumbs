import { writeFile } from "node:fs/promises";
import path from "node:path";

type SheetRow = Record<string, string>;

const SHEET_ID = "182OK9D784R-hhbc5ZXXuwAJ2nCofaMfP9uSbs-w8t68";
const GID = "1308718379";
const DEFAULT_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID}`;

function parseCsv(csv: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < csv.length; i += 1) {
    const ch = csv[i];
    const next = csv[i + 1];
    if (ch === '"' && inQuotes && next === '"') {
      current += '"';
      i += 1;
      continue;
    }
    if (ch === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (ch === "," && !inQuotes) {
      row.push(current.trim());
      current = "";
      continue;
    }
    if ((ch === "\n" || ch === "\r") && !inQuotes) {
      if (ch === "\r" && next === "\n") i += 1;
      row.push(current.trim());
      if (row.some((cell) => cell.length > 0)) rows.push(row);
      row = [];
      current = "";
      continue;
    }
    current += ch;
  }
  if (current.length > 0 || row.length > 0) {
    row.push(current.trim());
    rows.push(row);
  }
  return rows;
}

function asRows(table: string[][]): SheetRow[] {
  if (table.length === 0) return [];
  const header = table[0].map((h) => h.trim().toLowerCase());
  return table.slice(1).map((cells) => {
    const row: SheetRow = {};
    header.forEach((key, i) => {
      row[key] = (cells[i] ?? "").trim();
    });
    return row;
  });
}

function splitList(value: string): string[] {
  return value
    .split(/[|,;]/g)
    .map((x) => x.trim())
    .filter(Boolean);
}

function pick(row: SheetRow, keys: string[]): string {
  for (const key of keys) {
    const value = row[key.toLowerCase()];
    if (value) return value;
  }
  return "";
}

async function main() {
  const csvUrl = process.env.RECIPES_CSV_URL ?? DEFAULT_CSV_URL;
  const outputPath = process.env.RECIPES_OUTPUT ?? path.resolve("lib/recipes/imported.json");
  const response = await fetch(csvUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch sheet CSV: ${response.status} ${response.statusText}`);
  }
  const csv = await response.text();
  const parsed = parseCsv(csv);
  const rows = asRows(parsed);

  const normalized = rows.map((row, index) => {
    const idRaw = pick(row, ["id", "recipe_id", "slug", "name"]);
    const name = pick(row, ["name", "recipe", "title"]) || `Recipe ${index + 1}`;
    const mealTypeRaw = pick(row, ["meal_type", "type", "category"]).toLowerCase();
    const mealTypes =
      mealTypeRaw === "breakfast" || mealTypeRaw === "lunch" || mealTypeRaw === "dinner" || mealTypeRaw === "snack"
        ? [mealTypeRaw]
        : splitList(mealTypeRaw).filter((x) =>
            ["breakfast", "lunch", "dinner", "snack"].includes(x.toLowerCase())
          );
    const ingredients = splitList(pick(row, ["ingredients", "ingredient_list"]));
    const substitutions = splitList(pick(row, ["substitutions", "alternatives"]));
    const instructions = splitList(pick(row, ["instructions", "steps", "method"]));

    return {
      id: (idRaw || name)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, ""),
      name,
      mealTypes: mealTypes.length > 0 ? mealTypes : ["lunch"],
      ingredients,
      substitutions,
      instructions
    };
  });

  await writeFile(outputPath, JSON.stringify(normalized, null, 2), "utf8");
  process.stdout.write(`Imported ${normalized.length} recipes to ${outputPath}\n`);
}

main().catch((error) => {
  process.stderr.write(`${String(error)}\n`);
  process.exit(1);
});
