import type { ColumnList } from '../../model/column';
import type { SqlTagParserContext } from '../../parser-context';
import { ColumnDefinition } from '../column-definition/column-definition';

export function TableColumnDefinition(columns: ColumnList) {
  const colFns = columns.toArray().map((column) => ColumnDefinition(column));

  return (ctx: SqlTagParserContext): void => {
    for (const colFn of colFns) {
      colFn(ctx);
      // Add comma after each column definition, except the last one
      if (colFns.indexOf(colFn) !== colFns.length - 1) {
        ctx.addComma();
      }
    }
  };
}
