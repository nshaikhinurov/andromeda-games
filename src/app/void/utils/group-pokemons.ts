import * as fs from "fs";
import * as path from "path";

/**
 * Подсчитывает количество уникальных символов в строке
 */
function countUniqueCharacters(str: string): number {
  return new Set(str.toLowerCase()).size;
}

/**
 * Читает файл с покемонами и группирует их по количеству уникальных символов
 */
function groupPokemonsByUniqueCharacters(
  filePath: string,
): Map<number, string[]> {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const pokemons = fileContent
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const groups = new Map<number, string[]>();

  for (const pokemon of pokemons) {
    const uniqueCount = countUniqueCharacters(pokemon);

    if (!groups.has(uniqueCount)) {
      groups.set(uniqueCount, []);
    }

    groups.get(uniqueCount)!.push(pokemon);
  }

  return groups;
}

/**
 * Выводит результаты группировки в консоль
 */
function printResults(groups: Map<number, string[]>): void {
  const sortedKeys = Array.from(groups.keys()).sort((a, b) => a - b);

  console.log("Группировка покемонов по количеству уникальных символов:\n");

  for (const count of sortedKeys) {
    const pokemons = groups.get(count)!;
    console.log(
      `\n📊 ${count} уникальных символов (${pokemons.length} покемонов):`,
    );
    console.log(`   ${pokemons.join(", ")}`);
  }

  console.log("\n" + "=".repeat(80));
  console.log(`Всего уникальных групп: ${groups.size}`);
  console.log(
    `Всего покемонов: ${Array.from(groups.values()).reduce((sum, arr) => sum + arr.length, 0)}`,
  );
}

// Основное выполнение
const pokemonsFile = path.join(__dirname, "pokemons.txt");

if (!fs.existsSync(pokemonsFile)) {
  console.error(`Ошибка: файл ${pokemonsFile} не найден`);
  process.exit(1);
}

const groups = groupPokemonsByUniqueCharacters(pokemonsFile);
printResults(groups);
