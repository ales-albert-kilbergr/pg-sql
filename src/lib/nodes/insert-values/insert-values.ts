import type { SqlTagParserContext } from '../../parser-context';

export declare namespace InsertValues {
  export interface Options {
    columns?: string[];
  }
}

const DEFAULT_OPTIONS: InsertValues.Options = {};

export function InsertValues(
  values: Record<string, unknown> | Record<string, unknown>[],
  options: InsertValues.Options = DEFAULT_OPTIONS,
) {
  const valueArr = Array.isArray(values) ? values : [values];
  const columns = options.columns ?? Object.keys(valueArr[0]);

  return (context: SqlTagParserContext): void => {
    context.addKeyword('VALUES');

    for (let i = 0; i < valueArr.length; i++) {
      const row = valueArr[i];
      if (i > 0) {
        context.addFragment(', ');
      }
      context.openBracket();
      for (let c = 0; c < columns.length; c++) {
        const column = columns[c];
        if (c > 0) {
          context.addFragment(', ');
        }
        context.addIdentifier(column);
        context.addFragment(' = ');
        context.bindValue(row[column]);
      }
      context.closeBracket();
    }
  };
}
