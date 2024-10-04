import { formatSqlText } from '../../helpers';
import type { TableExistsArgs } from './table-exists.args';

/**
 *
 * $1: table_schema
 * $2: table_name
 *
 * @returns
 */
export function getTableExistsSql(): string {
  return formatSqlText(`
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.tables
      WHERE table_schema = $1
      AND table_name = $2
    ) as "exists";
  `);
}

export function serializeTableExistsSqlValues(
  args: TableExistsArgs,
): unknown[] {
  return [args.table.schema.name, args.table.name];
}
