import type { SqlTagParserContext } from '../../parser-context';

export function Returning(columns: string[]) {
  return (context: SqlTagParserContext): void => {
    if (columns.length > 0) {
      context.addKeyword('RETURNING');
      for (let i = 0; i < columns.length; i++) {
        if (i > 0) {
          context.addFragment(', ');
        }
        context.addIdentifier(columns[i]);
      }
    }
  };
}
