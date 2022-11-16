export async function asyncMap<T, R>(
  array: T[],
  f: (element: T) => Promise<R>,
): Promise<R[]> {
  let results = [];
  for (const element of array) {
    const result = await f(element);
    results.push(result);
  }
  return results;
}

export function lastIndexOfRegex(string: string, pattern: RegExp): number {
  const matches = [...string.matchAll(pattern)];
  if (matches.length == 0) return -1;
  return matches[matches.length - 1].index!;
}

export function rangeInclusive(start: number, end: number): number[] {
  return [...Array(end - start + 1)].map((_, i) => start + i);
}
