import { SchemaAuthorization } from '../model/common';
import type { SqlTagParserContext } from '../parser-context';
import type { SqlKeyword } from '../sql-keyword';

export function Authorization(authorization?: string | SchemaAuthorization) {
  return (ctx: SqlTagParserContext): void => {
    if (authorization === undefined || authorization.length === 0) return;

    ctx.addKeyword('AUTHORIZATION');
    if (
      [
        SchemaAuthorization.CURRENT_ROLE,
        SchemaAuthorization.SESSION_USER,
        SchemaAuthorization.CURRENT_USER,
      ].includes(authorization as SchemaAuthorization)
    ) {
      ctx.addKeyword(authorization as unknown as SqlKeyword);
    } else {
      ctx.addIdentifier(authorization);
    }
  };
}
