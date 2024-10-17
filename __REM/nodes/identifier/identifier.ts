import type { SqlTagParserContext } from '../../parser-context';

export function Identifier(name: string | string[]) {
  return (context: SqlTagParserContext): void => {
    if (Array.isArray(name)) {
      name.forEach((n, index) => {
        context.addIdentifier(n);
        if (index < name.length - 1) {
          context.addComma();
        }
      });
    } else {
      context.addIdentifier(name);
    }
  };
}
