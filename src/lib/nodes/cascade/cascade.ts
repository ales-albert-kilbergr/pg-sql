import type { SqlTagParserContext } from '../../parser-context';

export function Cascade(useFlag: boolean | undefined) {
  return (context: SqlTagParserContext): void => {
    if (useFlag === true) {
      context.addKeyword('CASCADE');
    }
  };
}
