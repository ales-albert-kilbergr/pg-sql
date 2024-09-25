import { SchemaAuthorization } from '../model';
import { renderIdentifier } from './identifier.renderer';
import { renderKeyword } from './keyword.renderer';

const RESERVED_KEYWORDS: string[] = [
  SchemaAuthorization.CURRENT_ROLE,
  SchemaAuthorization.SESSION_USER,
  SchemaAuthorization.CURRENT_USER,
] as const;

export function renderAuthorization(authorization: string | undefined): string {
  if (authorization === undefined || authorization.length === 0) return '';

  let result = renderKeyword('AUTHORIZATION');

  if (RESERVED_KEYWORDS.includes(authorization)) {
    result += renderKeyword(authorization);
  } else {
    result += ' ' + renderIdentifier(authorization);
  }

  return result;
}
