import type { SqlTagParserContext } from '../../parser-context';

export function Identifier(name: string) {
  return (context: SqlTagParserContext): void => {
    context.addIdentifier(name);
  };
}
