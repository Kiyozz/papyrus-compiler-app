export function uniqueArray<T>(array: T[]) {
  return array.filter((value: T, index: number, self: T[]) => {
    return self.indexOf(value) === index;
  });
}

export function mergeUnique(first: string[], second: string[]) {
  return uniqueArray([...first, ...second]);
}
