export function keyboardCipher(input: string): string {
  const keyboardMap: { [key: string]: string } = {
    a: "q",
    b: "w",
    c: "e",
    d: "r",
    e: "t",
    f: "y",
    g: "u",
    h: "i",
    i: "o",
    j: "p",
    k: "a",
    l: "s",
    m: "d",
    n: "f",
    o: "g",
    p: "h",
    q: "j",
    r: "k",
    s: "l",
    t: "z",
    u: "x",
    v: "c",
    w: "v",
    x: "b",
    y: "n",
    z: "m",
  };

  return input
    .split("")
    .map((char) => keyboardMap[char] || char)
    .join("");
}
