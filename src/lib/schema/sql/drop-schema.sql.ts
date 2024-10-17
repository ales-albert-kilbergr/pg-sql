import type { Schema } from '../schema';
import { escapeIdentifier } from 'pg';
import { getCascadeSql, getIfExistsSql } from '../../sql';
import { formatSqlText } from '../../helpers';
import { SqlQuery, type SqlQueryWithArgs } from '../../sql-query';

/**
 * A schema can only be dropped by its owner or a superuser. Note that the owner
 * can drop the schema (and thereby all contained objects) even if they do not
 * own some of the objects within the schema.
 */
export class Args {
  /**
   * The schema to drop
   */
  public schema!: Schema;
  /**
   * Do not throw an error if the schema does not exist.
   * A notice is issued in this case.
   */
  public ifExists = false;
  /**
   * Automatically drop objects (tables, functions, etc.) that are contained
   * in the schema, and in turn all objects that depend on those objects
   *
   * @link https://www.postgresql.org/docs/current/ddl-depend.html
   */
  public cascade = false;
}

export type Query = SqlQueryWithArgs<Args>;

export function getSql(command: Args): string {
  const schemaName = escapeIdentifier(command.schema.name);
  const ifExists = getIfExistsSql(command.ifExists);
  const cascade = getCascadeSql(command.cascade);

  return formatSqlText(`DROP SCHEMA ${ifExists} ${schemaName} ${cascade};`);
}

export function create(schema?: Schema): Query {
  const query = SqlQuery.from(Args).useSqlTextBuilder(getSql);

  if (schema) {
    query.schema(schema);
  }

  return query;
}
