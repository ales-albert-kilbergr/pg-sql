import { formatSqlText } from '../../helpers';
import { escapeIdentifier } from 'pg';
import { getIfExistsSql } from '../../sql';
import type { Database } from '../database';
import { SqlQuery, type SqlQueryWithArgs } from '../../sql-query';

export class Args {
  public database!: Database;

  public ifExists = false;

  public withForce = false;
}

export type Query = SqlQueryWithArgs<Args>;

export function getSql(command: Args): string {
  const databaseName = escapeIdentifier(command.database.name);
  const ifExists = getIfExistsSql(command.ifExists);
  const withForce = command.withForce ? 'WITH (FORCE)' : '';

  return formatSqlText(
    `DROP DATABASE ${ifExists} ${databaseName} ${withForce};`,
  );
}
/**
 *
 * @param database
 * @returns
 *
 * @see https://www.postgresql.org/docs/current/sql-dropdatabase.html
 */
export function create(database?: Database): Query {
  const query = SqlQuery.from(Args).useSqlTextBuilder(getSql);

  if (database) {
    query.database(database);
  }

  return query;
}
