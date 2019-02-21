import { scriptStringSeparator } from '../preferences-keys';

export function uniqueArray<T>(array: T[]) {
  return array.filter((value: T, index: number, self: T[]) => {
    return self.indexOf(value) === index;
  });
}

export function getScriptsFromString(scriptsAsString: string | null): string[] {
  return scriptsAsString ? scriptsAsString.split(scriptStringSeparator) : [];
}
