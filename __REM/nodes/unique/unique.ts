import type { SqlTagParserContext } from '../../parser-context';

export function Unique(useFlag: boolean | undefined) {
  return (context: SqlTagParserContext): void => {
    if (useFlag === true) {
      context.addKeyword('UNIQUE');
    }
  };
}
