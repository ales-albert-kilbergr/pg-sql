import type { SqlTagParserContext } from '../../parser-context';

export function InsertInto(table: string, alias?: string) {
  return (context: SqlTagParserContext): void => {
    context.addKeyword('INSERT INTO');
    context.addIdentifier(table);

    if (alias !== undefined) {
      context.addKeyword('AS');
      context.addIdentifier(alias);
    }
  };
}
