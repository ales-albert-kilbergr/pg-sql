import type { SqlTagParserContext } from '../../parser-context';

export function IfNotExists(useFlag: boolean) {
  return (context: SqlTagParserContext): void => {
    if (useFlag) {
      context.addKeyword('IF NOT EXISTS');
    }
  };
}
