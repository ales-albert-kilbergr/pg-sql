import type { SqlTagParserContext } from '../../parser-context';

export function Concurrently(useFlag: boolean | undefined) {
  return (context: SqlTagParserContext): void => {
    if (useFlag === true) {
      context.addKeyword('CONCURRENTLY');
    }
  };
}
