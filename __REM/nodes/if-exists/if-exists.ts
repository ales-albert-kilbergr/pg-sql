import type { SqlTagParserContext } from '../../parser-context';

export function IfExists(useFlag: boolean | undefined) {
  return (context: SqlTagParserContext): void => {
    if (useFlag === true) {
      context.addKeyword('IF EXISTS');
    }
  };
}
