import type { Schema } from '../schema';
import { escapeIdentifier } from 'pg';
import { getAuthorizationSql, getIfNotExistsSql } from '../../sql';
import { formatSqlText } from '../../helpers';
import { SqlQuery, type SqlQueryWithArgs } from '../../sql-query';

export class Args {
  public schema!: Schema;
  public ifNotExists = false;
  public authorization?: string;
}

export type Query = SqlQueryWithArgs<Args>;

export function getSql(command: Args): string {
  const schemaName = escapeIdentifier(command.schema.name);
  const authorization = getAuthorizationSql(command.authorization);
  const ifNotExists = getIfNotExistsSql(command.ifNotExists);

  return formatSqlText(
    `CREATE SCHEMA ${ifNotExists} ${authorization} ${schemaName};`,
  );
}

export function create(schema?: Schema): Query {
  const query = SqlQuery.from(Args).useSqlTextBuilder(getSql);

  if (schema) {
    query.schema(schema);
  }

  return query;
}
