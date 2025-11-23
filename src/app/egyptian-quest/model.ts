/**
 * Хэширует строку в 4-значный код (0000–9999), избегая коллизий с белым списком.
 * @param str - исходная строка
 * @param whitelist - массив строк, которые уже заняли свои 4-значные коды
 */
export async function hashTo4Digits(
  str: string,
  whitelist: string[],
): Promise<string> {
  const usedCodes = new Set<string>();
  for (const w of whitelist) {
    const code = await shaTo4Digits(w);
    usedCodes.add(code);
  }

  let attempt = 0;
  while (true) {
    const candidate = await shaTo4Digits(
      attempt === 0 ? str : `${str}#${attempt}`,
    );

    if (!usedCodes.has(candidate)) {
      return candidate;
    }

    attempt++;
    if (attempt > 1000) {
      throw new Error("Не удалось найти уникальный код без коллизий");
    }
  }
}

/** Вспомогательное: SHA-256 → mod 10000 → паддинг */
async function shaTo4Digits(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const buffer = encoder.encode(data);

  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  // берём первые 4 байта как 32-бит число
  const number =
    ((hashArray[0] << 24) |
      (hashArray[1] << 16) |
      (hashArray[2] << 8) |
      hashArray[3]) >>>
    0;

  const mod = number % 10000;
  return mod.toString().padStart(4, "0");
}
