import type { SqlTagParserContext } from '../../parser-context';

export function IfExists(useFlag: boolean) {
  return (context: SqlTagParserContext): void => {
    if (useFlag) {
      context.addKeyword('IF EXISTS');
    }
  };
}
