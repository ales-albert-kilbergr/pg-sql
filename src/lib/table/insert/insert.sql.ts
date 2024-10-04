import { escapeIdentifier } from 'pg';
import type { Table } from '../table';
import { getReturningSql, getSchemaQualifiedName } from '../../sql/common.sql';
import { formatSqlText } from '../../helpers';
import type { Column } from '../../column';

/**
 * INSERT command
 *
 * create new rows in a table
 *
 * @link https://www.postgresql.org/docs/current/sql-insert.html
 */
export interface InsertSqlArgs {
  /**
   * Table to insert into
   */
  table: Table;
  /**
   *
   */
  returning?: string[];
  rowsCount?: number;
}

export function getInsertSql(args: InsertSqlArgs): string {
  const schemaQualifiedName = getSchemaQualifiedName(args.table);
  const returning = getReturningSql(args.returning);
  const columns = Array.from(args.table.columns).map((column) =>
    escapeIdentifier(column.name),
  );
  const rowsCount = args.rowsCount ?? 1;

  const values: string[] = [];
  for (let i = 0; i < rowsCount; i++) {
    let row = '(';

    for (let j = 0; j < columns.length; j++) {
      row += '$' + (i * columns.length + j + 1);
      if (j !== columns.length - 1) {
        row += ', ';
      }
    }

    row += ')';

    values.push(row);
  }

  return formatSqlText(`
    INSERT INTO ${schemaQualifiedName} 
      (${columns.join(', ')}) VALUES ${values.join(', ')}
      ${returning}
  `);
}

export type MapDataIntoRowsColumnLike = Pick<Column, 'propertyKey' | 'type'>;

export function serializeInsertValues(
  data: object[],
  columns: MapDataIntoRowsColumnLike[],
): unknown[][] {
  return data.map((d) =>
    Array.from(columns).map((c) =>
      c.type.serialize(Reflect.get(d, c.propertyKey) || null),
    ),
  );
}
