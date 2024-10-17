import { escapeIdentifier } from 'pg';
import { formatSqlText } from '../../helpers';
import type { Database } from '..';
import { SqlQuery, type SqlQueryWithArgs } from '../../sql-query';

export class Args {
  public database!: Database;

  public withOwner?: string;
}

export type Query = SqlQueryWithArgs<Args>;

export function getSql(args: Args): string {
  const databaseName = escapeIdentifier(
    typeof args.database === 'string' ? args.database : args.database.name,
  );

  const withParams = [];

  if (args.withOwner) {
    withParams.push(`OWNER = ${escapeIdentifier(args.withOwner)}`);
  }

  const withParamsText = withParams.length
    ? `WITH ${withParams.join(' ')}`
    : '';

  const sql = formatSqlText(`
    CREATE DATABASE ${databaseName}
    ${withParamsText};
  `);

  return sql;
}
/**
 *
 * @param database
 * @returns
 *
 * @see https://www.postgresql.org/docs/current/sql-createdatabase.html
 */
export function create(database?: Database): Query {
  const query = SqlQuery.from(Args).useSqlTextBuilder(getSql);

  if (database) {
    query.database(database);
  }

  return query;
}
