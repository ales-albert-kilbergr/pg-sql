import type { SqlTagParserContext } from '../../parser-context';

export function Only(useFlag: boolean | undefined) {
  return (context: SqlTagParserContext): void => {
    if (useFlag === true) {
      context.addKeyword('ONLY');
    }
  };
}
