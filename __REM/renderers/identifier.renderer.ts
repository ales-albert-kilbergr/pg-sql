import { escapeIdentifier } from 'pg';

export function renderIdentifier(identifier?: string | string[]): string {
  if (Array.isArray(identifier)) {
    return identifier.map(escapeIdentifier).join(', ');
  } else if (identifier && identifier.length > 0) {
    return escapeIdentifier(identifier);
  } else {
    return '';
  }
}
