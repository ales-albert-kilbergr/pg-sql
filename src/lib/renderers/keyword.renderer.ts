export function renderKeyword(keyword?: string): string {
  return keyword !== undefined && keyword.length > 0
    ? ` ${keyword.toUpperCase()} `
    : '';
}
