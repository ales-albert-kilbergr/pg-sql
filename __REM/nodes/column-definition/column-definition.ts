import type { Column, ColumnType } from '../../model/column';
import type { SqlTagParserContext } from '../../parser-context';
import type { SqlKeyword } from '../../sql-keyword';

export function ColumnDefinition<T extends ColumnType, D, O extends object>(
  column: Column<T, D, O>,
) {
  return (ctx: SqlTagParserContext): void => {
    ctx.addIdentifier(column.name);
    ctx.addKeyword(column.type.toUpperCase() as SqlKeyword);
    if (column.nullable) {
      ctx.addKeyword('NULL');
    } else {
      ctx.addKeyword('NOT NULL');
    }

    if (column.defaultExpression !== undefined) {
      ctx.addKeyword('DEFAULT');
      ctx.addFragment(column.defaultExpression);
    }
  };
}
