import type { SqlTagParserContext } from '../parser-context';
import { escapeLiteral } from 'pg';
// No available types for prepareValue in pg
// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
const { prepareValue } = require('pg/lib/utils');

export interface RenderLiteralArgs {
  value: unknown;
  spreadValues?: boolean;
}

export function renderLiteral(
  ctx: SqlTagParserContext,
  { value, spreadValues }: RenderLiteralArgs,
): void {
  if (spreadValues === true) {
    const nodeArr = Array.isArray(value) ? value : [value];

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const preparedValues = nodeArr.map((n) => {
      if (n === undefined) {
        return 'DEFAULT';
      }
      if (n === null) {
        return 'NULL';
      }
      return escapeLiteral(String(prepareValue(n)));
    });

    ctx.addFragment(preparedValues.join(', '));
  } else {
    if (value === undefined) {
      ctx.addFragment('DEFAULT');
    } else if (value === null) {
      ctx.addFragment('NULL');
    } else {
      ctx.addFragment(escapeLiteral(String(prepareValue(value))));
    }
  }
}
