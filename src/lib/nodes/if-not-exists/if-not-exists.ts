import type { SqlTagParserContext } from '../../parser-context';

export function IfNotExists(useFlag: boolean | undefined) {
  return (context: SqlTagParserContext): void => {
    if (useFlag === true) {
      context.addKeyword('IF NOT EXISTS');
    }
  };
}
