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

export interface OrderByProps {
  column: string;
  direction?: OrderByDirection;
  nulls?: OrderByNulls;
}

export const DEFAULT_ORDER_DIRECTION = OrderByDirection.ASC;

export const DEFAULT_NULLS = OrderByNulls.LAST;

export function OrderBy(
  column: string,
  direction?: OrderByDirection,
  nulls?: OrderByNulls,
): (context: SqlTagParserContext) => void;
export function OrderBy(
  props: OrderByProps | OrderByProps[],
): (context: SqlTagParserContext) => void;
export function OrderBy(
  arg1: string | OrderByProps | OrderByProps[],
  direction: OrderByDirection = DEFAULT_ORDER_DIRECTION,
  nulls: OrderByNulls = DEFAULT_NULLS,
): (context: SqlTagParserContext) => void {
  if (typeof arg1 === 'string') {
    return OrderBy([{ column: arg1, direction, nulls }]);
  } else if (!Array.isArray(arg1)) {
    return OrderBy([arg1]);
  }

  return (context: SqlTagParserContext) => {
    const localFragments: string[] = ['ORDER BY '];

    for (let i = 0; i < arg1.length; i++) {
      const orderBy = arg1[i];
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

      if (i < arg1.length - 1) {
        localFragments.push(', ');
      }
    }

    context.addFragment(localFragments.join(''));
  };
}
