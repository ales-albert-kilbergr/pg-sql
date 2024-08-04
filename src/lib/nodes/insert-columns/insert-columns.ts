import type { SqlTagParserContext } from '../../parser-context';

export declare namespace InsertColumns {
  export interface Options {
    transformKey?: (key: string) => string;
  }
}

const DEFAULT_OPTIONS: InsertColumns.Options = {};

export function InsertColumns(
  columns: string[],
  options: InsertColumns.Options = DEFAULT_OPTIONS,
) {
  return (context: SqlTagParserContext): void => {
    context.openBracket();
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (i > 0) {
        context.addFragment(', ');
      }
      context.addIdentifier(options.transformKey?.(column) ?? column);
    }
    context.closeBracket();
  };
}
