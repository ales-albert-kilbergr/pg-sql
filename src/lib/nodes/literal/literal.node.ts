import type { SqlTagParserContext } from '../../parser-context';
import { escapeLiteral } from 'pg';
// No available types for prepareValue in pg
// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
const { prepareValue } = require('pg/lib/utils');

export declare namespace Literal {
  export interface Options {
    /**
     * If true, the value will be spread into the query.
     * If false, the value will be treated as a single value.
     */
    spreadValues?: boolean;
  }
}

export function Literal(
  value: unknown,
  options: Literal.Options = Literal.DEFAULT_OPTIONS,
) {
  return (context: SqlTagParserContext): void => {
    if (options.spreadValues) {
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

      context.addFragment(preparedValues.join(', '));
    } else {
      if (value === undefined) {
        context.addFragment('DEFAULT');
      } else if (value === null) {
        context.addFragment('NULL');
      } else {
        context.addFragment(escapeLiteral(String(prepareValue(value))));
      }
    }
  };
}

Literal.DEFAULT_OPTIONS = {
  spreadValues: false,
} as Literal.Options;
