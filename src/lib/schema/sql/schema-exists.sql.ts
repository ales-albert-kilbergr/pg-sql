import type { Schema } from '../schema';
import { formatSqlText } from '../../helpers';
import { SqlQuery, type SqlQueryWithArgs } from '../../sql-query';
import { existsPipe } from '../../pipe';

export class Args {
  public schema!: Schema;
}

export type Query = SqlQueryWithArgs<Args, boolean>;

export function getSql(): string {
  return formatSqlText(`
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.schemata
      WHERE schema_name = $1
    ) AS "exists";
  `);
}

export function create(schema?: Schema): Query {
  const query = SqlQuery.from(Args)
    .useSqlTextBuilder(getSql)
    .useValueSerializer((args) => [args.schema.name])
    .useResultParser(existsPipe);

  if (schema) {
    query.schema(schema);
  }

  return query;
}
