import type { SqlTagParserContext } from '../../parser-context';

export function Text(text: string) {
  return (context: SqlTagParserContext): void => {
    context.addFragment(text);
  };
}
