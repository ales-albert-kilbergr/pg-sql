export function toCamelCase(str: string): string {
  return str.replace(/([-_\s][a-z])/gi, (match) => {
    return match.toUpperCase().replaceAll(/[-_\s]/g, '');
  });
}
