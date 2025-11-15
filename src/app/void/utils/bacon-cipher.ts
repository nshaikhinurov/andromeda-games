export function baconCipher(text: string, separator: string = " "): string {
  const baconMap: { [key: string]: string } = {
    a: "AAAAA",
    b: "AAAAB",
    c: "AAABA",
    d: "AAABB",
    e: "AABAA",
    f: "AABAB",
    g: "AABBA",
    h: "AABBB",
    i: "ABAAA",
    j: "ABAAA",
    k: "ABAAB",
    l: "ABABA",
    m: "ABABB",
    n: "ABBAA",
    o: "ABBAB",
    p: "ABBBA",
    q: "ABBBB",
    r: "BAAAA",
    s: "BAAAB",
    t: "BAABA",
    u: "BAABB",
    v: "BAABB",
    w: "BABAA",
    x: "BABAB",
    y: "BABBA",
    z: "BABBB",
  };

  return text
    .toLowerCase()
    .split("")
    .map((char) => baconMap[char] || "")
    .join(separator);
}
