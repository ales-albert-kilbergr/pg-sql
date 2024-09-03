import type { SqlTagParserContext } from '../../parser-context';

export function Cascade(useFlag: boolean) {
  return (context: SqlTagParserContext): void => {
    if (useFlag) {
      context.addKeyword('CASCADE');
    }
  };
}
