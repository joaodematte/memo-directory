export function isValidWebColor(input: string): boolean {
  if (!input) return false;

  return CSS.supports('color', input);
}
