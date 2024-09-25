import { formatIdentifier } from '../../helpers/format-identifier/format-identifier';
import type { SqlTagParserContext } from '../../parser-context';

export enum OrderByNulls {
  FIRST = 'NULLS FIRST',
  LAST = 'NULLS LAST',
}

export enum OrderByDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface OrderByArgs {
  column: string;
  direction?: OrderByDirection;
  nulls?: OrderByNulls;
}

export const DEFAULT_ORDER_DIRECTION = OrderByDirection.ASC;

export const DEFAULT_NULLS = OrderByNulls.LAST;

export function OrderBy(
  args?: OrderByArgs | OrderByArgs[],
): (context: SqlTagParserContext) => void {
  return (context: SqlTagParserContext) => {
    if (!args || (Array.isArray(args) && args.length === 0)) {
      return;
    }
    const argsArr = Array.isArray(args) ? args : [args];

    const localFragments: string[] = ['ORDER BY '];

    for (let i = 0; i < argsArr.length; i++) {
      const orderBy = argsArr[i];
      localFragments.push(
        formatIdentifier(orderBy.column, {
          toLowerCase: true,
          toSneakCase: true,
          useQuotes: true,
        }),
        ' ',
        orderBy.direction ?? DEFAULT_ORDER_DIRECTION,
        ' ',
        orderBy.nulls ?? DEFAULT_NULLS,
      );

      if (i < argsArr.length - 1) {
        localFragments.push(', ');
      }
    }

    context.addFragment(localFragments.join(''));
  };
}
