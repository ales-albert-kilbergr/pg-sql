import { formatSqlText } from '../../helpers';
import { columnToArray, pickFirstRecord, pipe } from '../../pipe';
import { getSchemaQualifiedName } from '../../sql';
import { SqlQuery, type SqlQueryWithArgs } from '../../sql-query';
import type { Table } from '../table';

export class Args {
  public from!: Table;
}

export type Query = SqlQueryWithArgs<Args, number>;

export function getSql(args: Args): string {
  const schemaQualifiedName = getSchemaQualifiedName(args.from);

  return formatSqlText(`
    SELECT COUNT(1) FROM ${schemaQualifiedName} as "count"
  `);
}

export const countPipe = pipe(
  columnToArray<number>('count'),
  pickFirstRecord<number>(),
);

export function create(table?: Table): Query {
  const query = SqlQuery.from(Args)
    .useSqlTextBuilder(getSql)
    .useResultParser(countPipe);

  if (table) {
    query.from(table);
  }

  return query;
}
