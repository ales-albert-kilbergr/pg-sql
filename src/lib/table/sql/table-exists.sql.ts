import type { Table } from '../table';
import { formatSqlText } from '../../helpers';
import { SqlQuery, type SqlQueryWithArgs } from '../../sql-query';
import { existsPipe } from '../../pipe';

export class Args {
  public table!: Table;
}

export type Query = SqlQueryWithArgs<Args, boolean>;

/**
 *
 * $1: table_schema
 * $2: table_name
 *
 * @returns
 */
export function getSql(): string {
  return formatSqlText(`
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.tables
      WHERE table_schema = $1
      AND table_name = $2
    ) as "exists";
  `);
}

export function serializeValues(args: Args): unknown[] {
  return [args.table.schema.name, args.table.name];
}

export function create(table?: Table): Query {
  const query = SqlQuery.from(Args)
    .useSqlTextBuilder(getSql)
    .useValueSerializer(serializeValues)
    .useResultParser(existsPipe);

  if (table) {
    query.table(table);
  }

  return query;
}
