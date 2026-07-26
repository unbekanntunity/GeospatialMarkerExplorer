export const isNullOrWhiteSpace = (
  value: string | null | undefined
): boolean => {
  return value == null || value.trim() === "";
};

export const stringsByAlphabet = (a: string, b: string) => {
  a = a.toLowerCase();
  b = b.toLowerCase();

  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
};
