import type { SqlTagParserContext } from '../../parser-context';

export interface PagingProps {
  limit?: number;
  offset?: number;
}

export const DEFAULT_PAGING_OFFSET = 0;
export const DEFAULT_PAGING_LIMIT = 100;

export const DEFAULT_PAGING: PagingProps = {
  limit: DEFAULT_PAGING_LIMIT,
  offset: DEFAULT_PAGING_OFFSET,
};

export function Paging(
  props?: PagingProps,
): (context: SqlTagParserContext) => void;
export function Paging(
  limit?: number,
  offset?: number,
): (context: SqlTagParserContext) => void;
export function Paging(
  arg1: number | PagingProps = DEFAULT_PAGING_LIMIT,
  arg2: number = DEFAULT_PAGING_OFFSET,
) {
  const limit =
    typeof arg1 === 'number' ? arg1 : (arg1.limit ?? DEFAULT_PAGING_LIMIT);
  const offset =
    typeof arg1 === 'number' ? arg2 : (arg1.offset ?? DEFAULT_PAGING_OFFSET);

  return (context: SqlTagParserContext): void => {
    const localFragments: string[] = [];
    const limitIdx = context.getNextValueIndex();
    context.values.push(limit);
    const offsetIdx = context.getNextValueIndex();
    context.values.push(offset);

    localFragments.push('LIMIT ', limitIdx, ' OFFSET ', offsetIdx);

    context.addFragment(localFragments.join(''));
  };
}
